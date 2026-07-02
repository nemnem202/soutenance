import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logger";
import { IrealChartDecoder, PlaylistIreal } from "@/seed/conversion/chart_decoder";
import { convertPlaylist } from "@/seed/conversion/converter";
import { PlaylistSchema } from "@/types/entities";
import { useState, type ChangeEvent } from "react";
import ReactJson from "react-json-view";
import { ClientOnly } from "vike-react/ClientOnly";

export default function Page() {
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistSchema | null>(null);
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const irealPlaylist = new IrealChartDecoder(e.target.value);
    const converted = convertPlaylist(irealPlaylist);
    setCurrentPlaylist(converted.playlist);
  };
  return (
    <div className="flex flex-col">
      <Input type="text" onChange={handleValueChange} />
      <ClientOnly>
        {currentPlaylist && (
          <ReactJson
            src={currentPlaylist.exercises[0].chordsGrid ?? {}}
            theme={"apathy:inverted"}
            collapsed={true}
          />
        )}
      </ClientOnly>
    </div>
  );
}
