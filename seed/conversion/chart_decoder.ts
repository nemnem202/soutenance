import diff from "fast-diff";
import { SongInterpreter } from "./song_decoder.";

export type PlaylistIreal = {
  title: string;
  songs: SongIreal[];
};

export type SongIreal = {
  title: string;
  composer: string;
  style: string;
  key: string;
  transpose: number;
  groove: string;
  bpm: number;
  repeats: number;
  cells: CellIreal[];
};

export type CellIreal = {
  index: number;
  annots: string[];
  comments: string[];
  bars: string;
  spacer: number;
  chord: ChordIreal | null;
};

export type ChordIreal = {
  note: string;
  modifier: string;
  over: ChordIreal | null;
  alternate: ChordIreal | null;
};

const _DEFAULT_BPM = 120;

type Diff = [-1 | 0 | 1, string];

export class IrealChartDecoder {
  static readonly default_title = "My new playlist";
  title: string = IrealChartDecoder.default_title;
  songs: SongIreal[];

  constructor(ireal: string) {
    const playlistEncoded = /.*?(irealb(?:ook)?):\/\/([^"]*)/.exec(ireal);
    this.songs = [];
    if (!playlistEncoded) {
      throw new Error("[ireal-musicxml] Invalid iReal Pro URL format");
    }
    const playlist = decodeURIComponent(playlistEncoded[2]);
    const parts = playlist.split("===");
    if (parts.length > 1) {
      const lastPart = parts.at(-1);
      if (typeof lastPart === "string") {
        this.title = parts.pop() || IrealChartDecoder.default_title;
      }
    }

    this.songs = parts
      .map((part): SongIreal | null => {
        try {
          return new SongInterpreter(part, playlistEncoded[1] === "irealbook").getSong();
        } catch (error) {
          const errorParts = part.split("=");
          const title = SongInterpreter.parseTitle(errorParts[0].trim());
          throw new Error(`[ireal-musicxml] [${title}] ${error}`);
        }
      })
      .filter((song): song is SongIreal => song !== null)
      .reduce((songs: SongIreal[], song: SongIreal): SongIreal[] => {
        if (songs.length > 0) {
          const lastSong = songs[songs.length - 1];
          const diffs: Diff[] = diff(lastSong.title, song.title);
          if (
            diffs.length > 0 &&
            diffs[0][0] === 0 &&
            diffs.every((d) => d[0] === 0 || /^\d+$/.test(d[1]))
          ) {
            lastSong.cells = lastSong.cells.concat(song.cells);
            return songs;
          }
        }
        songs.push(song);
        return songs;
      }, []);

    if (this.title === IrealChartDecoder.default_title && this.songs.length === 1) {
      this.title = this.songs[0].title;
    }
  }
}
