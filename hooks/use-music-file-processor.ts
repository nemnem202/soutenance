import convertAudioFileToMidiFile from "@/converters/audio-to-midi";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { Dispatch, SetStateAction } from "react";

const MIDI_MIME_TYPES = ["audio/midi", "audio/mid", "audio/sp-midi", "audio/x-midi"];

export const getFileFromEntry = (entry: FileWithPreview): File | null => {
  const file = "file" in entry ? entry.file : entry;
  return file instanceof File ? file : null;
};

export const isMidi = (file: File) =>
  MIDI_MIME_TYPES.includes(file.type) || file.name.endsWith(".mid");

export const processAudioToMidi = async (
  file: File,
  setProgress: Dispatch<SetStateAction<number>>
) => {
  const midiFile = await convertAudioFileToMidiFile(file, setProgress);
  const midiBytes = midiFile.toArray();
  const arrayBuffer = midiBytes.buffer.slice(
    midiBytes.byteOffset,
    midiBytes.byteOffset + midiBytes.byteLength
  ) as ArrayBuffer;

  return new File([arrayBuffer], file.name.replace(/\.[^/.]+$/, ".mid"), { type: "audio/midi" });
};
