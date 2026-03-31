import type z from "zod";
import type { loginSchema, registerSchema } from "@/schemas/auth.schema";

export type Session = {
  username: string;
  id: number;
  profilePictureSource: string;
};

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
