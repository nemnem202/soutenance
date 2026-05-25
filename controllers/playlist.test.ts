// controllers/playlist.test.ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import PlaylistController from "./PlaylistController";
import { handleAction } from "@/lib/response-handler";
import { Status } from "@/types/server-response";
import fs from "node:fs";
import path from "node:path";
import { logger } from "@/lib/logger";

describe("PlaylistController - Test d'Intégration et Sécurité (Zéro Mock)", () => {
  let userA: { id: number; username: string };
  let userB: { id: number; username: string };
  let seedExerciseId: number;
  let userAPlaylistId: number;

  const getValidFile = () => {
    const buffer = fs.readFileSync(
      path.resolve(process.cwd(), "assets/images/account-default-pic.webp")
    );
    return new File([buffer], "cover.webp", { type: "image/webp" });
  };

  beforeAll(async () => {
    const createTestUser = async (name: string) =>
      prismaClient.user.create({
        data: {
          email: `${name}.test@sandbox.com`,
          username: `${name}Tester`,
          profilePicture: { create: { url: "https://picsum.photos/200", alt: "avatar" } },
        },
      });

    [userA, userB] = await Promise.all([createTestUser("UserA"), createTestUser("UserB")]);

    const ex = await prismaClient.exercise.findFirst();
    seedExerciseId = ex?.id as number;
  });

  afterAll(async () => {
    // await prismaClient.user.deleteMany();
    // await prismaClient.playlist.deleteMany();
  });

  describe("Méthode : createPlaylistFromUser", () => {
    it("SÉCURITÉ : Échoue sans session (Status.NotConnected)", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: null });
      const res = await handleAction("Create", () => ctrl.createPlaylistFromUser({} as any));
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.NotConnected);
    });

    it("SÉCURITÉ : Échoue si le titre est vide ou trop long (Validation Zod)", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("Create", () =>
        ctrl.createPlaylistFromUser({
          title: "",
          tags: [],
          visibility: "public",
          cover: { file: getValidFile(), alt: "alt" },
        })
      );
      expect(res.success).toBe(false);
      expect(res.status).toBe(Status.IncorrectRegisterData);
    });

    it("CAS NOMINAL : Crée une playlist avec upload Cloudinary réel", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("Create", () =>
        ctrl.createPlaylistFromUser({
          title: "Playlist de UserA",
          description: "Ma description",
          tags: ["Jazz", "Test"],
          visibility: "public",
          cover: { file: getValidFile(), alt: "Cover A" },
        })
      );

      expect(res.success).toBe(true);

      const dbPlaylist = await prismaClient.playlist.findFirst({
        where: { title: "Playlist de UserA", authorId: userA.id },
        include: { cover: true },
      });
      expect(dbPlaylist).not.toBeNull();
      expect(dbPlaylist?.cover.url).toContain("cloudinary");
      userAPlaylistId = dbPlaylist?.id as number;
    });
  });

  describe("Méthode : removePlaylist", () => {
    it("SÉCURITÉ : UserB ne peut pas supprimer la playlist de UserA", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userB.id } });
      const res = await handleAction("Remove", () => ctrl.removePlaylist(userAPlaylistId));

      expect(res.success).toBe(false);

      const check = await prismaClient.playlist.findUnique({ where: { id: userAPlaylistId } });
      expect(check).not.toBeNull();
    });
  });

  describe("Gestion du contenu : Exercises", () => {
    it("CAS NOMINAL : Ajouter un exercice à sa propre playlist", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("AddExerciseToPlaylist", () =>
        ctrl.addExerciseToPlaylist(userAPlaylistId, seedExerciseId)
      );

      expect(res.success).toBe(true);

      const link = await prismaClient.playlistIncludesExercise.findUnique({
        where: {
          exerciseId_playlistId: { playlistId: userAPlaylistId, exerciseId: seedExerciseId },
        },
      });
      expect(link).not.toBeNull();
    });

    it("SÉCURITÉ : UserB ne peut pas ajouter d'exercice à la playlist de UserA", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userB.id } });
      const res = await handleAction("Add", () =>
        ctrl.addExerciseToPlaylist(userAPlaylistId, seedExerciseId)
      );

      expect(res.success).toBe(false);
    });

    it("CAS NOMINAL : Supprimer un exercice de sa playlist", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userA.id } });
      const res = await handleAction("Remove exercise from playlist", () =>
        ctrl.removeExerciseFromPlaylist(userAPlaylistId, seedExerciseId)
      );

      expect(res.success).toBe(true);
      const link = await prismaClient.playlistIncludesExercise.findUnique({
        where: {
          exerciseId_playlistId: { playlistId: userAPlaylistId, exerciseId: seedExerciseId },
        },
      });
      expect(link).toBeNull();
    });
  });

  describe("Méthode : addPlaylistToPlaylist", () => {
    it("EFFET DE BORD : Fusionner le contenu d'une playlist de seed dans la sienne", async () => {
      const seedPlaylist = await prismaClient.playlist.findFirst({
        where: { id: { not: userAPlaylistId }, visibility: "public" },
        include: { includesExercises: true },
      });
      const exercisesCountBefore = seedPlaylist?.includesExercises.length;

      expect(exercisesCountBefore).toBeGreaterThan(0);

      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userA.id } });
      const res = await ctrl.addPlaylistToPlaylist(userAPlaylistId, seedPlaylist?.id as number);

      expect(res.success).toBe(true);

      const totalInA = await prismaClient.playlistIncludesExercise.count({
        where: { playlistId: userAPlaylistId },
      });
      expect(totalInA).toBe(exercisesCountBefore);
    });
  });

  describe("Finalisation : removePlaylist", () => {
    it("CAS NOMINAL : UserA supprime sa playlist", async () => {
      const ctrl = new PlaylistController({ client: prismaClient, user: { id: userA.id } });
      const res = await ctrl.removePlaylist(userAPlaylistId);

      expect(res.success).toBe(true);
      const check = await prismaClient.playlist.findUnique({ where: { id: userAPlaylistId } });
      expect(check).toBeNull();
    });
  });
});
