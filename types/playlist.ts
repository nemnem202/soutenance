import type { playlistRegisterSchema } from "@/schemas/auth.schema";
import type z from "zod";

export type PlaylistRegisterData = z.infer<typeof playlistRegisterSchema>;
