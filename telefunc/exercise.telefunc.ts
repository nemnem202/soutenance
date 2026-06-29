import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import ExerciseRepository from "@/repositories/exerciseRepository";
import { Exercise } from "@/types/entities";
import { Filters } from "@/types/navigation";
import { ServerResponse } from "@/types/server-response";

export default async function onSearchExercisesByFilters(
  filters: Filters
): Promise<ServerResponse<Exercise[]>> {
  const repository = new ExerciseRepository(prismaClient);
  return handleAction<Exercise[]>("Find Exercise by Filters", () =>
    repository.findManyByFilters(filters)
  );
}
