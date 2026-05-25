import MidiController from "@/controllers/MidiController";
import { AppError } from "@/lib/errors";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/midi-editor/lib/midiconverter";
import { State } from "@/midi-editor/types/instance";
import GameRepository from "@/repositories/gameRepository";
import { Session } from "@/types/auth";
import type { Exercise } from "@/types/entities";
import { type ServerResponse, Status } from "@/types/server-response";
import type { PageContextServer } from "vike/types";

async function getMidiBuffer(
  pageContext: PageContextServer,
  session: Session | null
): Promise<{ midiBase64: string; exercise: ServerResponse<Exercise> }> {
  const exercise = await getExercise(pageContext, session);
  const id = pageContext.routeParams.id ? parseInt(pageContext.routeParams.id, 10) : null;
  const controller = new MidiController({ client: prismaClient, user: session });

  const response = await handleAction("Get a midi file", () => {
    if (!id) throw new AppError(Status.UnknownError, "Exercise not found");
    return controller.getMidiFile(id);
  });

  if (!response.success || !exercise.success) throw new Error("Unexpected error");

  const buffer =
    response.data instanceof Uint8Array
      ? response.data
      : new Uint8Array(Object.values(response.data) as number[]);

  const midiBase64 = Buffer.from(buffer).toString("base64");

  return { exercise, midiBase64 };
}

async function getExercise(
  pageContext: PageContextServer,
  session: Session | null
): Promise<ServerResponse<Exercise>> {
  const userId = session?.id ?? null;
  const id = pageContext.routeParams.id ? parseInt(pageContext.routeParams.id, 10) : null;
  if (!id)
    return {
      success: false,
      status: Status.BadRequest,
      title: "Incorrect Exercise id",
    };
  const repository = new GameRepository(prismaClient);
  return handleAction("get Exercise from id", () => repository.findOne(id, userId));
}

export default async function data(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const [globalData, { exercise, midiBase64 }] = await Promise.all([
    getGlobalData(pageContext),
    getMidiBuffer(pageContext, session),
  ]);

  return { ...globalData, exercise, midiBase64 };
}
export type Data = Awaited<ReturnType<typeof data>>;
