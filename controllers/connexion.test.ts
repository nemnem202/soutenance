import type { RegisterData } from "@/types/auth";
import { beforeAll, describe, it } from "vitest";
import prismaClient from "@/lib/prisma-client";
import UserRepository from "@/repositories/userRepository";
import { faker } from "@faker-js/faker";
import fs from "node:fs";
import path from "node:path";

let userData: RegisterData;
let existingUserData: RegisterData;

beforeAll(async () => {
  const imagePath = path.resolve(process.cwd(), "assets/images/account-default-pic.webp");
  const buffer = fs.readFileSync(imagePath);
  const file = new File([buffer], "default.webp", { type: "image/webp" });

  userData = {
    username: "TestUser",
    agree_terms_of_service: true,
    email: "userTest@gmail.com",
    password: "123456789",
    password_confirm: "123456789",
    image: {
      file: file,
      alt: "The picture of testUser",
    },
  };

  existingUserData = {
    username: "ExistingUser",
    agree_terms_of_service: true,
    email: "userExisting@gmail.com",
    password: "123456789",
    password_confirm: "123456789",
    image: {
      file: file,
      alt: "The picture of ExistingUser",
    },
  };

  await new UserRepository(prismaClient).create(
    existingUserData.email,
    existingUserData.username,
    existingUserData.image.alt,
    faker.image.url(),
    crypto.randomUUID(),
    existingUserData.password
  );
});

describe("Create an account", async () => {
  await it("Fails to create an account with too large image", async () => {});
  await it("Fails to create an account with incorrect email", async () => {});
  await it("Fails to create an account with too short password", async () => {});
  await it("Create an account with correct data", async () => {});
  await it("Fails to create an account with username already picked", async () => {});
});

describe("Update an account", async () => {
  await it("Fails to update an already picked username", async () => {});
  await it("Fails to update image it it's too large", async () => {});
  await it("Update username successfully", async () => {});
  await it("Update image successfully", async () => {});
  await it("Fails to update an account it user doesn't have session", async () => {});
});

describe("Remove an account", async () => {
  await it("Fails to Delete an account if user doesn't have session", async () => {});
  await it("Delete an account with success if user has session", async () => {});
});
