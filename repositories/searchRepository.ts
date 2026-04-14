import { type ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";
import type { Session } from "@/types/auth";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import type { SoloExerciseCardDto } from "@/types/dtos/exercise";

export interface AnySearch {
  exercises: (SoloExerciseCardDto & { rank: number })[];
  playlists: (PlaylistCardDto & { rank: number })[];
  users: (Session & { rank: number })[];
}

export default class SearchRepository extends Repository {
  async getUsers(
    query: string,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<(Session & { score: number })[]>> {
    const rawResults = await this.client.$queryRaw<{ id: number; weighted_score: number }[]>`
      SELECT u.*, 
       similarity(u.username, ${query}) AS weighted_score,
       (SELECT COUNT(*) FROM "UserLikesUser" WHERE "likedId" = u.id) AS popularity
      FROM "User" u
      WHERE u.username % ${query}
      ORDER BY weighted_score DESC, popularity DESC
      LIMIT ${length} OFFSET ${start};
      `;

    const ids = rawResults.map((r) => r.id);
    const scoreMap = new Map(rawResults.map((r) => [r.id, r.weighted_score]));

    const sliced = await this.client.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        username: true,
        profilePicture: {
          select: {
            url: true,
            alt: true,
          },
        },
      },
      skip: start,
      take: length,
    });

    return {
      status: Status.Ok,
      success: true,
      data: sliced.map((user) => ({
        score: scoreMap.get(user.id) ?? 0,
        id: user.id,
        profilePicture: user.profilePicture,
        username: user.username,
      })),
    };
  }

  async getPlaylists(
    query: string,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<(PlaylistCardDto & { score: number })[]>> {
    const rawResults = await this.client.$queryRaw<{ id: number; weighted_score: number }[]>`
      SELECT p.*,
            (
              similarity(p.title, ${query}) * 4 + 
              similarity(u.username, ${query}) * 2 +
              COALESCE(similarity(p.description, ${query}), 0) + 
              COALESCE((SELECT AVG(similarity(t.label, ${query})) FROM "PlaylistTag" t WHERE t."playlistId" = p.id), 0)
            ) / 8.0 AS weighted_score,
            (SELECT COUNT(*) FROM "UserLikesPlaylist" WHERE "playlistId" = p.id) AS popularity
      FROM "Playlist" p
      JOIN "User" u ON p."authorId" = u.id
      WHERE p.visibility = 'public' 
        AND (
          p.title % ${query} 
          OR u.username % ${query} 
          OR p.description % ${query}
        )
      ORDER BY weighted_score DESC, popularity DESC
      LIMIT ${length} OFFSET ${start};
  `;

    const ids = rawResults.map((r) => r.id);
    const scoreMap = new Map(rawResults.map((r) => [r.id, r.weighted_score]));

    const sliced = await this.client.playlist.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        cover: true,
        exercises: { select: { id: true } },
        author: {
          include: { profilePicture: true },
          omit: { createdAt: true, updatedAt: true, email: true },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: sliced.map((playlist) => ({
        score: scoreMap.get(playlist.id) ?? 0,
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercisesIds: playlist.exercises,
        visibility: playlist.visibility,
      })),
    };
  }

  async getExercises(
    query: string,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<(SoloExerciseCardDto & { score: number })[]>> {
    const rawResults = await this.client.$queryRaw<{ id: number; weighted_score: number }[]>`
        SELECT e.*, 
          similarity(e.title, ${query}) AS weighted_score,
          (SELECT COUNT(*) FROM "UserLikesExercise" WHERE "exerciseId" = e.id) AS popularity
        FROM "Exercise" e
        JOIN "User" a ON e."authorId" = a.id
        JOIN "Playlist" p ON e."playlistId" = p.id
        WHERE p.visibility = 'public'
          AND (e.title % ${query} OR e.composer % ${query} OR a.username % ${query})
        ORDER BY weighted_score DESC, popularity DESC
        LIMIT ${length} OFFSET ${start};
          `;

    const ids = rawResults.map((r) => r.id);
    const scoreMap = new Map(rawResults.map((r) => [r.id, r.weighted_score]));

    const sliced = await this.client.exercise.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: {
              select: {
                alt: true,
                url: true,
              },
            },
          },
        },
        midifile: true,
        chordsGrid: true,
        playlist: {
          select: {
            cover: {
              select: {
                alt: true,
                url: true,
              },
            },
          },
        },
        defaultConfig: {
          select: {
            bpm: true,
          },
        },
        title: true,
        _count: {
          select: {
            likedByUsers: true,
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: sliced.map((exercise) => ({
        score: scoreMap.get(exercise.id) ?? 0,
        id: exercise.id,
        inUserPlaylists: [],
        likedByCurrentUser: false,
        midifileUrl: !!exercise.midifile,
        likes: exercise._count.likedByUsers,
        title: exercise.title,
        author: exercise.author,
        chordsGrid: !!exercise.chordsGrid,
        cover: exercise.playlist.cover,
        defaultConfig: exercise.defaultConfig,
      })),
    };
  }

  async getAny(
    query: string,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<AnySearch>> {
    const [users, playlists, exercises] = await Promise.all([
      this.getUsers(query, start, length),
      this.getPlaylists(query, start, length),
      this.getExercises(query, start, length),
    ]);

    const combined = [
      ...(users.success ? users.data : []),
      ...(playlists.success ? playlists.data : []),
      ...(exercises.success ? exercises.data : []),
    ];

    const slice = combined
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }))
      .slice(0, length);

    const usersArray = slice.filter(
      (e): e is Session & { rank: number; score: number } =>
        "username" in e && !("visibility" in e) && !("midifileUrl" in e)
    );

    const playlistsArray = slice.filter(
      (e): e is PlaylistCardDto & { rank: number; score: number } => "visibility" in e
    );

    const exercisesArray = slice.filter(
      (e): e is SoloExerciseCardDto & { rank: number; score: number } => "midifileUrl" in e
    );
    return {
      success: true,
      status: Status.Ok,
      data: {
        exercises: exercisesArray,
        playlists: playlistsArray,
        users: usersArray,
      },
    };
  }
}
