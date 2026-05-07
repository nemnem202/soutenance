import argon2 from "argon2";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@/lib/auth-utils";
import { AppError } from "@/lib/errors";
import prismaClient from "@/lib/prisma-client";
import { Status } from "@/types/server-response";
import { ConnexionController } from "./ConnexionController";

vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: vi.fn((_options, callback) => {
        const { PassThrough } = require("node:stream");
        const mockStream = new PassThrough();

        mockStream.on("finish", () => {
          callback(null, {
            secure_url: "https://res.cloudinary.com/mock/image.webp",
            public_id: "test_public_id",
          });
        });

        return mockStream;
      }),
      destroy: vi.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

const mockFile = new File(["content"], "avatar.webp", { type: "image/webp" });

const createMockContext = (userId: number | null = null) => {
  const cookies: Record<string, { value: string; options: any }> = {};

  return {
    user: userId ? { id: userId } : null,
    setCookie: vi.fn((name: string, value: string, options: any) => {
      cookies[name] = { value, options };
    }),
    request: new Request("http://localhost"),

    getCookie: (name: string) => cookies[name],
  };
};

describe("ConnexionController Integration", () => {
  let controller: ConnexionController;
  let context: ReturnType<typeof createMockContext>;

  beforeEach(async () => {
    await prismaClient.classicAuthMethod.deleteMany();
    await prismaClient.authMethod.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.image.deleteMany();
  });

  describe("Register", () => {
    it("should register a user and set a session cookie", async () => {
      const data = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        password_confirm: "password123",
        agree_terms_of_service: true,
        image: { file: mockFile, alt: "My avatar" },
      };

      context = createMockContext();
      controller = new ConnexionController({ client: prismaClient, context, user: null });

      const result = await controller.register(data);

      const user = await prismaClient.user.findUnique({
        where: { email: data.email },
        include: { profilePicture: true, classicAuthMethod: true },
      });

      expect(user).toBeDefined();
      expect(user?.username).toBe("testuser");
      expect(user?.profilePicture.url).toBeDefined();

      expect(context.setCookie).toHaveBeenCalledWith(
        COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({ httpOnly: true })
      );

      if (!result.success) throw new Error("Le contrôleur aurait dû réussir");

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(user?.id);
    });

    it("should throw AppError if email already exists", async () => {
      await prismaClient.user.create({
        data: {
          email: "exists@test.com",
          username: "user1",
          profilePicture: { create: { url: "...", alt: "..." } },
        },
      });

      const data = {
        username: "user2",
        email: "exists@test.com",
        password: "password123",
        password_confirm: "password123",
        agree_terms_of_service: true,
        image: { file: mockFile, alt: "..." },
      };

      context = createMockContext();
      controller = new ConnexionController({ client: prismaClient, context, user: null });

      await expect(controller.register(data)).rejects.toThrow(
        new AppError(Status.ExistingEmail, "Email déjà utilisé")
      );
    });
  });

  describe("Login", () => {
    it("should login successfully with correct credentials", async () => {
      const hashedPassword = await argon2.hash("securepassword");
      const _user = await prismaClient.user.create({
        data: {
          email: "login@test.com",
          username: "loginuser",
          profilePicture: { create: { url: "...", alt: "..." } },
          classicAuthMethod: { create: { password: hashedPassword } },
        },
      });
      context = createMockContext();
      controller = new ConnexionController({ client: prismaClient, context, user: null });

      const result = await controller.login({
        email: "login@test.com",
        password: "securepassword",
        remember: true,
      });
      if (!result.success) throw new Error("Le contrôleur aurait dû réussir");
      expect(result.data.username).toBe("loginuser");
      expect(context.setCookie).toHaveBeenCalled();
    });

    it("should fail login with wrong password", async () => {
      const hashedPassword = await argon2.hash("password");
      await prismaClient.user.create({
        data: {
          email: "fail@test.com",
          username: "fail",
          profilePicture: { create: { url: "...", alt: "..." } },
          classicAuthMethod: { create: { password: hashedPassword } },
        },
      });

      context = createMockContext();
      controller = new ConnexionController({ client: prismaClient, context, user: null });

      await expect(
        controller.login({
          email: "fail@test.com",
          password: "wrong_password",
          remember: false,
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("Logout", () => {
    it("should clear the session cookie", async () => {
      const user = await prismaClient.user.create({
        data: {
          email: "logout@test.com",
          username: "logout-me",
          profilePicture: { create: { url: "...", alt: "...", cloudId: "test_id" } },
        },
      });

      context = createMockContext(user.id);
      controller = new ConnexionController({ client: prismaClient, context, user });

      await controller.logout();

      expect(context.setCookie).toHaveBeenCalledWith(
        COOKIE_NAME,
        "",
        expect.objectContaining({ maxAge: 0 })
      );
    });
  });

  describe("Remove Account", () => {
    it("should delete user and related images from DB", async () => {
      const user = await prismaClient.user.create({
        data: {
          email: "delete@test.com",
          username: "delete-me",
          profilePicture: { create: { url: "...", alt: "...", cloudId: "test_id" } },
        },
      });

      context = createMockContext(user.id);
      controller = new ConnexionController({ client: prismaClient, context, user });

      await controller.removeAccount();

      const dbUser = await prismaClient.user.findUnique({ where: { id: user.id } });
      expect(dbUser).toBeNull();
    });
  });
});
