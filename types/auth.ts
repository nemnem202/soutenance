import type { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type z from "zod";

export type Session = {
  username: string;
  userId: string;
  profilePictureSource: string;
};

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
