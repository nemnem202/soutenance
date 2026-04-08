import { faker } from "@faker-js/faker";
import type { Request, Response } from "express";
import type { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { Session } from "@/types/auth";
import { Controller, type ControllerDeps } from "./Controller";
import { generateJwt } from "@/lib/auth-utils";
import { ServerResponse, Status } from "@/types/server-response";

interface GoogleAuthDeps extends ControllerDeps {
  req: Request;
  res: Response;
  googleClient: OAuth2Client;
}

export default class GoogleAuthController extends Controller<GoogleAuthDeps> {
  private generateRandomUsername(username: string): string {
    return `${username.split(" ").join("_")}_${nanoid(8)}`;
  }
  async getAuth(): Promise<ServerResponse<{}>> {
    const { res, googleClient } = this.deps;

    const state = crypto.randomUUID();

    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      state,
      prompt: "consent",
    });
    logger.info(`Redirect URL: ${url}`);

    res.redirect(url);

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async getCallback(): Promise<ServerResponse<{}>> {
    const { req, res, googleClient, client } = this.deps;
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;
    if (!state || state !== storedState) {
      res.status(400).send("Invalid state");
      return {
        success: false,
        status: Status.UnknownError,
        title: "Invalid state",
      };
    }

    const { tokens } = await googleClient.getToken(code as string);

    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) throw new Error("No payload");

    const user = {
      id: payload?.sub,
      email: payload?.email,
      name: payload.name ?? faker.person.firstName(),
      picture: payload.picture,
    };

    if (!user.email || !user.id) throw new Error("Payload do not have email or id");

    logger.info("Google user authentified !");
    logger.table(user);

    let dbUser = await client.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        profilePicture: true,
      },
    });

    if (!dbUser) {
      const username = this.generateRandomUsername(user.name);
      dbUser = await client.user.create({
        data: {
          email: user.email,
          profilePicture: {
            create: {
              alt: `The profile picture of ${username}`,
              url: user.picture ?? faker.image.avatar(),
            },
          },
          username: username,
          authMethods: {
            create: {
              provider: "Google",
              providerId: user.id,
            },
          },
        },
        include: {
          profilePicture: true,
        },
      });
    }

    const session: Session = {
      id: dbUser.id,
      profilePictureSource: {
        alt: dbUser.profilePicture.alt,
        src: dbUser.profilePicture.url,
      },
      username: dbUser.username,
    };

    const jwt = await generateJwt(dbUser.id, true);

    res.cookie("token", jwt, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 365 * 24 * 3600 * 1000,
      sameSite: "lax",
    });

    res.clearCookie("oauth_state", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { session: ${JSON.stringify(session)} },
            );
            window.close();
          </script>
        </body>
      </html>
    `);

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }
}
