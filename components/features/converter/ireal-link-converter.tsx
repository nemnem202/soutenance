import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logger";
import { IrealChartDecoder } from "@/converters/ireal-to-exercise/chart_decoder";
import { convertPlaylist } from "@/converters/ireal-to-exercise/converter";
import { PlaylistSchema } from "@/types/entities";
import { useState, type ChangeEvent } from "react";
import ReactJson from "react-json-view";
import { ClientOnly } from "vike-react/ClientOnly";

export default function IrealLinkConverter() {
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistSchema | null>(null);
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const irealPlaylist = new IrealChartDecoder(e.target.value);
    const converted = convertPlaylist(irealPlaylist);
    setCurrentPlaylist(converted.playlist);
  };
  return (
    <ClientOnly>
      <div className="flex flex-col gap-2">
        <h2 className="title-2">Convert Ireal link to ExerciseSchema</h2>
        <Input type="text" onChange={handleValueChange} />
        {currentPlaylist && (
          <ReactJson
            src={currentPlaylist.exercises[0].chordsGrid ?? {}}
            theme={"apathy"}
            collapsed={true}
          />
        )}
      </div>
    </ClientOnly>
  );
}
