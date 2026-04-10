import type { Config, ExerciseSchema } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";

interface ExerciseControllerDeps extends ControllerDeps {
  userId: number;
}

export default class ExerciseController extends Controller<ExerciseControllerDeps> {
  public createExercise(_exercise: ExerciseSchema, _playlistId: number) {}
  public updateExercise(_exercise: ExerciseSchema) {}
  public removeExercise(_exercise: ExerciseSchema) {}
  public updateUserCustomConfig(_config: Config, _exerciseId: number) {}
}
