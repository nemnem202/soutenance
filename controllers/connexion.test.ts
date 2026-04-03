import { beforeEach, describe, expect, it, vi } from "vitest";
import argon2 from "argon2";
import prismaClient from "@/lib/prisma-client";
import { ConnexionController } from "./ConnexionController";
import { AppError } from "@/lib/errors";
import { Status } from "@/types/server-response";
import { COOKIE_NAME } from "@/lib/auth-utils";

const mockFile = new File(["content"], "avatar.webp", { type: "image/webp" });

// Crée un contexte Telefunc simulé capable de suivre les cookies
const createMockContext = (userId: number | null = null) => {
  const cookies: Record<string, { value: string; options: any }> = {};

  return {
    user: userId ? { id: userId } : null,
    setCookie: vi.fn((name: string, value: string, options: any) => {
      cookies[name] = { value, options };
    }),
    // Helper pour les assertions
    getCookie: (name: string) => cookies[name],
  };
};

describe("ConnexionController Integration", () => {
  let controller: ConnexionController;
  let context: ReturnType<typeof createMockContext>;

  beforeEach(async () => {
    // Nettoyage complet de la DB (attention à l'ordre des FK)
    await prismaClient.classicAuthMethod.deleteMany();
    await prismaClient.authMethod.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.image.deleteMany();

    context = createMockContext();
    controller = new ConnexionController({ client: prismaClient, context });
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

      const result = await controller.register(data);

      // Vérification DB
      const user = await prismaClient.user.findUnique({
        where: { email: data.email },
        include: { profilePicture: true, classicAuthMethod: true },
      });

      expect(user).toBeDefined();
      expect(user?.username).toBe("testuser");
      expect(user?.profilePicture.url).toBeDefined(); // Cloudinary mocké ou réel selon votre env

      // Vérification du Cookie
      expect(context.setCookie).toHaveBeenCalledWith(
        COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({ httpOnly: true })
      );

      expect(result.session.id).toBe(user?.id);
    });

    it("should throw AppError if email already exists", async () => {
      // Création d'un premier user
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

      await expect(controller.register(data)).rejects.toThrow(
        new AppError(Status.ExistingEmail, "Email déjà utilisé")
      );
    });
  });

  describe("Login", () => {
    it("should login successfully with correct credentials", async () => {
      // 1. On crée un user manuellement
      const hashedPassword = await argon2.hash("securepassword");
      const _user = await prismaClient.user.create({
        data: {
          email: "login@test.com",
          username: "loginuser",
          profilePicture: { create: { url: "...", alt: "..." } },
          classicAuthMethod: { create: { password: hashedPassword } },
        },
      });

      // 2. Tentative de login
      const result = await controller.login({
        email: "login@test.com",
        password: "securepassword",
        remember: true,
      });

      expect(result.session.username).toBe("loginuser");
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
      // Création d'un user et simulation du contexte de session
      const user = await prismaClient.user.create({
        data: {
          email: "delete@test.com",
          username: "delete-me",
          profilePicture: { create: { url: "...", alt: "...", cloudId: "test_id" } },
        },
      });

      const authContext = createMockContext(user.id);
      const authController = new ConnexionController({
        client: prismaClient,
        context: authContext,
      });

      await authController.removeAccount();

      const dbUser = await prismaClient.user.findUnique({ where: { id: user.id } });
      expect(dbUser).toBeNull();
    });
  });
});
