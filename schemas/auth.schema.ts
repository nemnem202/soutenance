import * as z from "zod";
import { registerImageSchema } from "./common.schema";

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
    username: z
      .string({ error: "The username is required" })
      .min(5, { error: "The username must be at least 5 characters." })
      .max(20, { error: "The username must be 20 characters max." }),
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
