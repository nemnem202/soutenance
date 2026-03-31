import { Status, type ServerResponse } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import { logger } from "@/lib/logger";
import argon2 from "argon2";
import type { LoginData, RegisterData } from "@/types/auth";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { SignJWT } from "jose";
import { env } from "@/lib/env";

export class ConnexionController extends Controller<ControllerDeps> {
  private async generateJwt(
    userId: number,
    remember: boolean,
  ): Promise<string> {
    const secret = new TextEncoder().encode(env.TOKEN_SECRET);

    return await new SignJWT({ id: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(remember ? "3w" : "1h")
      .sign(secret);
  }

  private async setCookie(userId: number, remember: boolean) {
    try {
      const jwt = await this.generateJwt(userId, remember);

      // biome-ignore lint/suspicious/noTsIgnore: intentional
      // @ts-ignore
      const reply = this.deps.context.fastify.reply as FastifyReply;
      reply.setCookie("token", jwt, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: remember ? 365 * 24 * 3600 : 3600,
        sameSite: "lax",
      });
    } catch (err) {
      logger.error("Cookie generation failed: ", err);
    }
  }

  async login({ ...props }: LoginData): Promise<ServerResponse> {
    try {
      logger.info("Login requested");

      const loginValidation = loginSchema.safeParse(props);

      if (!loginValidation.success) {
        return {
          success: false,
          status: Status.IncorrectLoginData,
          title: "Incorrect data",
          description: loginValidation.error.message,
        };
      }

      const { email, password, remember } = props;

      const user = await this.deps.client.user.findFirst({
        where: {
          email: email,
        },
        include: {
          classicAuthMethod: true,
        },
      });

      if (!user) {
        return {
          success: false,
          title: "User not found",
          description: "Email must be incorrect",
          status: Status.IncorrectEmail,
        };
      }
      if (!user.classicAuthMethod) {
        return {
          success: false,
          title: "Try to connect with google",
          status: Status.BadAuthMethod,
        };
      }

      const isPasswordVerified = await argon2.verify(
        user.classicAuthMethod?.password,
        password,
      );

      if (!isPasswordVerified) {
        return {
          success: false,
          title: "Password incorrect",
          status: Status.IncorrectPassword,
        };
      }

      await this.setCookie(user.id, remember);

      logger.success("Login", user.username);

      return { success: true, status: Status.Logged };
    } catch (err) {
      logger.error("Failed to login", err);
      return {
        success: false,
        title: "Internal server error",
        description: "Try later",
        status: Status.UnknownError,
      };
    }
  }

  async register({ ...props }: RegisterData): Promise<ServerResponse> {
    try {
      logger.info("Register request");

      const registerValidation = registerSchema.safeParse(props);

      if (!registerValidation.success) {
        return {
          success: false,
          status: Status.IncorrectRegisterData,
          title: "Incorrect values",
          description: registerValidation.error.message,
        };
      }

      const { agree_terms_of_service, email, image, password, username } =
        props;

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

      const user = await this.deps.client.user.create({
        data: {
          email: email,
          username: username,
          profilePicture: image.src,
          classicAuthMethod: {
            create: {
              password: passwordHash,
            },
          },
        },
      });

      await this.setCookie(user.id, true);

      logger.info("Register", username);

      return { success: true, status: Status.Registered };
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
}
