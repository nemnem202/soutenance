import argon2 from "argon2";
import { SignJWT } from "jose";
import type { Telefunc } from "telefunc";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { LoginData, RegisterData, Session } from "@/types/auth";
import { type ErrorServerResponse, type ServerResponse, Status } from "@/types/server-response";
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

  async register({
    ...props
  }: RegisterData): Promise<ErrorServerResponse | { success: true; session: Session }> {
    try {
      logger.info("Register request");
      const registerValidation = registerSchema.safeParse(props);

      if (!registerValidation.success) {
        logger.error("Register failed", registerValidation.error.message);
        return {
          success: false,
          status: Status.IncorrectRegisterData,
          title: "Incorrect values",
          description: registerValidation.error.message,
        };
      }

      const { agree_terms_of_service, email, password, username, image } = props;

      logger.info("Image: ", image.file);

      if (!agree_terms_of_service) {
        return {
          success: false,
          status: Status.RefusedTermsOfService,
          title: "You must accept terms of service",
        };
      }

      const existingUser = await this.deps.client.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        if (existingUser.username === username) {
          return {
            success: false,
            title: "Try another username",
            status: Status.ExistingUsername,
          };
        } else {
          return {
            success: false,
            title: "An account with the same email already exist.",
            description: "Try to connect or create another account.",
            status: Status.ExistingEmail,
          };
        }
      }

      const passwordHash = await argon2.hash(password);

      const fileController = new FileController({
        client: prismaClient,
        file: image.file,
      });

      const imageUpload = await fileController.uploadFileAsImage();

      if (!imageUpload.success) return imageUpload;

      const user = await this.deps.client.user.create({
        data: {
          email: email,
          username: username,
          profilePicture: {
            create: {
              alt: `The profile picture of ${username}`,
              url: imageUpload.url,
              cloudId: imageUpload.imageId,
            },
          },
          classicAuthMethod: {
            create: {
              password: passwordHash,
            },
          },
        },
        include: {
          profilePicture: true,
        },
      });

      await this.setCookie(user.id, true);

      logger.info("Register", username);

      return {
        success: true,
        session: {
          id: user.id,
          username: user.username,
          profilePictureSource: {
            alt: user.profilePicture.alt,
            src: user.profilePicture.url,
          },
        },
      };
    } catch (err) {
      logger.error("Failed to register", err);
      return {
        success: false,
        title: "Internal server error",
        description: "Try later",
        status: Status.UnknownError,
      };
    }
  }

  async logout(): Promise<ServerResponse> {
    try {
      this.clearCookie();
      return { success: true, status: Status.LogoutSuccessfull };
    } catch {
      return {
        success: false,
        status: Status.UnknownError,
        title: "Something went wrong...",
      };
    }
  }

  async removeAccount(): Promise<ServerResponse> {
    try {
      const user = this.deps.context.user;
      if (!user) {
        return {
          success: false,
          status: Status.NotConnected,
          title: "You are not connected",
          description: "You must be connected to remove your account",
        };
      }

      const fileController = new FileController({ client: this.deps.client });

      await fileController.removeUserImage(user.id);

      const removed = await this.deps.client.user.delete({
        where: {
          id: user.id,
        },
      });

      logger.success("User account removed", removed.username);
      return { success: true, status: Status.RemoveAccountSuccessfull };
    } catch (err) {
      logger.error("Remove account error", err);
      return {
        success: false,
        status: Status.UnknownError,
        title: "An error occured",
        description: "Please try later",
      };
    }
  }
}
