import { loginSchema } from "@/schemas/frontend";
import z from "zod";

export type Session = {
  username: string;
  userId: string;
  profilePictureSource: string;
};

export type LoginData = z.infer<typeof loginSchema>;
