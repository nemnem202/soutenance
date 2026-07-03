import { Label } from "@/components/ui/label";
import convertMidiFileToChordGrid from "@/converters/midi-to-chord-grid";
import { ChangeEvent } from "react";

export default function MidiFileToChordGridConverter() {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    convertMidiFileToChordGrid(file);
  };

  return (
    <div className="p-3 border rounded-md">
      <Label htmlFor="midi-file-input">Midi File input</Label>
      <input
        type="file"
        accept=".mid,.midi,audio/midi,application/x-midi"
        onChange={handleFileChange}
        id="midi-file-input"
      />
    </div>
  );
}
