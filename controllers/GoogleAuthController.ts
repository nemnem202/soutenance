import { faker } from "@faker-js/faker";
import type { Request, Response } from "express";
import type { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";
import { COOKIE_NAME, generateJwt, getCookieOptions } from "@/lib/auth-utils";
import { env } from "@/lib/env";
import type { Session } from "@/types/auth";
import { Controller, type ControllerDeps } from "./Controller";
import { AppError } from "@/lib/errors";
import { Status } from "@/types/server-response";

interface GoogleAuthDeps extends ControllerDeps {
  googleClient: OAuth2Client;
}

export default class GoogleAuthController extends Controller {
  private googleClient: OAuth2Client;

  constructor(deps: GoogleAuthDeps) {
    super(deps);
    this.googleClient = deps.googleClient;
  }

  /**
   * Génère l'URL d'authentification Google et définit le cookie d'état.
   */
  async getAuth(res: Response) {
    const state = crypto.randomUUID();

    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600000, // 10 min
    });

    const url = this.googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      state,
      prompt: "consent",
    });

    res.redirect(url);
  }

  /**
   * Gère le retour de Google, valide le token et crée/récupère l'utilisateur.
   */
  async handleCallback(req: Request, res: Response) {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    if (!state || state !== storedState) {
      throw new AppError(
        Status.BadRequest,
        "État invalide",
        "La session d'authentification a expiré."
      );
    }

    const { tokens } = await this.googleClient.getToken(code as string);
    this.googleClient.setCredentials(tokens);

    const ticket = await this.googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new AppError(
        Status.UnknownError,
        "Erreur Google",
        "Impossible de récupérer les informations du profil."
      );
    }

    let user = await this.client.user.findUnique({
      where: { email: payload.email },
      include: { profilePicture: true },
    });

    // Création de l'utilisateur s'il n'existe pas
    if (!user) {
      const username = await this.generateUniqueUsername(payload.name || "User");
      user = await this.client.user.create({
        data: {
          email: payload.email,
          username,
          profilePicture: {
            create: {
              alt: `Profil de ${username}`,
              url: payload.picture || faker.image.avatar(),
            },
          },
          authMethods: {
            create: { provider: "Google", providerId: payload.sub },
          },
        },
        include: { profilePicture: true },
      });
    }

    const session: Session = {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
    };

    const jwt = await generateJwt(user.id, true);
    res.cookie(COOKIE_NAME, jwt, getCookieOptions(true));
    res.clearCookie("oauth_state");

    // Script pour fermer la popup et notifier le parent (frontend)
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ session: ${JSON.stringify(session)} }, window.location.origin);
            window.close();
          </script>
        </body>
      </html>
    `);
  }

  private async generateUniqueUsername(baseName: string): Promise<string> {
    const username = baseName.split(" ").join("_").substring(0, 11);
    const exists = true;
    while (exists) {
      const candidate = `${username}_${nanoid(5)}`;
      const user = await this.client.user.findUnique({ where: { username: candidate } });
      if (!user) return candidate;
    }
    return username;
  }
}
