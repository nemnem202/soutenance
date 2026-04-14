import type {
  CellSchema,
  ChordSchema,
  ChordsGridSchema,
  ExerciseSchema,
  MeasureSchema,
  VoltaSchema,
} from "@/types/entities";
import { Repository } from "./repository";
import type { Prisma } from "@/lib/generated/prisma/client";
import { ServerResponse, Status } from "@/types/server-response";
import { SoloExerciseCardDto } from "@/types/dtos/exercise";
import type { Exercise } from "@/lib/generated/prisma/client";

export default class ExerciseRepository extends Repository {
  async create(exercise: ExerciseSchema, playlistId: number, userId: number) {
    await this.client.playlist.update({
      where: { id: playlistId },
      data: {
        exercises: {
          create: {
            ...this.exerciseMapper(exercise, userId),
          },
        },
      },
    });
  }

  private exerciseMapper(
    exercise: ExerciseSchema,
    userId: number
  ): Prisma.ExerciseCreateWithoutPlaylistInput {
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
        },
      },
      chordsGrid: {
        create: {
          ...this.chordsGridMapper(exercise.chordsGrid),
        },
      },
      midifile: exercise.midifileUrl
        ? {
            create: {
              url: exercise.midifileUrl,
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
    };
  }

  private voltaMapper(volta: VoltaSchema): Prisma.VoltaBracketCreateWithoutSectionInput {
    return {
      volta: volta.volta,
    };
  }

  private cellMapper(cell: CellSchema): Prisma.CellCreateWithoutMeasureInput {
    return {
      kind: cell.kind,
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

  async getFromSearch(
    query: string,
    start: number | undefined = 0,
    length: number | undefined = 20
  ): Promise<ServerResponse<SoloExerciseCardDto[]>> {
    const exercises = await this.client.$queryRaw<Exercise[]>`
        SELECT e.*, 
          similarity(e.title, ${query}) AS score,
          (SELECT COUNT(*) FROM "UserLikesExercise" WHERE "exerciseId" = e.id) AS popularity
        FROM "Exercise" e
        JOIN "User" a ON e."authorId" = a.id
        JOIN "Playlist" p ON e."playlistId" = p.id
        WHERE p.visibility = 'public'
          AND (e.title % ${query} OR e.composer % ${query} OR a.username % ${query})
        ORDER BY score DESC, popularity DESC
        LIMIT ${length} OFFSET ${start};
          `;

    const ids = exercises.map((p) => p.id);

    const sliced = await this.client.exercise.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
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
        midifile: true,
        chordsGrid: true,
        playlist: {
          select: {
            cover: {
              select: {
                alt: true,
                url: true,
              },
            },
          },
        },
        defaultConfig: {
          select: {
            bpm: true,
          },
        },
        title: true,
        _count: {
          select: {
            likedByUsers: true,
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: sliced.map((exercise) => ({
        id: exercise.id,
        inUserPlaylists: [],
        likedByCurrentUser: false,
        midifileUrl: !!exercise.midifile,
        likes: exercise._count.likedByUsers,
        title: exercise.title,
        author: exercise.author,
        chordsGrid: !!exercise.chordsGrid,
        cover: exercise.playlist.cover,
        defaultConfig: exercise.defaultConfig,
      })),
    };
  }
}
