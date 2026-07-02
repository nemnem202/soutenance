import { useState, ChangeEvent } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import {
  BasicPitch,
  noteFramesToTime,
  outputToNotesPoly,
  addPitchBendsToNoteEvents,
} from "@spotify/basic-pitch";

export default function BasicPitchConverter() {
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    // Créer un contexte audio
    const audioContext = new AudioContext({ sampleRate: 22050 });

    // 1. Décodage en audioBuffer
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 2. FORCER LE MONO :
    // Si le fichier est stéréo, on extrait le canal gauche (ou on mixe les deux)
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
      (p) => setProgress(p * 100)
    );

    const notes = noteFramesToTime(
      addPitchBendsToNoteEvents(contours, outputToNotesPoly(frames, onsets, 0.25, 0.25, 5))
    );

    console.log("Notes générées :", notes);
  };

  return (
    <ClientOnly>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <p>Progression : {Math.round(progress)}%</p>
    </ClientOnly>
  );
}
