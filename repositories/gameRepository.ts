import { ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";
import { CellSchema, ChordsGridSchema, Exercise, SectionSchema } from "@/types/entities";

export default class GameRepository extends Repository {
  async findOne(id: number, userId: number | null): Promise<ServerResponse<Exercise>> {
    const exercise = await this.client.exercise.findFirst({
      where: {
        id: id,
        OR: [
          {
            fromPlaylist: {
              visibility: "public",
            },
          },
          { authorId: id },
        ],
      },
      select: {
        id: true,
        title: true,
        composer: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: {
              select: {
                alt: true,
                url: true,
              },
            },
          },
        },
        midifile: {
          select: {
            url: true,
          },
        },
        defaultConfig: {
          select: {
            bpm: true,
            key: true,
            groove: true,
            timeSignatureTop: true,
            timeSignatureBottom: true,
          },
        },
        chordsGrid: {
          select: {
            sections: {
              select: {
                type: true,
                label: true,
                index: true,
                voltas: {
                  select: {
                    volta: true, // Added: missing in the original select
                    measures: {
                      select: {
                        index: true,
                        cells: {
                          select: {
                            timeSignatureChangeTop: true,
                            timeSignatureChangeBottom: true,
                            keychange: true,
                            kind: true,
                            chord: {
                              select: {
                                modifier: true,
                                note: true,
                                over: {
                                  select: {
                                    modifier: true,
                                    note: true,
                                  },
                                },
                                alternate: {
                                  select: {
                                    modifier: true,
                                    note: true,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                commonMeasures: {
                  select: {
                    index: true,
                    cells: {
                      select: {
                        timeSignatureChangeTop: true,
                        timeSignatureChangeBottom: true,
                        keychange: true,
                        kind: true,
                        chord: {
                          select: {
                            modifier: true,
                            note: true,
                            over: {
                              select: {
                                modifier: true,
                                note: true,
                              },
                            },
                            alternate: {
                              select: {
                                modifier: true,
                                note: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!exercise)
      return {
        success: false,
        status: Status.NotFound,
        title: "The exercise could not be found.",
        description: "It has either been removed or defined as private.",
      };

    // Helper to format Prisma cells into Zod CellSchema
    const mapCells = (cells: any[]): CellSchema[] => {
      return cells.map((cell) => {
        const base = {
          keychange: cell.keychange,
          timeSignatureChangeTop: cell.timeSignatureChangeTop,
          timeSignatureChangeBottom: cell.timeSignatureChangeBottom,
        };

        if (cell.kind === "Chord" && cell.chord) {
          return {
            ...base,
            kind: "Chord",
            chord: {
              content: {
                note: cell.chord.note,
                modifier: cell.chord.modifier,
              },
              over: cell.chord.over
                ? { note: cell.chord.over.note, modifier: cell.chord.over.modifier }
                : undefined,
              alt: cell.chord.alternate
                ? { note: cell.chord.alternate.note, modifier: cell.chord.alternate.modifier }
                : undefined,
            },
          } as CellSchema;
        }

        return {
          ...base,
          kind: cell.kind as "Spacer" | "Empty",
        };
      });
    };

    const chordsGrid: ChordsGridSchema | null = exercise.chordsGrid
      ? {
          sections: exercise.chordsGrid.sections.map((section) => ({
            index: section.index,
            label: section.label,
            type: section.type as SectionSchema["type"],
            voltas: section.voltas.map((volta) => ({
              volta: volta.volta,
              measures: volta.measures.map((measure) => ({
                index: measure.index,
                cells: mapCells(measure.cells),
              })),
            })),
            commonMeasures: section.commonMeasures.map((measure) => ({
              index: measure.index,
              cells: mapCells(measure.cells),
            })),
          })),
        }
      : null;

    return {
      success: true,
      status: Status.Ok,
      data: {
        ...exercise,
        midifileUrl: exercise.midifile?.url,
        chordsGrid: chordsGrid,
      } as Exercise, // Cast to Exercise to satisfy standard response requirements
    };
  }
}
