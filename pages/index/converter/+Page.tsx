import BasicPitchConverter from "@/components/features/converter/basic-pitch-converter";
import IrealLinkConverter from "@/components/features/converter/ireal-link-converter";
import MusicFileConverter from "@/components/features/converter/music-file-converter";

export default function Page() {
  return (
    <div className="flex flex-col">
      <MusicFileConverter />
      <BasicPitchConverter />
      <IrealLinkConverter />
    </div>
  );
}
