import ExerciseRepository from "@/repositories/exerciseRepository";
import { exerciseSchema } from "@/schemas/entities.schema";
import type { ExerciseSchema } from "@/types/entities";
import { Controller } from "./Controller";
import { AppError } from "@/lib/errors";
import { Status } from "@/types/server-response";

export default class ExerciseController extends Controller {
  private repository = new ExerciseRepository(this.client);

  public async createExercise(exercise: ExerciseSchema, playlistId: number) {
    const userId = this.okUser();

    const validation = exerciseSchema.safeParse(exercise);
    if (!validation.success) {
      throw new AppError(Status.BadRequest, "Exercice invalide", validation.error.message);
    }

    return await this.repository.create(exercise, playlistId, userId);
  }
}
