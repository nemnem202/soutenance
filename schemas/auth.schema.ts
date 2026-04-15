import * as z from "zod";
import { registerImageSchema, usernameSchema } from "./common.schema";

export const loginSchema = z.object({
  email: z
    .email({ error: "The email is required" })
    .max(255, { error: "The email is too long (max 255)." }),
  password: z
    .string({ error: "The password is required." })
    .min(8, { error: "The password must be at least 8 characters." })
    .max(128, { error: "The password is too long (max 128)." }),
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    image: registerImageSchema,
    username: usernameSchema,
    email: z
      .email({ message: "The email is required" })
      .max(255, { message: "The email is too long (max 255)." }),
    password: z
      .string({ message: "The password is required." })
      .min(8, { message: "The password must be at least 8 characters." })
      .max(128, { message: "The password is too long." }),
    password_confirm: z.string({ message: "Please confirm your password." }),
    agree_terms_of_service: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirm, {
    error: "Passwords do not match",
    path: ["password_confirm"],
  })
  .refine((data) => data.agree_terms_of_service === true, {
    error: "You must agree with terms of service",
    path: ["agree_terms_of_service"],
  });

export const playlistRegisterSchema = z.object({
  cover: registerImageSchema,
  title: z
    .string("The title is provided")
    .min(1, "The title of the playlist is too short")
    .max(100, "The title of the playlist is too long. Max 100 caracters"),
  description: z
    .string()
    .max(500, "The description of the playlist is too long. Max 500 caracters")
    .optional()
    .nullable(),
  tags: z
    .array(z.string().max(50, "One of the tags provided is too long, max 50 caracters."))
    .max(10, "Too much tags provided, max 10"),
  visibility: z.enum(["private", "public"]),
});
