import type { Config, Exercise } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";

interface ExerciseControllerDeps extends ControllerDeps {
  userId: number;
}

export default class ExerciseController extends Controller<ExerciseControllerDeps> {
  public createExercise(_exercise: Exercise, _playlistId: number) {}
  public updateExercise(_exercise: Exercise) {}
  public removeExercise(_exercise: Exercise) {}
  public updateUserCustomConfig(_config: Config, _exerciseId: number) {}
}
