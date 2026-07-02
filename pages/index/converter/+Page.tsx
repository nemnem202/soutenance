import BasicPitchConverter from "@/components/features/converter/basic-pitch-converter";
import IrealLinkConverter from "@/components/features/converter/ireal-link-converter";

export default function Page() {
  return (
    <div className="flex flex-col">
      <BasicPitchConverter />
      <IrealLinkConverter />
    </div>
  );
}
