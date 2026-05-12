import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import SessionController from "./SessionController";
import { handleAction } from "@/lib/response-handler";
import { Status } from "@/types/server-response";

describe("SessionController - Test d'Intégration et Sécurité (Zéro Mock)", () => {
  let testUser: {
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    id: number;
    imageId: number;
  };

  beforeAll(async () => {
    // await convertAllPlaylists("forTest");

    testUser = await prismaClient.user.create({
      data: {
        email: "session.tester@test.com",
        username: "SessionTester",
        profilePicture: {
          create: { url: "https://picsum.photos/200", alt: "Avatar Session" },
        },
      },
    });

    await prismaClient.playlist.createMany({
      data: [
        {
          title: "Tester Public List",
          visibility: "public",
          authorId: testUser.id,
          imageId: testUser.imageId,
        },
        {
          title: "Tester Private List",
          visibility: "private",
          authorId: testUser.id,
          imageId: testUser.imageId,
        },
      ],
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prismaClient.user.delete({ where: { id: testUser.id } });
    }
    // await prismaClient.playlist.deleteMany();
  });

  describe("SÉCURITÉ : Validation de l'état de connexion", () => {
    it("ÉCHEC : getSession sans contexte utilisateur (Status.NotConnected)", async () => {
      const ctrl = new SessionController({ client: prismaClient, user: null });
      const res = await handleAction("Get Session Null", () => ctrl.getSession());

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("ÉCHEC : getUserPlaylists sans contexte utilisateur (Status.NotConnected)", async () => {
      const ctrl = new SessionController({ client: prismaClient, user: null });
      const res = await handleAction("Get Playlists Null", () => ctrl.getUserPlaylists());

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("ÉCHEC : Session 'Zombie' (ID valide dans le contexte mais inexistant en DB)", async () => {
      const ctrl = new SessionController({ client: prismaClient, user: { id: 999999 } });
      const res = await handleAction("Get Session Zombie", () => ctrl.getSession());

      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.BadAuthMethod);
    });
  });

  describe("FONCTIONNALITÉ : Récupération des données de session", () => {
    it("CAS NOMINAL : getSession renvoie l'objet Session complet (id, username, picture)", async () => {
      const ctrl = new SessionController({ client: prismaClient, user: { id: testUser.id } });
      const res = await ctrl.getSession();

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.id).toBe(testUser.id);
        expect(res.data.username).toBe("SessionTester");
        expect(res.data.profilePicture.url).toBeDefined();
        expect(res.data.profilePicture.alt).toBe("Avatar Session");
      }
    });

    it("CAS NOMINAL : getUserPlaylists renvoie TOUTES les playlists de l'utilisateur", async () => {
      const ctrl = new SessionController({ client: prismaClient, user: { id: testUser.id } });
      const res = await ctrl.getUserPlaylists();

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.length).toBeGreaterThanOrEqual(2);

        const titles = res.data.map((p) => p.title);
        expect(titles).toContain("Tester Public List");
        expect(titles).toContain("Tester Private List");

        const first = res.data[0];
        expect(first).toHaveProperty("likedByCurrentUser");
        expect(first).toHaveProperty("cover");
      }
    });

    it("EFFET DE BORD : getUserPlaylists ne renvoie pas les playlists des autres", async () => {
      const ctrl = new SessionController({ client: prismaClient, user: { id: testUser.id } });
      const res = await ctrl.getUserPlaylists();

      if (res.success) {
        const allOwned = res.data.every((p) => p.author.id === testUser.id);
        expect(allOwned).toBe(true);
      }
    });
  });
});
