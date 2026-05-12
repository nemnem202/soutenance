import argon2 from "argon2";
import type { UserCardDto, UserDetailsDto } from "@/types/dtos/user";
import { type ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";
import { AppError } from "@/lib/errors";

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
    // 1. Récupérer l'imageId actuel du user
    const user = await this.client.user.findUnique({
      where: { id: userId },
      select: { imageId: true },
    });

    if (!user) throw new Error(`User ${userId} not found`);

    // 2. Mettre à jour l'Image directement
    await this.client.image.update({
      where: { id: user.imageId },
      data: { url: fileUpload.url, cloudId: fileUpload.imageId },
    });

    // 3. Retourner le user avec la relation à jour
    const updatedUser = await this.client.user.findUnique({
      where: { id: userId },
      include: { profilePicture: true },
    });

    if (!updatedUser) throw new AppError(Status.UnknownError, "Cannot update user image");
    return updatedUser;
  }

  async delete(userId: number) {
    await this.client.user.delete({ where: { id: userId } });
  }

  async getRecommended(
    userId: number | null,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<UserCardDto[]>> {
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
        likedByUsers: userId ? { where: { likingId: userId }, select: { likingId: true } } : false,
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
        likedByCurrentUser: user.likedByUsers && user.likedByUsers.length > 0,
      })),
    };
  }

  async getSingleFromId(
    userId: number,
    currentUserId: number | null
  ): Promise<ServerResponse<UserDetailsDto>> {
    const user = await this.client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        likedByUsers: userId ? { where: { likingId: userId }, select: { likingId: true } } : false,
        playlists: {
          where: {
            OR: [
              { visibility: "public" },
              currentUserId ? { visibility: "private", authorId: currentUserId } : {},
            ],
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
            includesExercises: {
              select: {
                exercise: {
                  select: {
                    id: true,
                  },
                },
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
        likedByCurrentUser: user.likedByUsers.length > 0,
        publicPlaylists: user.playlists.map((playlist) => ({
          author: playlist.author,
          cover: playlist.cover,
          id: playlist.id,
          title: playlist.title,
          visibility: playlist.visibility,
          exercises: playlist.includesExercises.map((include) => include.exercise),
          likedByCurrentUser: playlist.userLikesPlaylists.length > 0,
        })),
      },
    };
  }
}
