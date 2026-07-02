import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import LikeController from "./LikeController";
import { handleAction } from "@/lib/response-handler";
import { Status } from "@/types/server-response";

describe("LikeController - Test d'Intégration et Sécurité (Zéro Mock)", () => {
  let testUser: { id: number; username: string };
  let targetPlaylistId: number;
  let targetExerciseId: number;
  let targetUserId: number;

  beforeAll(async () => {
    testUser = await prismaClient.user.create({
      data: {
        email: "liker.pro@test.com",
        username: "LikerPro",
        profilePicture: {
          create: { url: "https://picsum.photos/200", alt: "avatar" },
        },
      },
    });

    const playlist = await prismaClient.playlist.findFirst({ where: { visibility: "public" } });
    const exercise = await prismaClient.exercise.findFirst({
      where: { fromPlaylist: { visibility: "public" } },
    });
    const otherUser = await prismaClient.user.findFirst({
      where: { id: { not: testUser.id } },
    });

    if (!playlist || !exercise || !otherUser) {
      throw new Error("Seed data missing for tests");
    }

    targetPlaylistId = playlist.id;
    targetExerciseId = exercise.id;
    targetUserId = otherUser.id;
  });

  afterAll(async () => {
    if (testUser) {
      await prismaClient.user.delete({ where: { id: testUser.id } });
      // await prismaClient.playlist.deleteMany({ where: { title: "Secret Playlist" } });
    }
  });

  describe("SÉCURITÉ : Authentification et Accès", () => {
    it("ÉCHEC : Liker une playlist sans session (Status.NotConnected)", async () => {
      const nullCtrl = new LikeController({ client: prismaClient, user: null });
      const res = await handleAction("Like", () => nullCtrl.userLikesPlaylist(targetPlaylistId));
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("ÉCHEC : Récupérer ses playlists favoris sans session", async () => {
      const nullCtrl = new LikeController({ client: prismaClient, user: null });
      const res = await handleAction("Get Favs", () => nullCtrl.getPlaylists());
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });
  });

  describe("SÉCURITÉ : Intégrité des données", () => {
    it("ÉCHEC : Liker une playlist inexistante (ID 0)", async () => {
      const ctrl = new LikeController({ client: prismaClient, user: { id: testUser.id } });
      const res = await handleAction("Like Invalid", () => ctrl.userLikesPlaylist(0));

      expect(res.success).toBe(false);
    });

    it("ÉCHEC : Liker un utilisateur inexistant", async () => {
      const ctrl = new LikeController({ client: prismaClient, user: { id: testUser.id } });
      const res = await handleAction("Like Invalid User", () => ctrl.userLikesUser(999999));
      expect(res.success).toBe(false);
    });
  });

  describe("FONCTIONNALITÉ : Workflow des Likes", () => {
    it("CAS NOMINAL : Liker une playlist, vérifier l'état, puis unliker", async () => {
      const ctrl = new LikeController({ client: prismaClient, user: { id: testUser.id } });
      expect(targetPlaylistId).toBeDefined();
      const likeRes = await ctrl.userLikesPlaylist(targetPlaylistId);
      expect(likeRes.success).toBe(true);

      const favsRes = await ctrl.getPlaylists();
      expect(favsRes.success).toBe(true);
      if (favsRes.success) {
        expect(favsRes.data.some((p) => p.id === targetPlaylistId)).toBe(true);
      }

      const unlikeRes = await ctrl.userUnlikesPlaylist(targetPlaylistId);
      expect(unlikeRes.success).toBe(true);

      const finalRes = await ctrl.getPlaylists();
      if (finalRes.success) {
        expect(finalRes.data.some((p) => p.id === targetPlaylistId)).toBe(false);
      }
    });
    it("CAS NOMINAL : Liker un exercice et vérifier la récupération", async () => {
      const ctrl = new LikeController({ client: prismaClient, user: { id: testUser.id } });
      await ctrl.userLikesExercise(targetExerciseId);

      const res = await ctrl.getExercises();
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.some((e) => e.id === targetExerciseId)).toBe(true);
      }
    });
    it("EFFET DE BORD : Vérifier l'idempotence (Double like sur le même user)", async () => {
      const ctrl = new LikeController({ client: prismaClient, user: { id: testUser.id } });

      await ctrl.userLikesUser(targetUserId);
      const res = await ctrl.userLikesUser(targetUserId);
      expect(res.success).toBe(true);

      const count = await prismaClient.userLikesUser.count({
        where: { likingId: testUser.id, likedId: targetUserId },
      });
      expect(count).toBe(1);
    });
  });

  describe("SÉCURITÉ : Visibilité et Permissions", () => {
    it("EFFET DE BORD : Un exercice liké d'une playlist PRIVÉE ne doit pas apparaître pour autrui", async () => {
      const otherId = targetUserId;
      const privatePlaylist = await prismaClient.playlist.create({
        data: {
          title: "Secret Playlist",
          visibility: "private",
          author: { connect: { id: otherId } },
          cover: { create: { url: "http://..", alt: ".." } },
        },
      });

      const privateEx = await prismaClient.exercise.create({
        data: {
          title: "Hidden Track",
          composer: "Secret",
          author: { connect: { id: otherId } },
          fromPlaylist: { connect: { id: privatePlaylist.id } },
          defaultConfig: {
            create: {
              bpm: 100,
              groove: "JazzBasie",
              key: "C",
              timeSignatureBottom: 4,
              timeSignatureTop: 4,
            },
          },
        },
      });

      const ctrl = new LikeController({ client: prismaClient, user: { id: testUser.id } });
      await ctrl.userLikesExercise(privateEx.id);

      const res = await ctrl.getExercises();
      expect(res.success).toBe(true);
      if (res.success) {
        const found = res.data.find((e) => e.id === privateEx.id);
        expect(found).toBeUndefined();
      }
    });
  });
});
