import type { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";
import { Controller, type ControllerDeps } from "./Controller";
import { AppError } from "@/lib/errors";
import { Status } from "@/types/server-response";
import { generateJwt } from "@/lib/auth-utils";

interface GoogleAuthDeps extends ControllerDeps {
  // req: Request;
  // res: Response;
  googleClient: OAuth2Client;
}

export default class GoogleAuthController extends Controller<GoogleAuthDeps> {
  async prepareAuth() {
    const state = crypto.randomUUID();
    const url = this.deps.googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      state,
      prompt: "consent",
    });
    return { url, state };
  }

  async verifyCallback(code: string, state: string, storedState: string | undefined) {
    if (!state || state !== storedState) {
      throw new AppError(Status.UnknownError, "État invalide", "La session de connexion a expiré.");
    }

    const { tokens } = await this.deps.googleClient.getToken(code);
    const ticket = await this.deps.googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email)
      throw new AppError(Status.UnknownError, "Erreur Google", "Email non récupéré.");

    let user = await this.deps.client.user.findUnique({
      where: { email: payload.email },
      include: { profilePicture: true },
    });

    if (!user) {
      const username = `${payload.name?.replace(/\s/g, "_") || "user"}_${nanoid(5)}`;
      user = await this.deps.client.user.create({
        data: {
          email: payload.email,
          username,
          profilePicture: {
            create: {
              alt: `Avatar de ${username}`,
              url: payload.picture || "/assets/images/account-default-pic.webp",
            },
          },
          authMethods: { create: { provider: "Google", providerId: payload.sub } },
        },
        include: { profilePicture: true },
      });
    }

    const token = await generateJwt(user.id, true);
    return {
      token,
      session: {
        id: user.id,
        username: user.username,
        profilePictureSource: { alt: user.profilePicture.alt, src: user.profilePicture.url },
      },
    };
  }
}
