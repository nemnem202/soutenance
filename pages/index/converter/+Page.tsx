import BasicPitchConverter from "@/components/features/converter/basic-pitch-converter";
import IrealLinkConverter from "@/components/features/converter/ireal-link-converter";
import MidiFileToChordGridConverter from "@/components/features/converter/midi-file-to-chord-grid";
import MusicFileConverter from "@/components/features/converter/music-file-converter";

export default function Page() {
  return (
    <div className="flex flex-col gap-3">
      <MidiFileToChordGridConverter />
      <MusicFileConverter />
      <BasicPitchConverter />
      <IrealLinkConverter />
    </div>
  );
}
