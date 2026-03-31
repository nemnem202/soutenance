/** biome-ignore-all lint/suspicious/noExplicitAny: necessary */
/** biome-ignore-all lint/style/noNonNullAssertion: necessary */
import { describe, it, expect, beforeEach } from "vitest";
import { ConnexionController } from "./ConnexionController";
import argon2 from "argon2";
import prismaClient from "@/lib/prisma-client";

describe("ConnexionController (integration)", () => {
  let controller: ConnexionController;

  beforeEach(async () => {
    await prismaClient.user.deleteMany();

    controller = new ConnexionController({
      client: prismaClient,
      request: {} as Request,
    });
  });

  it("should fail with invalid schema", async () => {
    const res = await controller.login({} as any);

    expect(res.success).toBe(false);
  });

  it("should fail if user does not exist", async () => {
    const res = await controller.login({
      email: "notfound@test.com",
      password: "password",
      remember: false,
    });

    expect(res.success).toBe(false);
    expect(res.status).toBeDefined();
  });

  it("should fail if auth method is not classic", async () => {
    await prismaClient.user.create({
      data: {
        email: "google@test.com",
        username: "googleuser",
        profilePicture: "",
      },
    });

    const res = await controller.login({
      email: "google@test.com",
      password: "password",
      remember: false,
    });

    expect(res.success).toBe(false);
  });

  it("should fail with wrong password", async () => {
    const hash = await argon2.hash("correct-password");

    await prismaClient.user.create({
      data: {
        email: "test@test.com",
        username: "test",
        profilePicture: "",
        classicAuthMethod: {
          create: {
            password: hash,
          },
        },
      },
    });

    const res = await controller.login({
      email: "test@test.com",
      password: "wrong-password",
      remember: false,
    });

    expect(res.success).toBe(false);
  });

  it("should login successfully", async () => {
    const hash = await argon2.hash("password");
    await prismaClient.user.create({
      data: {
        email: "success@test.com",
        username: "success",
        profilePicture: "",
        classicAuthMethod: {
          create: {
            password: hash,
          },
        },
      },
    });

    const res = await controller.login({
      email: "success@test.com",
      password: "password",
      remember: true,
    });

    expect(res.success).toBe(true);
  });

  it("should fail with invalid schema", async () => {
    const res = await controller.register({} as any);

    expect(res.success).toBe(false);
  });

  it("should fail if terms not accepted", async () => {
    const res = await controller.register({
      email: "test@test.com",
      username: "test",
      password: "password",
      password_confirm: "password",
      image: { src: "", alt: "" },
      agree_terms_of_service: false,
    });

    expect(res.success).toBe(false);
  });

  it("should fail if username already exists", async () => {
    await prismaClient.user.create({
      data: {
        email: "existing@test.com",
        username: "duplicate",
        profilePicture: "",
      },
    });

    const res = await controller.register({
      email: "new@test.com",
      username: "duplicate",
      password: "password",
      password_confirm: "password",
      image: { src: "", alt: "" },
      agree_terms_of_service: true,
    });

    expect(res.success).toBe(false);
  });

  it("should fail if email already exists", async () => {
    await prismaClient.user.create({
      data: {
        email: "duplicate@test.com",
        username: "user1",
        profilePicture: "",
      },
    });

    const res = await controller.register({
      email: "duplicate@test.com",
      username: "user2",
      password: "password",
      password_confirm: "password",
      image: { src: "", alt: "" },
      agree_terms_of_service: true,
    });

    expect(res.success).toBe(false);
  });

  it("should register successfully", async () => {
    const res = await controller.register({
      email: "new@test.com",
      username: "newuser",
      password: "password",
      password_confirm: "",
      image: { src: "", alt: "" },
      agree_terms_of_service: true,
    });

    expect(res.success).toBe(true);

    const user = await prismaClient.user.findFirst({
      where: { email: "new@test.com" },
      include: { classicAuthMethod: true },
    });

    expect(user).not.toBeNull();
    expect(user?.classicAuthMethod).not.toBeNull();

    const isValid = await argon2.verify(
      user!.classicAuthMethod!.password,
      "password",
    );

    expect(isValid).toBe(true);
  });
});
