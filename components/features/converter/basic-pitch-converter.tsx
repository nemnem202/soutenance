import { useState, ChangeEvent } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { Label } from "@/components/ui/label";
import convertAudioFileToMidiFile from "@/converters/audio-to-midi";

export default function BasicPitchConverter() {
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const midiFile = await convertAudioFileToMidiFile(file, setProgress);

    const midiArray = midiFile.toArray();

    const blob = new Blob([midiArray as any], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.mid";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ClientOnly>
      <div className="p-3 border rounded-md">
        <Label htmlFor="audio-file-input">Audio File input</Label>
        <input type="file" accept="audio/*" onChange={handleFileChange} id="audio-file-input" />
        <p>Progression : {Math.round(progress)}%</p>
      </div>
    </ClientOnly>
  );
}
