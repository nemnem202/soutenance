import {
  BasicPitch,
  outputToNotesPoly,
  addPitchBendsToNoteEvents,
  noteFramesToTime,
} from "@spotify/basic-pitch";
import type { Midi } from "@tonejs/midi";
import { Dispatch, SetStateAction } from "react";

export default async function convertAudioFileToMidiFile(
  file: File,
  setProgress?: Dispatch<SetStateAction<number>>
): Promise<Midi> {
  const audioContext = new AudioContext({ sampleRate: 22050 });

  const arrayBuffer = await file.arrayBuffer();
  // 1. Décodage en audioBuffer
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  let monoBuffer: AudioBuffer;
  if (audioBuffer.numberOfChannels > 1) {
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.length, 22050);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    monoBuffer = await offlineCtx.startRendering();
  } else {
    monoBuffer = audioBuffer;
  }
  const basicPitch = new BasicPitch("/model/model.json");

  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];

  await basicPitch.evaluateModel(
    monoBuffer,
    (f, o, c) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
    (p) => setProgress?.(p * 100)
  );

  const notes = noteFramesToTime(
    addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.25, 0.25, 5))
  );

  console.log("Notes générées :", notes);

  const { Midi } = await import("@tonejs/midi");

  const midiFile = new Midi();

  const track = midiFile.addTrack();

  notes.forEach((note) => {
    track.addNote({
      midi: note.pitchMidi,
      time: note.startTimeSeconds,
      duration: note.durationSeconds,
      velocity: note.amplitude,
    });
  });

  return midiFile;
}
