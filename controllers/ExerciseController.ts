import { exerciseSchema } from "@/schemas/entities.schema";
import type { Config, ExerciseSchema } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";
import ExerciseRepository from "@/repositories/exerciseRepository";

interface ExerciseControllerDeps extends ControllerDeps {
  userId: number;
}

export default class ExerciseController extends Controller<ExerciseControllerDeps> {
  private repository = new ExerciseRepository(this.deps.client);

  public async createExercise(exercise: ExerciseSchema, playlistId: number) {
    const user = await this.deps.client.user.findUnique({
      where: { id: this.deps.userId },
    });

    if (!user) throw new Error("User not found");

    const exerciseValidation = exerciseSchema.safeParse(exercise);
    if (!exerciseValidation.success) {
      throw new Error(`Exercise invalide ${exerciseValidation.error.message}`);
    }

    return await this.repository.create(exercise, playlistId, user.id);
  }
  public updateExercise(_exercise: ExerciseSchema) {}
  public removeExercise(_exercise: ExerciseSchema) {}
  public updateUserCustomConfig(_config: Config, _exerciseId: number) {}
}
