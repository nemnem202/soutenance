import type { cellSchema, chordSchema, noteSchema, voltaSchema } from "@/schemas/entities.schema";
import type z from "zod";

export type Cell = z.infer<typeof cellSchema>;

export type Chord = z.infer<typeof chordSchema>;

export type Volta = z.infer<typeof voltaSchema>;

export type Note = z.infer<typeof noteSchema>;
