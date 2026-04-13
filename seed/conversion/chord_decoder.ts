import type { ChordIreal } from "./chart_decoder";

export class ChordDecoder {
  note: string;
  modifier: string;
  over: ChordIreal | null;
  alternate: ChordIreal | null;

  constructor(
    note: string,
    modifier: string = "",
    over: ChordIreal | null = null,
    alternate: ChordIreal | null = null
  ) {
    this.note = note;
    this.modifier = modifier;
    this.over = over;
    this.alternate = alternate;
  }

  getChord(): ChordIreal {
    return {
      alternate: this.alternate,
      modifier: this.modifier,
      over: this.over,
      note: this.note,
    };
  }
}
