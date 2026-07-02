import type { Prisma } from "@/lib/generated/prisma/client";
import type {
  CellSchema,
  ChordSchema,
  ChordsGridSchema,
  Exercise,
  ExerciseSchema,
  MeasureSchema,
  SectionSchema,
  VoltaSchema,
} from "@/types/entities";
import { Repository } from "./repository";
import { ServerResponse, Status } from "@/types/server-response";
import { Filters } from "@/types/navigation";
import { logger } from "@/lib/logger";

export default class ExerciseRepository extends Repository {
  async findOne(id: number, userId: number | null): Promise<ServerResponse<Exercise>> {
    const exercise = await this.client.exercise.findFirst({
      where: { id, OR: [{ fromPlaylist: { visibility: "public" } }, { authorId: userId || 0 }] },
      include: {
        author: { include: { profilePicture: true } },
        defaultConfig: { include: { midifile: true } },
        chordsGrid: {
          include: {
            sections: {
              include: {
                voltas: {
                  include: {
                    measures: {
                      include: {
                        bars: true,
                        cells: { include: { chord: { include: { over: true, alternate: true } } } },
                      },
                    },
                  },
                },
                commonMeasures: {
                  include: {
                    bars: true,
                    cells: { include: { chord: { include: { over: true, alternate: true } } } },
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

    const mapCells = (cells: any[]): CellSchema[] => {
      return cells.map((cell) => {
        const base = {
          index: cell.index,
          keychange: cell.keychange,
          timeSignatureChangeTop: cell.timeSignatureChangeTop,
          timeSignatureChangeBottom: cell.timeSignatureChangeBottom,
          isCodaSymbol: cell.isCodaSymbol,
          isSegnoSymbol: cell.isSegnoSymbol,
          isFermataSymbol: cell.isFermataSymbol,
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
        } as CellSchema;
      });
    };

    const chordsGrid: ChordsGridSchema | null = exercise.chordsGrid
      ? {
          sections: exercise.chordsGrid.sections.map((section) => ({
            index: section.index,
            label: section.label,
            type: section.type as SectionSchema["type"],
            voltas: section.voltas.map((volta) => ({
              index: volta.index,
              measures: volta.measures.map((measure) => ({
                index: measure.index,
                bars: measure.bars,
                cells: mapCells(measure.cells),
              })),
            })),
            commonMeasures: section.commonMeasures.map((measure) => ({
              index: measure.index,
              bars: measure.bars,
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
        midifileUrl: exercise.defaultConfig.midifile?.url,
        chordsGrid: chordsGrid,
      } as Exercise,
    };
  }

  async findManyByFilters(filters: Filters): Promise<ServerResponse<Exercise[]>> {
    const { search, groove, key, bpmMin, bpmMax, sectionTypes, chordNotes } = filters;
    const whereClause: any = {};

    // 1. Recherche textuelle
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { composer: { contains: search, mode: "insensitive" } },
      ];
    }

    // 2. Filtres defaultConfig
    if (groove || key || bpmMin !== undefined || bpmMax !== undefined) {
      whereClause.defaultConfig = {};
      if (groove) whereClause.defaultConfig.groove = groove;
      if (key) whereClause.defaultConfig.key = key;
      if (bpmMin !== undefined || bpmMax !== undefined) {
        whereClause.defaultConfig.bpm = {};
        if (bpmMin !== undefined) whereClause.defaultConfig.bpm.gte = bpmMin;
        if (bpmMax !== undefined) whereClause.defaultConfig.bpm.lte = bpmMax;
      }
    }

    // 3. MULTIPLES SECTIONS : "ET" LOGIQUE
    // On crée un tableau de conditions que l'exercice doit TOUTES remplir
    if (sectionTypes && sectionTypes.length > 0) {
      whereClause.AND = sectionTypes.map((type) => ({
        chordsGrid: {
          sections: {
            some: { type: type },
          },
        },
      }));
    }

    // 4. Filtre par notes d'accords
    if (chordNotes && chordNotes.length > 0) {
      const chordCondition = { chord: { note: { in: chordNotes } } };

      const chordGridCondition = {
        chordsGrid: {
          sections: {
            some: {
              OR: [
                { commonMeasures: { some: { cells: { some: chordCondition } } } },
                { voltas: { some: { measures: { some: { cells: { some: chordCondition } } } } } },
              ],
            },
          },
        },
      };

      // On combine proprement avec le AND des sections si existant
      if (whereClause.AND) {
        whereClause.AND.push(chordGridCondition);
      } else {
        whereClause.AND = [chordGridCondition];
      }
    }

    const exercises = await this.client.exercise.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        composer: true,
        defaultConfig: {
          select: { bpm: true, key: true, groove: true },
        },
      },
      take: 50,
    });

    return { success: true, status: Status.Ok, data: exercises as any[] };
  }

  async create(exercise: ExerciseSchema, playlistId: number, userId: number) {
    await this.client.playlist.update({
      where: { id: playlistId },
      data: {
        createdExercises: {
          create: {
            ...this.exerciseMapper(exercise, userId),
            inPlaylists: {
              create: {
                playlistId: playlistId,
              },
            },
          },
        },
      },
    });
  }

  private exerciseMapper(
    exercise: ExerciseSchema,
    userId: number
  ): Prisma.ExerciseCreateWithoutFromPlaylistInput {
    return {
      author: {
        connect: {
          id: userId,
        },
      },
      composer: exercise.composer,
      title: exercise.title,
      defaultConfig: {
        create: {
          ...exercise.defaultConfig,
          midifile: exercise.midifileUrl
            ? {
                connectOrCreate: {
                  where: {
                    url: exercise.midifileUrl,
                  },
                  create: {
                    url: exercise.midifileUrl,
                  },
                },
              }
            : undefined,
        },
      },
      chordsGrid: exercise.chordsGrid
        ? {
            create: {
              ...this.chordsGridMapper(exercise.chordsGrid),
            },
          }
        : undefined,
    };
  }

  private chordsGridMapper(
    chordsGrid: ChordsGridSchema
  ): Prisma.ChordsGridCreateWithoutExerciseInput {
    return {
      sections: {
        create: chordsGrid.sections.map((section) => ({
          index: section.index,
          label: section.label,
          type: section.type,
          commonMeasures: {
            create: section.commonMeasures.map((measure) => this.measureMapper(measure)),
          },
          voltas: {
            create: section.voltas.map((volta) => this.voltaMapper(volta)),
          },
        })),
      },
    };
  }

  private measureMapper(measure: MeasureSchema): Prisma.MeasureCreateWithoutSectionInput {
    return {
      index: measure.index,
      cells: {
        create: measure.cells.map((cell) => this.cellMapper(cell)),
      },
      bars: {
        create: {
          left: measure.bars.left,
          right: measure.bars.right,
        },
      },
    };
  }

  private voltaMapper(volta: VoltaSchema): Prisma.VoltaBracketCreateWithoutSectionInput {
    return {
      index: volta.index,
      measures: {
        create: volta.measures.map((measure) => this.measureMapper(measure)),
      },
    };
  }

  private cellMapper(cell: CellSchema): Prisma.CellCreateWithoutMeasureInput {
    cell.isFermataSymbol && logger.info("Fermata symbol at", cell.index);
    return {
      kind: cell.kind,
      index: cell.index,
      chord:
        cell.kind === "Chord"
          ? {
              create: {
                ...this.chordMapper(cell.chord),
              },
            }
          : undefined,
      keychange: cell.keychange,
      timeSignatureChangeBottom: cell.timeSignatureChangeBottom,
      timeSignatureChangeTop: cell.timeSignatureChangeTop,
      isCodaSymbol: cell.isCodaSymbol,
      isSegnoSymbol: cell.isSegnoSymbol,
      isFermataSymbol: cell.isFermataSymbol,
    };
  }

  private chordMapper(chord: ChordSchema): Prisma.ChordCreateInput {
    return {
      modifier: chord.content.modifier,
      note: chord.content.note,
      alternate: chord.alt
        ? {
            create: {
              ...this.chordMapper({ content: chord.alt }),
            },
          }
        : undefined,
      over: chord.over
        ? {
            create: { ...this.chordMapper({ content: chord.over }) },
          }
        : undefined,
    };
  }
}
