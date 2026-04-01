import { getGoogleClient } from "@/lib/openid-client";
import { Controller, type ControllerDeps } from "./Controller";
import {
  authorizationCodeGrant,
  calculatePKCECodeChallenge,
  type IDToken,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";
import { env } from "@/lib/env";
import { Status, type ErrorServerResponse } from "@/types/server-response";
import { logger } from "@/lib/logger";
import type { Request, Response } from "express";
import { ConnexionController } from "./ConnexionController";

interface GoogleDeps extends ControllerDeps {
  req: Request;
  res: Response;
}

export default class GooogleController extends Controller<GoogleDeps> {
  private readonly cookieSecure = false;

  private buildRedirectUrl(
    authorization_endpoint: string,
    state: string,
    codeChallenge: string,
  ): URL {
    const redirectUrl = new URL(authorization_endpoint);
    redirectUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
    redirectUrl.searchParams.set("redirect_uri", env.GOOGLE_REDIRECT_URI);
    redirectUrl.searchParams.set("response_type", "code");
    redirectUrl.searchParams.set("scope", "openid email profile");
    redirectUrl.searchParams.set("state", state);
    redirectUrl.searchParams.set("code_challenge", codeChallenge);
    redirectUrl.searchParams.set("code_challenge_method", "S256");
    return redirectUrl;
  }

  private buildCookies(codeVerifier: string, state: string) {
    this.deps.res.cookie("oauth_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: "lax",
    });
    this.deps.res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: "lax",
    });
  }

  private extractClaims(claims: IDToken) {
    const email = typeof claims.email === "string" ? claims.email : null;
    const picture = typeof claims.picture === "string" ? claims.picture : "";
    const name = typeof claims.name === "string" ? claims.name : null;
    const sub = claims.sub;

    if (!email) throw new Error("Missing email in Google claims");
    if (!name) throw new Error("Missing name in Google claims");

    return { email, picture, name, sub };
  }

  async getRedirect(): Promise<
    ErrorServerResponse | { success: true; redirect: string }
  > {
    try {
      const client = await getGoogleClient();
      const codeVerifier = randomPKCECodeVerifier();
      const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
      const state = randomState();

      this.buildCookies(codeVerifier, state);

      const { authorization_endpoint } = client.serverMetadata();
      if (!authorization_endpoint) throw new Error("No authorization endpoint");

      const redirectUrl = this.buildRedirectUrl(
        authorization_endpoint,
        state,
        codeChallenge,
      );

      return { success: true, redirect: redirectUrl.toString() };
    } catch (err) {
      logger.error("Google Oauth GET redirect failed", err);
      return {
        success: false,
        status: Status.UnknownError,
        title: "Internal error",
        description: "Please try later",
      };
    }
  }

  async getCallback() {
    const client = await getGoogleClient();

    const codeVerifier = this.deps.req.cookies.oauth_code_verifier;
    const expectedState = this.deps.req.cookies.oauth_state;

    this.deps.res.clearCookie("oauth_code_verifier");
    this.deps.res.clearCookie("oauth_state");

    const tokens = await authorizationCodeGrant(
      client,
      new URL(this.deps.req.url, env.APP_BASE_URL),
      {
        pkceCodeVerifier: codeVerifier,
        expectedState,
      },
    );

    const claims = tokens.claims();
    if (!claims) throw new Error("Token failed to be claimed");
    const { email, picture, name, sub } = this.extractClaims(claims);

    let user = await this.deps.client.user.findFirst({
      where: {
        authMethods: {
          some: {
            provider: "Google",
            providerId: claims.sub,
          },
        },
      },
    });

    if (!user) {
      user = await this.deps.client.user.create({
        data: {
          email: email,
          profilePicture: picture,
          username: name,
          authMethods: {
            create: {
              provider: "Google",
              providerId: sub,
            },
          },
        },
      });
    }

    logger.info("user", user);
    const jwt = ConnexionController.generateJwt(user.id, true);
    this.deps.res.cookie("session", jwt, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: "strict",
    });

    this.deps.res.redirect("/");
  }
}
