import { Repository } from "./repository";
import argon2 from "argon2";

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
}
