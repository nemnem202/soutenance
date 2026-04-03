import type z from "zod";
import type { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { Image } from "./entities";

export type Session = {
  username: string;
  id: number;
  profilePictureSource: Image;
};

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
