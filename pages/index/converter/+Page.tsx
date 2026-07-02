import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logger";
import { IrealChartDecoder } from "@/seed/conversion/chart_decoder";
import { convertPlaylist } from "@/seed/conversion/converter";
import type { ChangeEvent } from "react";

export default function Page() {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const irealPlaylist = new IrealChartDecoder(e.target.value);
    const converted = convertPlaylist(irealPlaylist);
    logger.info("Playlist: ", converted);
  };
  return <Input type="text" onChange={handleValueChange} />;
}
