// controllers/connexion.test.ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import UserRepository from "@/repositories/userRepository";
import { faker } from "@faker-js/faker";
import fs from "node:fs";
import path from "node:path";
import { ConnexionController } from "./ConnexionController";
import { handleAction } from "@/lib/response-handler";
import { Status } from "@/types/server-response";
import { COOKIE_NAME } from "@/lib/auth-utils";

describe("ConnexionController - Test d'Intégration Complet (Zéro Mock)", () => {
  const uniqueId = faker.string.alphanumeric(8);
  const testUsername = `User_${uniqueId}`;
  const testEmail = `${uniqueId}@sandbox.com`;
  const testPassword = "Password123!";
  const otherUser = {
    username: `Other_${uniqueId}`,
    email: `other_${uniqueId}@sandbox.com`,
  };

  let registeredUserId: number;
  let lastCookie: { name: string; value: string; options: any } | null = null;

  const mockSetCookie = (name: string, value: string, options: any) => {
    lastCookie = { name, value, options };
  };

  const getFile = (name: "default" | "large") => {
    const fileName = name === "large" ? "too-large-image.jpg" : "account-default-pic.webp";
    const buffer = fs.readFileSync(path.resolve(process.cwd(), `assets/images/${fileName}`));
    return new File([buffer], fileName, { type: name === "large" ? "image/jpeg" : "image/webp" });
  };

  beforeAll(async () => {
    await new UserRepository(prismaClient).create(
      otherUser.email,
      otherUser.username,
      "Alt",
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      "sample_id",
      testPassword
    );
  });

  afterAll(async () => {
    await prismaClient.user.deleteMany({
      where: { email: { contains: uniqueId } },
    });
  });

  describe("Méthode : register", () => {
    it("SÉCURITÉ : Échoue si les conditions d'utilisation ne sont pas acceptées", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Register", () =>
        ctrl.register({
          username: testUsername,
          email: testEmail,
          password: testPassword,
          password_confirm: testPassword,
          agree_terms_of_service: false, // <--- Fails here
          image: { file: getFile("default"), alt: "alt" },
        })
      );
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.IncorrectRegisterData);
    });

    it("SÉCURITÉ : Échoue si le mot de passe est trop court", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Register", () =>
        ctrl.register({
          username: testUsername,
          email: testEmail,
          password: "123",
          password_confirm: "123",
          agree_terms_of_service: true,
          image: { file: getFile("default"), alt: "alt" },
        })
      );
      expect(res.success).toBe(false);
    });

    it("SÉCURITÉ : Échoue si l'image dépasse la limite (5MB)", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Register", () =>
        ctrl.register({
          username: testUsername,
          email: testEmail,
          password: testPassword,
          password_confirm: testPassword,
          agree_terms_of_service: true,
          image: { file: getFile("large"), alt: "alt" },
        })
      );
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.IncorrectRegisterData);
    });

    it("SÉCURITÉ : Échoue si le nom d'utilisateur est déjà pris", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Register", () =>
        ctrl.register({
          username: otherUser.username,
          email: testEmail,
          password: testPassword,
          password_confirm: testPassword,
          agree_terms_of_service: true,
          image: { file: getFile("default"), alt: "alt" },
        })
      );
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.ExistingUsername);
    });

    it("CAS NOMINAL : Réussit l'enregistrement avec upload Cloudinary réel", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Register", () =>
        ctrl.register({
          username: testUsername,
          email: testEmail,
          password: testPassword,
          password_confirm: testPassword,
          agree_terms_of_service: true,
          image: { file: getFile("default"), alt: "Mon Avatar" },
        })
      );

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.username).toBe(testUsername);
        expect(res.data.profilePicture.url).toContain("cloudinary");
        registeredUserId = res.data.id;
      }
      expect(lastCookie?.name).toBe(COOKIE_NAME);
    });
  });

  describe("Méthode : login", () => {
    it("SÉCURITÉ : Échoue avec un mauvais mot de passe", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Login", () =>
        ctrl.login({
          email: testEmail,
          password: "WrongPassword!",
          remember: false,
        })
      );
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.IncorrectPassword);
    });

    it("SÉCURITÉ : Échoue si l'email n'existe pas", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Login", () =>
        ctrl.login({
          email: "nonono@test.com",
          password: testPassword,
          remember: false,
        })
      );
      expect(res.success).toBe(false);
    });

    it("CAS NOMINAL : Réussit la connexion et génère un JWT", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Login", () =>
        ctrl.login({
          email: testEmail,
          password: testPassword,
          remember: true,
        })
      );
      expect(res.success).toBe(true);
      expect(lastCookie?.value).toBeDefined();
      expect(lastCookie?.options.maxAge).toBeGreaterThan(3600);
    });
  });

  describe("Méthode : logout", () => {
    it("CAS NOMINAL : Réinitialise le cookie de session", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: { id: registeredUserId },
        setCookie: mockSetCookie,
      });
      const res = await ctrl.logout();
      expect(res.success).toBe(true);
      expect(lastCookie?.options.maxAge).toBe(0);
    });
  });

  describe("Méthode : removeAccount", () => {
    it("SÉCURITÉ : Échoue si l'utilisateur n'est pas connecté", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: null,
        setCookie: mockSetCookie,
      });
      const res = await handleAction("Remove", () => ctrl.removeAccount());
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("CAS NOMINAL : Supprime l'utilisateur, son image Cloudinary et ses données", async () => {
      const ctrl = new ConnexionController({
        client: prismaClient,
        user: { id: registeredUserId },
        setCookie: mockSetCookie,
      });

      const res = await handleAction("Remove", () => ctrl.removeAccount());
      console.info(res);
      expect(res.success).toBe(true);

      const checkUser = await prismaClient.user.findUnique({ where: { id: registeredUserId } });
      expect(checkUser).toBeNull();
      const checkAuth = await prismaClient.classicAuthMethod.findUnique({
        where: { userId: registeredUserId },
      });
      expect(checkAuth).toBeNull();
    });
  });
});
