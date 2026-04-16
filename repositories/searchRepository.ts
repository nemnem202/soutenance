import { logger } from "@/lib/logger";
import type { ExerciseCardDto, SoloExerciseCardDto } from "@/types/dtos/exercise";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import { type ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";
import type { UserCardDto } from "@/types/dtos/user";

export interface AnySearch {
  exercises: (SoloExerciseCardDto & { rank: number })[];
  playlists: (PlaylistCardDto & { rank: number })[];
  users: (UserCardDto & { rank: number })[];
}

export default class SearchRepository extends Repository {
  async getUsers(
    query: string,
    userId: number | null,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<(UserCardDto & { score: number })[]>> {
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
        likedByUsers: userId ? { where: { likingId: userId }, select: { likingId: true } } : false,
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
      data: sliced
        .map((user) => ({
          score: scoreMap.get(user.id) ?? 0,
          id: user.id,
          profilePicture: user.profilePicture,
          username: user.username,
          likedByCurrentUser: !!(user as any).likedByUsers?.length,
        }))
        .sort((a, b) => b.score - a.score),
    };
  }

  async getPlaylists(
    query: string,
    userId: number | null,
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
        includesExercises: {
          select: {
            exercise: { select: { id: true } },
          },
        },
        author: {
          include: { profilePicture: true },
          omit: { createdAt: true, updatedAt: true, email: true },
        },
        userLikesPlaylists: userId ? { where: { userId: userId } } : false,
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: sliced
        .map((playlist) => ({
          score: scoreMap.get(playlist.id) ?? 0,
          id: playlist.id,
          title: playlist.title,
          author: playlist.author,
          cover: playlist.cover,
          exercises: playlist.includesExercises.map((include) => include.exercise),
          visibility: playlist.visibility,
          likedByCurrentUser: !!(playlist as any).userLikesPlaylists?.length,
        }))
        .sort((a, b) => b.score - a.score),
    };
  }

  async getExercises(
    query: string,
    userId: number | null,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<(SoloExerciseCardDto & { score: number })[]>> {
    const rawResults = await this.client.$queryRaw<{ id: number; weighted_score: number }[]>`
        SELECT e.*, 
          similarity(e.title, ${query}) AS weighted_score,
          (SELECT COUNT(*) FROM "UserLikesExercise" WHERE "exerciseId" = e.id) AS popularity
        FROM "Exercise" e
        JOIN "User" a ON e."authorId" = a.id
        JOIN "Playlist" p ON e."originPlaylistId" = p.id
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
        composer: true,
        likedByUsers: userId ? { where: { userId: userId } } : false,
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
        fromPlaylist: {
          select: {
            id: true,
            visibility: true,
            title: true,
            includesExercises: { select: { exercise: { select: { id: true } } } },
            cover: {
              select: {
                url: true,
                alt: true,
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
      data: sliced
        .map((exercise) => ({
          score: scoreMap.get(exercise.id) ?? 0,
          ...exercise,
          inUserPlaylists: [],
          likedByCurrentUser: !!(exercise as any).likedByUsers?.length,
          midifileUrl: !!exercise.midifile,
          likes: exercise._count.likedByUsers,
          chordsGrid: !!exercise.chordsGrid,
          cover: exercise.fromPlaylist.cover,

          originPlaylist: {
            ...exercise.fromPlaylist,
            exercises: exercise.fromPlaylist.includesExercises.map((include) => include.exercise),
          },
        }))
        .sort((a, b) => b.score - a.score),
    };
  }

  async getAny(
    query: string,
    userId: number | null,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<AnySearch>> {
    const specificSearchPattern = /^(.*?)\s+-\s+(.*)$/;
    const match = query.match(specificSearchPattern);

    let usersPromise: Promise<
      ServerResponse<
        (UserCardDto & {
          score: number;
        })[]
      >
    >;
    let playlistsPromise: Promise<
      ServerResponse<
        (PlaylistCardDto & {
          score: number;
        })[]
      >
    >;
    let exercisesPromise: Promise<
      ServerResponse<
        (ExerciseCardDto & {
          score: number;
        })[]
      >
    >;

    if (match) {
      const [_, titlePart, authorPart] = match;
      usersPromise = this.getUsers(authorPart, userId, start, length);
      playlistsPromise = this.getPlaylists(titlePart, userId, start, length);
      exercisesPromise = this.getExercises(titlePart, userId, start, length);
    } else {
      usersPromise = this.getUsers(query, userId, start, length);
      playlistsPromise = this.getPlaylists(query, userId, start, length);
      exercisesPromise = this.getExercises(query, userId, start, length);
    }

    const [users, playlists, exercises] = await Promise.all([
      usersPromise,
      playlistsPromise,
      exercisesPromise,
    ]);

    let combined = [
      ...(users.success ? users.data : []),
      ...(playlists.success ? playlists.data : []),
      ...(exercises.success ? exercises.data : []),
    ];

    if (match) {
      const [_, titlePart, authorPart] = match;
      const tPart = titlePart.toLowerCase().trim();
      const aPart = authorPart.toLowerCase().trim();

      combined = combined.map((item) => {
        let boost = 0;
        if ("title" in item && item.author?.username) {
          const itemTitle = item.title.toLowerCase();
          const itemAuthor = item.author.username.toLowerCase();
          if (itemTitle.includes(tPart) && itemAuthor.includes(aPart)) {
            boost = 10;
          }
        }
        return { ...item, score: (item.score || 0) + boost };
      });
    }

    const slice = combined
      .sort((a, b) => b.score - a.score)
      .slice(0, length)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    logger.info("Top ranked item :", slice[0]);

    const usersArray = slice.filter(
      (e): e is UserCardDto & { rank: number; score: number } =>
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
