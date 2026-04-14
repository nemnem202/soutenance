import type { Playlist, PlaylistSchema } from "@/types/entities";
import { Repository } from "./repository";
import type { PlaylistCardDto, PlaylistDetailDto } from "@/types/dtos/playlist";
import { Status, type ServerResponse } from "@/types/server-response";

export class PlaylistRepository extends Repository {
  async create(playlist: PlaylistSchema, userId: number): Promise<Playlist> {
    const playlistDb = await this.client.playlist.create({
      data: {
        title: playlist.title,
        description: playlist.description,
        visibility: playlist.visibility,
        author: { connect: { id: userId } },
        cover: {
          create: {
            alt: playlist.cover.alt,
            url: playlist.cover.url,
          },
        },
      },
      include: {
        tags: true,
        cover: true,
        exercises: {
          include: {
            defaultConfig: true,
            midifile: true,
            chordsGrid: {
              include: {
                sections: {
                  include: {
                    commonMeasures: true,
                    voltas: true,
                  },
                },
              },
            },
          },
        },
        author: {
          omit: {
            createdAt: true,
            email: true,
            imageId: true,
            updatedAt: true,
          },
          include: {
            profilePicture: true,
          },
        },
      },
    });

    return {
      id: playlistDb.id,
      author: playlistDb.author,
      title: playlistDb.title,
      description: playlistDb.description ?? undefined,
      visibility: playlistDb.visibility,
      tags: playlistDb.tags.map((t) => t.label),
      cover: {
        url: playlistDb.cover.url,
        alt: playlistDb.cover.alt,
      },
      exercises: [],
    };
  }

  async getSortedByPopularity(
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<PlaylistCardDto[]>> {
    const sliced = await this.client.playlist.findMany({
      where: {
        visibility: "public",
      },
      orderBy: {
        userLikesPlaylists: {
          _count: "desc",
        },
      },
      skip: start,
      take: length,
      include: {
        cover: true,
        exercises: {
          select: {
            id: true,
          },
        },
        author: {
          include: {
            profilePicture: true,
          },
          omit: {
            createdAt: true,
            updatedAt: true,
            email: true,
          },
        },
      },
    });

    return {
      status: Status.Ok,
      success: true,
      data: sliced.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercisesIds: playlist.exercises,
        visibility: playlist.visibility,
      })),
    };
  }
  async getDiscover(
    start: number = 0,
    length: number = 20
  ): Promise<ServerResponse<PlaylistCardDto[]>> {
    const playlists = await this.client.$queryRaw<Playlist[]>`
    SELECT id FROM "Playlist"
    WHERE visibility = 'public'
    ORDER BY RANDOM()
    LIMIT ${length} OFFSET ${start}
  `;

    const ids = playlists.map((p) => p.id);

    const sliced = await this.client.playlist.findMany({
      where: {
        id: { in: ids },
        visibility: "public",
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
      status: Status.Ok,
      success: true,
      data: sliced.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercisesIds: playlist.exercises,
        visibility: playlist.visibility,
      })),
    };
  }

  async getUserPlaylists(userId: number): Promise<ServerResponse<PlaylistCardDto[]>> {
    const playlists = await this.client.playlist.findMany({
      where: {
        authorId: userId,
      },
      include: {
        cover: true,
        exercises: {
          select: {
            id: true,
          },
        },
        author: {
          include: {
            profilePicture: true,
          },
          omit: {
            createdAt: true,
            updatedAt: true,
            email: true,
          },
        },
      },
    });

    return {
      status: Status.Ok,
      success: true,
      data: playlists.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercisesIds: playlist.exercises,
        visibility: playlist.visibility,
      })),
    };
  }

  async getSingleFromId(
    playlistId: number,
    mustBePublic: boolean | undefined = true
  ): Promise<ServerResponse<PlaylistDetailDto>> {
    const playlist = await this.client.playlist.findUnique({
      where: {
        id: playlistId,
        visibility: mustBePublic ? "public" : { in: ["public", "private"] },
      },
      include: {
        author: {
          include: {
            profilePicture: true,
          },
          omit: {
            createdAt: true,
            updatedAt: true,
            email: true,
          },
        },
        cover: true,
        exercises: {
          include: {
            author: {
              include: {
                profilePicture: true,
              },
              omit: {
                createdAt: true,
                updatedAt: true,
                email: true,
              },
            },
            likedByUsers: true,
            chordsGrid: true,
            defaultConfig: {
              select: {
                bpm: true,
              },
            },
            midifile: true,
          },
        },
        userLikesPlaylists: true,
      },
    });

    if (!playlist) {
      return {
        status: Status.NotFound,
        success: false,
        title: "The playlist is either private or has been removed by it's author.",
      };
    }

    return {
      status: Status.Ok,
      success: true,
      data: {
        author: playlist.author,
        cover: playlist.cover,
        exercises: playlist.exercises.map((e) => ({
          ...e,
          likes: e.likedByUsers.length,
          likedByCurrentUser: false,
          inUserPlaylists: [],
          defaultConfig: e.defaultConfig,
          midifileUrl: !!e.midifile,
          chordsGrid: !!e.chordsGrid,
        })),
        exercisesIds: playlist.exercises.map((e) => ({ id: e.id })),
        id: playlist.id,
        likes: playlist.userLikesPlaylists.length,
        title: playlist.title,
        visibility: playlist.visibility,
        likedByCurrentUser: false,
      },
    };
  }

  async getFromSearch(
    query: string,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<PlaylistCardDto[]>> {
    const playlists = await this.client.$queryRaw<Playlist[]>`
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

    const ids = playlists.map((p) => p.id);

    const sliced = await this.client.playlist.findMany({
      where: {
        id: { in: ids },
        visibility: "public",
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
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercisesIds: playlist.exercises,
        visibility: playlist.visibility,
      })),
    };
  }
}
