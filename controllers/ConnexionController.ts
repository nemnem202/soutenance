import argon2 from "argon2";
import type { Telefunc } from "telefunc";
import { COOKIE_NAME, generateJwt, getCookieOptions } from "@/lib/auth-utils";
import { AppError } from "@/lib/errors";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { LoginData, RegisterData, Session } from "@/types/auth";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import FileController from "./FileController";

interface ConnexionDeps extends ControllerDeps {
  context: Telefunc.Context;
}

export class ConnexionController extends Controller<ConnexionDeps> {
  async login(props: LoginData): Promise<ServerResponse<Session>> {
    const loginValidation = loginSchema.safeParse(props);
    if (!loginValidation.success) {
      throw new AppError(Status.IncorrectLoginData, "Données invalides");
    }

    const user = await this.deps.client.user.findFirst({
      where: { email: props.email },
      include: { classicAuthMethod: true, profilePicture: true },
    });

    if (!user?.classicAuthMethod) {
      throw new AppError(Status.IncorrectEmail, "Utilisateur non trouvé");
    }

    const isPasswordVerified = await argon2.verify(user.classicAuthMethod.password, props.password);
    if (!isPasswordVerified) {
      throw new AppError(Status.IncorrectPassword, "Mot de passe incorrect");
    }

    const token = await generateJwt(user.id, props.remember);
    this.deps.context.setCookie(COOKIE_NAME, token, getCookieOptions(props.remember));

    return {
      status: Status.Ok,
      success: true,
      data: {
        id: user.id,
        username: user.username,
        profilePictureSource: { alt: user.profilePicture.alt, src: user.profilePicture.url },
      },
    };
  }

  async register(props: RegisterData): Promise<ServerResponse<Session>> {
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

    const fileController = new FileController({
      client: this.deps.client,
      file: props.image.file as File,
    });
    const imageUpload = await fileController.uploadFileAsImage();

    const user = await this.deps.client.user.create({
      data: {
        email: props.email,
        username: props.username,
        profilePicture: {
          create: {
            alt: props.image.alt,
            url: imageUpload.url,
            cloudId: imageUpload.imageId,
          },
        },
        classicAuthMethod: { create: { password: await argon2.hash(props.password) } },
      },
      include: { profilePicture: true },
    });

    const token = await generateJwt(user.id, true);
    this.deps.context.setCookie(COOKIE_NAME, token, getCookieOptions(true));

    return {
      success: true,
      status: Status.Ok,
      data: {
        id: user.id,
        username: user.username,
        profilePictureSource: { alt: user.profilePicture.alt, src: user.profilePicture.url },
      },
    };
  }

  async logout(): Promise<ServerResponse<{}>> {
    this.deps.context.setCookie(COOKIE_NAME, "", { ...getCookieOptions(false), maxAge: 0 });
    return { status: Status.LogoutSuccessfull, success: true, data: {} };
  }

  async removeAccount(): Promise<ServerResponse<{}>> {
    const user = this.deps.context.user;
    if (!user) throw new AppError(Status.NotConnected, "Non connecté");

    const fileController = new FileController({ client: this.deps.client });
    await fileController.removeUserImage(user.id);
    await this.deps.client.user.delete({ where: { id: user.id } });

    await this.logout();

    return { status: Status.RemoveAccountSuccessfull, success: true, data: {} };
  }
}
