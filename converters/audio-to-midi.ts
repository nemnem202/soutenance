import type { Midi } from "@tonejs/midi";
import { Dispatch, SetStateAction } from "react";
import { getMidiFileFromBuffer } from "./midi-to-state";

export default async function convertAudioFileToMidiFile(
  file: File,
  setProgress?: Dispatch<SetStateAction<number>>
): Promise<Midi> {
  return await useYourMt3(file);
  // return await useBasicPitch(file);
}

async function useBasicPitch(
  file: File,
  setProgress?: Dispatch<SetStateAction<number>>
): Promise<Midi> {
  const { BasicPitch, outputToNotesPoly, addPitchBendsToNoteEvents, noteFramesToTime } =
    await import("@spotify/basic-pitch");
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
    addPitchBendsToNoteEvents(
      contours,
      outputToNotesPoly(
        frames,
        onsets,
        0.5, // onsetThresh — évite les ré-attaques parasites sur une note tenue
        0.4, // frameThresh — moins sensible aux micro-fluctuations d'énergie
        5, // minNoteLen — élimine les fragments de note trop courts (~127ms)
        true, // inferOnsets — utile pour les attaques peu marquées (guitare douce)
        undefined,
        undefined,
        true, // melodiaTrick — récupère les notes fusionnées dans les harmoniques
        15 // energyTolerance — plus haut = tolère les creux sans couper la note
      )
    )
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

async function useYourMt3(file: File): Promise<Midi> {
  const { Client } = await import("@gradio/client");

  const client = await Client.connect("mimbres/YourMT3");

  const result = await client.predict("/process_audio", {
    audio_filepath: file,
  });
  // @ts-expect-error
  const html = result.data[0] as string;

  // Le MIDI est planqué en base64 dans un data URL, ex: data:audio/midi;base64,TVRoZ...
  const match = html.match(/data:audio\/midi;base64,([A-Za-z0-9+/=]+)/);

  if (!match) {
    throw new Error("Impossible de trouver le MIDI dans la réponse HTML");
  }

  const base64Data = match[1];

  // Décodage base64 -> bytes -> Blob
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return await getMidiFileFromBuffer(bytes);
}
