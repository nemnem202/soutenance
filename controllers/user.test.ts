// controllers/user.test.ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import { faker } from "@faker-js/faker";
import UserController from "./UserController";
import { handleAction } from "@/lib/response-handler";
import { Status } from "@/types/server-response";

describe("UserController - Test d'Intégration Complet (Zéro Mock)", () => {
  const prefix = faker.string.alphanumeric(8);
  let userA: { id: number; username: string; email: string };
  let userB: { id: number; username: string; email: string };

  beforeAll(async () => {
    const createUserData = (name: string) => ({
      email: `${name}_${prefix}@test.com`,
      username: `${name}_${prefix}`,
      profilePicture: {
        create: {
          alt: "Avatar",
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        },
      },
    });

    const [dbUserA, dbUserB] = await Promise.all([
      prismaClient.user.create({ data: createUserData("UserA") }),
      prismaClient.user.create({ data: createUserData("UserB") }),
    ]);

    userA = dbUserA;
    userB = dbUserB;
  });

  afterAll(async () => {
    await prismaClient.user.deleteMany({
      where: { email: { contains: prefix } },
    });
  });

  describe("Méthode : updateUsername", () => {
    it("SÉCURITÉ : Échoue si l'utilisateur n'a pas de session (okUser)", async () => {
      const ctrl = new UserController({ client: prismaClient, user: null });
      const res = await handleAction("Update Username", () => ctrl.updateUsername("NewValidName"));

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("SÉCURITÉ : Échoue si le nouveau nom est trop court (Validation Zod < 5)", async () => {
      const ctrl = new UserController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("Update Username", () => ctrl.updateUsername("abc"));

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.IncorrectLoginData);
    });

    it("SÉCURITÉ : Échoue si le nouveau nom est trop long (Validation Zod > 20)", async () => {
      const ctrl = new UserController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("Update Username", () =>
        ctrl.updateUsername("un_nom_beaucoup_trop_long_pour_le_schema")
      );

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.IncorrectLoginData);
    });

    it("SÉCURITÉ : Échoue si le nom est déjà utilisé par un autre utilisateur (Conflit DB)", async () => {
      const ctrl = new UserController({ client: prismaClient, user: { id: userA.id } });

      const res = await handleAction("Update Username", () => ctrl.updateUsername(userB.username));

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.ExistingUsername);
    });

    it("EFFET DE BORD : Réussit si l'utilisateur garde son propre nom (Pas de conflit avec soi-même)", async () => {
      const ctrl = new UserController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("Update Username", () => ctrl.updateUsername(userA.username));

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.username).toBe(userA.username);
      }
    });

    it("CAS NOMINAL : Met à jour le nom avec succès et vérifie la persistance", async () => {
      const ctrl = new UserController({ client: prismaClient, user: { id: userA.id } });
      const updatedName = `Updated_${prefix}`;

      const res = await handleAction("Update Username", () => ctrl.updateUsername(updatedName));

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.username).toBe(updatedName);
        expect(res.data.id).toBe(userA.id);
      }

      const userInDb = await prismaClient.user.findUnique({
        where: { id: userA.id },
      });
      expect(userInDb?.username).toBe(updatedName);
    });

    it("SÉCURITÉ : Vérifie que le changement de pseudo ne casse pas les relations (Cascade/FK)", async () => {
      const ctrl = new UserController({ client: prismaClient, user: { id: userA.id } });
      const finalName = `FinalName_${prefix}`;

      await ctrl.updateUsername(finalName);

      const check = await prismaClient.user.findFirst({
        where: {
          id: userA.id,
          username: finalName,
        },
      });
      expect(check).not.toBeNull();
    });
  });
});
