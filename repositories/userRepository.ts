import argon2 from "argon2";
import type { Session } from "@/types/auth";
import type { UserDetailsDto } from "@/types/dtos/user";
import { type ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";

export default class UserRepository extends Repository {
  async create(
    email: string,
    username: string,
    alt: string,
    url: string,
    imageId: string,
    password: string
  ) {
    return await this.client.user.create({
      data: {
        email: email,
        username: username,
        profilePicture: {
          create: {
            alt: alt,
            url: url,
            cloudId: imageId,
          },
        },
        classicAuthMethod: { create: { password: await argon2.hash(password) } },
      },
      include: { profilePicture: true },
    });
  }

  async updateUsername(userId: number, username: string) {
    return await this.client.user.update({
      where: { id: userId },
      data: {
        username: username,
      },
      include: {
        profilePicture: true,
      },
    });
  }

  async updateImage(fileUpload: { url: string; imageId: string }, userId: number) {
    return await this.client.user.update({
      where: { id: userId },
      data: { profilePicture: { update: { url: fileUpload.url, cloudId: fileUpload.imageId } } },
      include: { profilePicture: true },
    });
  }

  async delete(userId: number) {
    await this.client.user.delete({ where: { id: userId } });
  }

  async getRecommended(
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<Session[]>> {
    const sliced = await this.client.user.findMany({
      where: {
        playlists: {
          some: {},
        },
      },
      orderBy: {
        likedByUsers: {
          _count: "desc",
        },
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
        id: user.id,
        profilePicture: user.profilePicture,
        username: user.username,
      })),
    };
  }

  async getSingleFromId(
    id: number,
    userId: number | null
  ): Promise<ServerResponse<UserDetailsDto>> {
    const user = await this.client.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        playlists: {
          where: {
            visibility: "public",
          },
          select: {
            id: true,
            author: {
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
            },
            authorId: true,
            exercises: {
              select: {
                id: true,
              },
            },
            visibility: true,
            title: true,
            cover: {
              select: {
                alt: true,
                url: true,
              },
            },
            userLikesPlaylists: userId
              ? { where: { userId: userId }, select: { userId: true } }
              : false,
          },
        },
        profilePicture: {
          select: {
            alt: true,
            url: true,
          },
        },
      },
    });

    if (!user) return { status: Status.NotFound, success: false, title: "User not found.." };

    return {
      status: Status.Ok,
      success: true,
      data: {
        id: user.id,
        profilePicture: user.profilePicture,
        username: user.username,
        publicPlaylists: user.playlists.map((playlist) => ({
          author: playlist.author,
          cover: playlist.cover,
          id: playlist.id,
          title: playlist.title,
          visibility: playlist.visibility,
          exercisesIds: playlist.exercises,
          likedByCurrentUser: playlist.userLikesPlaylists.length > 0,
        })),
      },
    };
  }
}
