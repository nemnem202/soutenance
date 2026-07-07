import { FileUploadSection } from "@/components/organisms/file-upload-section";

export default function NewGameFileUpload() {
  return (
    <FileUploadSection
      multiple={false}
      accept="audio/*, .mid, .midi, .xml, .mxl, .musicxml, .abc, .krn, .mei, "
      title="Upload a midi, music or audio file"
    />
  );
}
