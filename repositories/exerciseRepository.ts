import type { Exercise, ExerciseSchema } from "@/types/entities";
import { Repository } from "./repository";
import type { Cell } from "@/types/music";

export default class ExerciseRepository extends Repository {
  async create(exercise: ExerciseSchema, playlistId: number, userId: number): Promise<Exercise> {
    return await this.client.playlist.update({
      where: { id: playlistId },
      data: {
        exercises: {
          create: {
            title: exercise.title,
            composer: exercise.composer,
            author: { connect: { id: userId } },
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
}
