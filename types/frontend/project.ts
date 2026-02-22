import { activeTracksSchema, projectConfigSchema, projectSchema } from "@/schemas/frontend";
import z from "zod";

export type ActiveTracks = z.infer<typeof activeTracksSchema>;

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

export type Project = z.infer<typeof projectSchema>;
