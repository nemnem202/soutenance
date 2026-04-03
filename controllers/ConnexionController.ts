import argon2 from "argon2";
import { SignJWT } from "jose";
import type { Telefunc } from "telefunc";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { LoginData, RegisterData } from "@/types/auth";
import { Status } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import FileController from "./fileController";
import { AppError } from "@/lib/errors";

interface ConnexionDeps extends ControllerDeps {
  context: Telefunc.Context;
}

export class ConnexionController extends Controller<ConnexionDeps> {
  private readonly cookieSecure = false;

  static async generateJwt(userId: number, remember: boolean): Promise<string> {
    const secret = new TextEncoder().encode(env.TOKEN_SECRET);

    return await new SignJWT({ id: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(remember ? "3w" : "1h")
      .sign(secret);
  }

  private async setCookie(userId: number, remember: boolean) {
    try {
      const jwt = await ConnexionController.generateJwt(userId, remember);

      this.deps.context.setCookie("token", jwt, {
        httpOnly: true,
        secure: this.cookieSecure,
        path: "/",
        maxAge: remember ? 365 * 24 * 3600 : 3600,
        sameSite: "lax",
      });
    } catch (err) {
      logger.error("Cookie generation failed: ", err);
    }
  }

  private clearCookie() {
    try {
      this.deps.context.setCookie("token", "", {
        httpOnly: true,
        secure: this.cookieSecure,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
      });
    } catch (err) {
      logger.error("Cookie clearing failed: ", err);
    }
  }

  async login(props: LoginData) {
    const loginValidation = loginSchema.safeParse(props);
    if (!loginValidation.success) {
      throw new AppError(Status.IncorrectLoginData, "Invalid data", loginValidation.error.message);
    }

    const user = await this.deps.client.user.findFirst({
      where: { email: props.email },
      include: { classicAuthMethod: true, profilePicture: true },
    });

    if (!user?.classicAuthMethod) {
      throw new AppError(Status.IncorrectEmail, "User not found");
    }

    const isPasswordVerified = await argon2.verify(user.classicAuthMethod.password, props.password);
    if (!isPasswordVerified) {
      throw new AppError(Status.IncorrectPassword, "Password incorrect");
    }

    await this.setCookie(user.id, props.remember);

    return {
      session: {
        id: user.id,
        username: user.username,
        profilePictureSource: { alt: user.profilePicture.alt, src: user.profilePicture.url },
      },
    };
  }

  async register(props: RegisterData) {
    const registerValidation = registerSchema.safeParse(props);
    if (!registerValidation.success) {
      throw new AppError(
        Status.IncorrectRegisterData,
        "Formulaire invalide",
        registerValidation.error.message
      );
    }

    const { email, password, username, image } = props;

    const existingUser = await this.deps.client.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      const isEmail = existingUser.email === email;
      throw new AppError(
        isEmail ? Status.ExistingEmail : Status.ExistingUsername,
        isEmail ? "Email déjà utilisé" : "Pseudo déjà utilisé"
      );
    }

    const passwordHash = await argon2.hash(password);
    const fileController = new FileController({ client: this.deps.client, file: image.file });
    const imageUpload = await fileController.uploadFileAsImage();

    const user = await this.deps.client.user.create({
      data: {
        email,
        username,
        profilePicture: {
          create: {
            alt: `Avatar de ${username}`,
            url: imageUpload.url,
            cloudId: imageUpload.imageId,
          },
        },
        classicAuthMethod: { create: { password: passwordHash } },
      },
      include: { profilePicture: true },
    });

    await this.setCookie(user.id, true);

    return {
      session: {
        id: user.id,
        username: user.username,
        profilePictureSource: { alt: user.profilePicture.alt, src: user.profilePicture.url },
      },
    };
  }

  async logout() {
    this.clearCookie();
    return { status: Status.LogoutSuccessfull };
  }

  async removeAccount() {
    const user = this.deps.context.user;
    if (!user) throw new AppError(Status.NotConnected, "Non connecté");

    const fileController = new FileController({ client: this.deps.client });
    await fileController.removeUserImage(user.id);
    await this.deps.client.user.delete({ where: { id: user.id } });

    return { status: Status.RemoveAccountSuccessfull };
  }
}
