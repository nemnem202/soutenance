import { State } from "@/midi-editor/types/instance";

const EMPTY_STATE: State = {
  config: {
    groove: "BossaNova",
    bpm: 120,
    bpmPractice: 0,
    countIn: false,
    currentMeasureOverline: false,
    displayGuitarDiagrams: false,
    displayPianoDiagrams: false,
    loop: null,
    ppq: 0,
    repeats: 0,
    signature: [0, 0],
    subdivision: [0, 0],
    transposition: 0,
    transpositionPractice: 0,
    userInputChannel: 0,
  },
  currentTrackId: 0,
  display: {
    zoomY: 0,
  },
  measuresStarts: new Map(),
  queuedActions: new Set(),
  rawMidiBuffer: new Uint8Array(),
  tracks: [],
  transport: {
    currentMeasureIndex: 0,
    playbackPosition: 0,
    start: 0,
    status: "paused",
    totalDuration: 0,
  },
};

export default EMPTY_STATE;
