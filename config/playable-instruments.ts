import { MidiInstrumentNumber } from "@/midi-editor/types/instruments";

const PLAYABLE_INSTRUMENTS: [string, MidiInstrumentNumber][] = [
  ["Piano Bright", MidiInstrumentNumber.BrightAcousticPiano],
  ["Electric Piano", MidiInstrumentNumber.ElectricPiano1],
  ["Organ", MidiInstrumentNumber.RockOrgan],
];

export default PLAYABLE_INSTRUMENTS;
