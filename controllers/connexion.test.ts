import type { RegisterData } from "@/types/auth";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import UserRepository from "@/repositories/userRepository";
import { faker } from "@faker-js/faker";
import fs from "node:fs";
import path from "node:path";
import { ConnexionController } from "./ConnexionController";
import { handleAction } from "@/lib/response-handler";
import UserController from "./UserController";
import getCurrentUserFromCookie from "@/middlewares/getCurrentUser";
import FileController from "./FileController";

let userData: RegisterData;
let existingUserData: RegisterData;
let userId: number | null = null;

beforeAll(async () => {
  const imagePath = path.resolve(process.cwd(), "assets/images/account-default-pic.webp");
  const buffer = fs.readFileSync(imagePath);
  const file = new File([buffer], "default.webp", { type: "image/webp" });

  userData = {
    username: "TestUser",
    agree_terms_of_service: true,
    email: "userTest@gmail.com",
    password: "123456789",
    password_confirm: "123456789",
    image: {
      file: file,
      alt: "The picture of testUser",
    },
  };

  existingUserData = {
    username: "ExistingUser",
    agree_terms_of_service: true,
    email: "userExisting@gmail.com",
    password: "123456789",
    password_confirm: "123456789",
    image: {
      file: file,
      alt: "The picture of ExistingUser",
    },
  };

  await new UserRepository(prismaClient).create(
    existingUserData.email,
    existingUserData.username,
    existingUserData.image.alt,
    faker.image.url(),
    crypto.randomUUID(),
    existingUserData.password
  );
});

describe("Create an account", () => {
  it("Fails to create an account with too large image", async () => {
    const imagePath = path.resolve(process.cwd(), "assets/images/too-large-image.jpg");
    const buffer = fs.readFileSync(imagePath);
    const file = new File([buffer], "default.webp", { type: "image/webp" });
    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: () => {},
    });
    const response = await handleAction("Register", () =>
      controller.register({ ...userData, image: { ...userData.image, file: file } })
    );
    expect(response.success).toBe(false);
  });
  it("Fails to create an account with incorrect email", async () => {
    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: () => {},
    });
    const response = await handleAction("Register", () =>
      controller.register({ ...userData, email: "incorrectemail.com" })
    );
    expect(response.success).toBe(false);
  });
  it("Fails to create an account with too short password", async () => {
    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: () => {},
    });
    const response = await handleAction("Register", () =>
      controller.register({ ...userData, password: "1234567" })
    );
    expect(response.success).toBe(false);
  });
  it("Fails to create an account with username already picked", async () => {
    let cookie: { name: string; value: string } | null = null;
    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: (name: string, value: string) => {
        cookie = { name, value };
      },
    });
    const response = await handleAction("Register", () => controller.register(existingUserData));
    expect(response.success).toBe(false);
  });
  it("Create an account with correct data", async () => {
    let cookie: { name: string; value: string } | null = null;
    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: (name: string, value: string) => {
        cookie = { name, value };
      },
    });
    const response = await handleAction("Register", () => controller.register(userData));
    expect(response.success).toBe(true);
    expect(cookie).toBeDefined();
  });
  it("Log in to the newly created account", async () => {
    let cookie: string | undefined;

    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: (name: string, value: string) => {
        cookie = `${name}=${value}`;
      },
    });

    const response = await handleAction("Login", () =>
      controller.login({
        email: userData.email,
        password: userData.password,
        remember: false,
      })
    );
    expect(response.success).toBe(true);
    const user = await getCurrentUserFromCookie(cookie!);

    expect(user).toBeDefined();
    expect(user?.id).toBeDefined();

    userId = user?.id ?? null;
  });
});

describe("Update an account", () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController({
      client: prismaClient,
      user: { id: userId! },
    });
  });

  it("Fails to update an already picked username", async () => {
    const response = await handleAction("Update username", () =>
      userController.updateUsername(existingUserData.username)
    );
    expect(response.success).toBe(false);
  });
  it("Fails to update image it it's too large", async () => {
    const imagePath = path.resolve(process.cwd(), "assets/images/too-large-image.jpg");
    const buffer = fs.readFileSync(imagePath);
    const file = new File([buffer], "default.webp", { type: "image/webp" });
    const fileController = new FileController({
      client: prismaClient,
      user: { id: userId! },
      file,
    });
    const response = await handleAction("Update image", () =>
      fileController.handleUserImageChange()
    );
    expect(response.success).toBe(false);
  });
  it("Update username successfully", async () => {
    userData.username = "usernameUpdate;";
    const response = await handleAction("Update username", () =>
      userController.updateUsername(userData.username)
    );
    expect(response.success).toBe(true);
  });
  it("Update image successfully", async () => {
    const fileController = new FileController({
      client: prismaClient,
      user: { id: userId! },
      file: userData.image.file as File,
    });
    const response = await handleAction("Update image", () =>
      fileController.handleUserImageChange()
    );
    expect(response.success).toBe(true);
  });
  it("Fails to update an account it user doesn't have session", async () => {
    const emptyUserController = new UserController({
      client: prismaClient,
      user: null,
    });
    userData.username = "usernameUpdate;";
    const response = await handleAction("Update username", () =>
      emptyUserController.updateUsername(userData.username)
    );
    expect(response.success).toBe(false);
  });
});

describe("Remove an account", async () => {
  it("Fails to Delete an account if user doesn't have session", async () => {
    const controller = new ConnexionController({
      client: prismaClient,
      user: null,
      setCookie: (name: string, value: string) => {},
    });
    const response = await handleAction("Remove account", () => controller.removeAccount());
    expect(response.success).toBe(false);
  });
  it("Delete an account with success if user has session", async () => {
    const controller = new ConnexionController({
      client: prismaClient,
      user: { id: userId! },
      setCookie: (name: string, value: string) => {},
    });
    const response = await handleAction("Remove account", () => controller.removeAccount());
    expect(response.success).toBe(true);
  });
});

afterAll(async () => {
  await prismaClient.user.deleteMany({
    where: {
      OR: [{ username: userData.username }, { username: existingUserData.username }],
    },
  });
});
