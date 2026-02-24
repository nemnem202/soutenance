import { projectSchema } from "@/schemas/frontend";
import z from "zod";

export type Project = z.infer<typeof projectSchema>;
