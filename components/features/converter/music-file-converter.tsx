import { ChangeEvent } from "react";
import onMusicFile from "@/telefunc/music-file.telefunc";
import { logger } from "@/lib/logger";
import { Label } from "@/components/ui/label";

export default function MusicFileConverter() {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const response = await onMusicFile(file);

    logger.info("Response", response);
  };

  return (
    <>
      <Label htmlFor="music-file-input">Music File input</Label>
      <input type="file" onChange={handleFileChange} id="music-file-input" />
    </>
  );
}
