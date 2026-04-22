import type { CellIreal, ChordIreal, SongIreal } from "./chart_decoder";
import { ChordDecoder } from "./chord_decoder";
import { unscramble } from "./utils";

const DEFAULT_BPM = 120;

export class SongInterpreter {
  title: string;
  composer: string;
  style: string;
  key: string;
  transpose: number;
  groove: string;
  bpm: number;
  repeats: number;
  cells: CellIreal[];

  static chordRegex: RegExp = /^([A-G][b#]?)([abdijlmnoqrstu0-9+\-^#]{0,15})?(\/[A-G][b#]?)?/;
  static chordRegex2: RegExp = /^([Wpxr n])(\/[A-G][#b]?)?/;
  static alternativeChordRegex: RegExp = /^\((.+?)\)/;

  static regExps: RegExp[] = [
    /^<.*?>/,
    /^\((?:[A-G]|h).*?\)/,
    /^[[\]{}||Z]/,
    /^\*[a-zA-Z]/,
    /^T\d\d/,
    /^N./,
    /^Y+/,
    SongInterpreter.chordRegex,
    SongInterpreter.chordRegex2,
  ];

  constructor(ireal: string, oldFormat: boolean = false) {
    this.cells = [];

    if (!ireal) {
      this.title = "";
      this.composer = "";
      this.style = "";
      this.key = "";
      this.transpose = 0;
      this.groove = "";
      this.bpm = DEFAULT_BPM;
      this.repeats = 0;
      return;
    }

    const parts = ireal.split("=");
    if (oldFormat) {
      this.title = SongInterpreter.parseTitle(parts[0].trim());
      this.composer = SongInterpreter.parseComposer(parts[1].trim());
      this.style = parts[2].trim();
      this.key = parts[3];
      this.cells = this.parse(parts[5] || "");
      this.transpose = 0;
      this.groove = "default";
      this.bpm = DEFAULT_BPM;
      this.repeats = 3;
    } else {
      this.title = SongInterpreter.parseTitle(parts[0].trim());
      this.composer = SongInterpreter.parseComposer(parts[1].trim());
      this.style = parts[3].trim();
      this.key = parts[4];
      this.transpose = +parts[5] || 0;
      this.groove = parts[7];
      this.bpm = +parts[8] > 0 ? +parts[8] : DEFAULT_BPM;
      this.repeats = +parts[9] || 3;
      const music = parts[6].split("1r34LbKcu7");
      this.cells = this.parse(unscramble(music[1] || ""));
    }
  }

  getSong(): SongIreal {
    return {
      bpm: this.bpm,
      cells: this.cells,
      composer: this.composer,
      groove: this.groove,
      key: this.key,
      repeats: this.repeats,
      style: this.style,
      title: this.title,
      transpose: this.transpose,
    };
  }

  parse(ireal: string): CellIreal[] {
    let text = ireal.trim();
    const arr: (string | RegExpExecArray)[] = [];

    while (text) {
      let found = false;
      for (let i = 0; i < SongInterpreter.regExps.length; i++) {
        const match = SongInterpreter.regExps[i].exec(text);
        if (match) {
          found = true;
          if (match.length <= 2) {
            arr.push(match[0]);
          } else {
            arr.push(match);
          }
          text = text.substring(match[0].length);
          break;
        }
      }
      if (!found) {
        if (text[0] !== ",") {
          arr.push(text[0]);
        }
        text = text.substring(1);
      }
    }

    const cells: CellIreal[] = [];
    let obj = this.newCell(cells);
    let prevobj: CellIreal | null = null;
    for (let i = 0; i < arr.length; i++) {
      let cell: string | RegExpExecArray | null = arr[i];

      if (Array.isArray(cell)) {
        obj.chord = this.parseChord(cell);
        cell = " ";
      }

      const cellStr = cell as string;

      switch (cellStr[0]) {
        case "{":
        case "[":
          if (prevobj) {
            prevobj.bars += ")";
            prevobj = null;
          }
          obj.bars = cellStr;
          cell = null;
          break;
        case "|":
          if (prevobj) {
            prevobj.bars += ")";
            prevobj = null;
          }
          obj.bars = "(";
          cell = null;
          break;
        case "]":
        case "}":
        case "Z":
          if (prevobj) {
            prevobj.bars += cellStr;
            prevobj = null;
          }
          cell = null;
          break;
        case "n":
          obj.chord = new ChordDecoder(cellStr[0]).getChord();
          break;
        case ",":
          cell = null;
          break;
        case "S":
        case "T":
        case "Q":
        case "N":
        case "U":
        case "s":
        case "l":
        case "f":
        case "*":
          obj.annots.push(cellStr);
          cell = null;
          break;
        case "Y":
          obj.spacer++;
          cell = null;
          prevobj = null;
          break;
        case "r":
        case "x":
        case "W":
          obj.chord = new ChordDecoder(cellStr).getChord();
          break;
        case "<":
          obj.comments.push(cellStr.substring(1, cellStr.length - 1));
          cell = null;
          break;
        default:
      }
      if (cell && i < arr.length - 1) {
        prevobj = obj;
        obj = this.newCell(cells);
      }
    }
    return cells;
  }

  static parseTitle(title: string): string {
    return title.replace(/(.*)(, )(A|The)$/g, "$3 $1");
  }

  static parseComposer(composer: string): string {
    const parts = composer.split(/(\s+)/);
    if (parts.length === 3) {
      return parts[2] + parts[1] + parts[0];
    }
    return composer;
  }

  parseChord(chord: RegExpExecArray | string): ChordIreal | null {
    const input = typeof chord === "string" ? chord : chord[0];

    if (input.startsWith("(")) {
      const inside = input.substring(1, input.length - 1);
      const subMatch = SongInterpreter.chordRegex.exec(inside);
      if (subMatch) return this.parseChord(subMatch);
      return null;
    }

    if (input.startsWith("/") && input.length <= 3) {
      const overNote = input.substring(1);
      return new ChordDecoder(" ", "", new ChordDecoder(overNote).getChord());
    }

    const note = chord[1] || " ";
    let modifier = chord[2] || "";
    let overStr = chord[3] || "";

    modifier = modifier.replace(/[XyQLZ]/g, "");

    const stickyBassMatch = modifier.match(/([A-G][b#]?)$/);
    if (stickyBassMatch && !overStr) {
      overStr = stickyBassMatch[1];
      modifier = modifier.substring(0, modifier.length - overStr.length);
    }

    if (overStr.startsWith("/")) {
      overStr = overStr.substring(1);
    }

    if (note === " " && !overStr) {
      return null;
    }

    let overChord: ChordIreal | null = null;
    if (overStr) {
      const offset = overStr.length > 1 && (overStr[1] === "#" || overStr[1] === "b") ? 2 : 1;
      const bassNote = overStr.substring(0, offset);
      const rest = overStr.substring(offset);
      overChord = new ChordDecoder(bassNote, rest).getChord();
    }

    return new ChordDecoder(note, modifier, overChord).getChord();
  }

  newCell(cells: CellIreal[]): CellIreal {
    const obj: CellIreal = {
      annots: [],
      bars: "",
      chord: null,
      comments: [],
      spacer: 0,
      index: cells.length,
    };
    cells.push(obj);
    return obj;
  }
}
