import { playlistRegisterSchema } from "@/schemas/auth.schema";
import z from "zod";

export type PlaylistRegisterData = z.infer<typeof playlistRegisterSchema>;
