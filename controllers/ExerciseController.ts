import { exerciseSchema } from "@/schemas/entities.schema";
import type { Config, ExerciseSchema } from "@/types/entities";
import type { Cell } from "@/types/music";
import { Controller, type ControllerDeps } from "./Controller";

interface ExerciseControllerDeps extends ControllerDeps {
  userId: number;
}

export default class ExerciseController extends Controller<ExerciseControllerDeps> {
  public async createExercise(exercise: ExerciseSchema, playlistId: number) {
    const user = await this.deps.client.user.findUnique({
      where: { id: this.deps.userId },
    });

    if (!user) throw new Error("User not found");

    const exerciseValidation = exerciseSchema.safeParse(exercise);
    if (!exerciseValidation.success) {
      throw new Error(`Exercise invalide ${exerciseValidation.error.message}`);
    }

    return await this.deps.client.playlist.update({
      where: { id: playlistId },
      data: {
        exercises: {
          create: {
            title: exercise.title,
            composer: exercise.composer,
            author: { connect: { id: user.id } },
            defaultConfig: {
              create: {
                bpm: exercise.defaultConfig.bpm,
                key: exercise.defaultConfig.key,
                groove: exercise.defaultConfig.groove,
                timeSignatureTop: exercise.defaultConfig.timeSignatureTop,
                timeSignatureBottom: exercise.defaultConfig.timeSignatureBottom,
              },
            },
            midifile: {
              create: { url: exercise.midifileUrl },
            },

            chordsGrid: {
              create: {
                sections: {
                  create: exercise.chordsGrid.sections.map((section) => ({
                    index: section.index,
                    type: section.type,
                    label: section.label,

                    commonMeasures: {
                      create: section.commonMeasures.map((measure) => ({
                        index: measure.index,
                        cells: {
                          create: measure.cells.map((cell) => this.mapCellToPrisma(cell)),
                        },
                      })),
                    },

                    voltas: {
                      create: section.voltas.map((volta) => ({
                        volta: volta.volta,
                        measures: {
                          create: volta.measures.map((m) => ({
                            index: m.index,
                            cells: {
                              create: m.cells.map((cell) => this.mapCellToPrisma(cell)),
                            },
                          })),
                        },
                      })),
                    },
                  })),
                },
              },
            },
          },
        },
      },
    });
  }

  private mapCellToPrisma(cell: Cell) {
    const base = {
      kind: cell.kind,
      keychange: cell.keychange,
      timeSignatureChangeTop: cell.timeSignatureChangeTop,
      timeSignatureChangeBottom: cell.timeSignatureChangeBottom,
    };

    if (cell.kind === "Chord" && cell.chord) {
      return {
        ...base,
        chord: {
          create: {
            note: cell.chord.content.note,
            modifier: cell.chord.content.modifier,

            over: cell.chord.over
              ? {
                  create: {
                    note: cell.chord.over.note,
                    modifier: cell.chord.over.modifier,
                  },
                }
              : undefined,
            alternate: cell.chord.alt
              ? {
                  create: {
                    note: cell.chord.alt.note,
                    modifier: cell.chord.alt.modifier,
                  },
                }
              : undefined,
          },
        },
      };
    }

    return base;
  }
  public updateExercise(_exercise: ExerciseSchema) {}
  public removeExercise(_exercise: ExerciseSchema) {}
  public updateUserCustomConfig(_config: Config, _exerciseId: number) {}
}
