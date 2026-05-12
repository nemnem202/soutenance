import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import FileController from "./FileController";
import { handleAction } from "@/lib/response-handler";
import { Status } from "@/types/server-response";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import { faker } from "@faker-js/faker";

describe("FileController - Test d'Intégration Cloudinary & DB (Zéro Mock)", () => {
  let testUser: { id: number; username: string; imageId: number };
  const prefix = faker.string.alphanumeric(8);

  const getFile = (name: "default" | "large") => {
    const fileName = name === "large" ? "too-large-image.jpg" : "account-default-pic.webp";
    const buffer = fs.readFileSync(path.resolve(process.cwd(), `assets/images/${fileName}`));
    return new File([buffer], fileName, { type: name === "large" ? "image/jpeg" : "image/webp" });
  };

  beforeAll(async () => {
    testUser = await prismaClient.user.create({
      data: {
        email: `file.${prefix}@test.com`,
        username: `FileUser_${prefix}`,
        profilePicture: {
          create: {
            url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
            alt: "Initial Image",
            cloudId: `initial_id_${prefix}`,
          },
        },
      },
    });
  });

  afterAll(async () => {
    try {
      await prismaClient.user.delete({ where: { id: testUser.id } });
    } catch {}
  });

  describe("Méthode : uploadFileAsImage", () => {
    it("ÉCHEC : Fichier manquant (Status.UnknownError)", async () => {
      const ctrl = new FileController({ client: prismaClient, user: { id: testUser.id } });
      await expect(ctrl.uploadFileAsImage()).rejects.toThrow("Fichier manquant");
    });

    it("CAS NOMINAL : Upload direct vers Cloudinary", async () => {
      const file = getFile("default");
      const ctrl = new FileController({ client: prismaClient, user: { id: testUser.id }, file });

      const result = await ctrl.uploadFileAsImage();

      expect(result.url).toContain("cloudinary.com");
      expect(result.imageId).toBeDefined();
      await cloudinary.uploader.destroy(result.imageId);
    });
  });

  describe("Méthode : handleUserImageChange", () => {
    it("SÉCURITÉ : Échoue si l'utilisateur n'est pas connecté", async () => {
      const file = getFile("default");
      const ctrl = new FileController({ client: prismaClient, user: null, file });
      const res = await handleAction("Update Image", () => ctrl.handleUserImageChange());

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("CAS NOMINAL : Cycle complet (Suppression ancienne -> Upload nouvelle -> Update DB)", async () => {
      const file = getFile("default");
      const ctrl = new FileController({ client: prismaClient, user: { id: testUser.id }, file });

      const res = await handleAction("Full Update", () => ctrl.handleUserImageChange());

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.profilePicture.url).toContain("cloudinary.com");
        const updatedUser = await prismaClient.user.findUnique({
          where: { id: testUser.id },
          include: { profilePicture: true },
        });

        expect(updatedUser?.profilePicture.url).toBe(res.data.profilePicture.url);
        expect(updatedUser?.profilePicture.cloudId).not.toBe(`initial_id_${prefix}`);
        if (updatedUser?.profilePicture.cloudId) {
          await cloudinary.uploader.destroy(updatedUser.profilePicture.cloudId);
        }
      }
    });
  });

  describe("Méthode : removeUserImage", () => {
    it("EFFET DE BORD : La méthode ne doit pas crash si l'utilisateur n'a pas de cloudId", async () => {
      const ghostUser = await prismaClient.user.create({
        data: {
          email: `ghost.${prefix}@test.com`,
          username: `Ghost_${prefix}`,
          profilePicture: { create: { url: "http://localhost/pic.jpg", alt: "alt" } },
        },
      });

      const ctrl = new FileController({ client: prismaClient, user: { id: ghostUser.id } });
      await expect(ctrl.removeUserImage(ghostUser.id)).resolves.not.toThrow();

      await prismaClient.user.delete({ where: { id: ghostUser.id } });
    });
  });

  describe("SÉCURITÉ : Intégrité des données", () => {
    it("ÉCHEC : Tentative d'update sur un utilisateur inexistant", async () => {
      const file = getFile("default");
      const ctrl = new FileController({ client: prismaClient, user: { id: 999999 }, file });
      const res = await handleAction("Fail Update", () => ctrl.handleUserImageChange());

      expect(res.success).toBe(false);
    });
  });
});
