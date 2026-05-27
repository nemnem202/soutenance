import { useState } from "react";
import SwitchParam from "@/components/molecules/switch-param";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/organisms/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/use-language";
import { SidebarSlider } from "../game-assets";
import { ParamsAccordion } from "../game-sidebar";
import useGame from "@/hooks/use-game";
import SoundEngine from "@/midi-editor/engines/sound/sound-engine";
import { Action } from "@/midi-editor/types/actions";
import { MidiInstrumentNumber } from "@/midi-editor/types/instruments";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";

export default function BackingTrackSettings() {
  const [backingTackActive, setBackingTrackActive] = useState(false);
  const { instance } = useLanguage();
  const { state, dispatch } = useMidiStore();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("backing_track")}</h3>}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4 w-full">
          <SwitchParam
            checked={backingTackActive}
            order="label-switch"
            setChecked={setBackingTrackActive}
          >
            <p className="paragraph  text-foreground">{instance.getItem("active")}</p>
          </SwitchParam>
          <SwitchParam
            checked={true}
            setChecked={() => {}}
            disabled={!backingTackActive}
            order="label-switch"
          >
            <p className="paragraph">{instance.getItem("melody")}</p>
          </SwitchParam>
        </div>
        <div
          className={`flex flex-col w-full gap-2 py-2 ${!backingTackActive && "text-muted-foreground"}`}
        >
          {state?.tracks.map((track) => (
            <>
              <SidebarSlider
                defaultValue={[100]}
                disabled={!backingTackActive}
                onValueChange={(value) =>
                  dispatch({
                    type: Action.CHANGE_TRACK_VOLUME,
                    volume: value[0],
                    trackId: track.id,
                  })
                }
              >
                <p className="paragraph ">
                  {MidiInstrumentNumber[track.id].split(/(?=[A-Z])/).join(" ")}
                </p>
              </SidebarSlider>
            </>
          ))}
        </div>
        <div className="w-full flex items-center">
          <Label className="paragraph " htmlFor="style-select">
            {instance.getItem("style")}
          </Label>
          <Select defaultValue="original" disabled={!backingTackActive}>
            <SelectTrigger className="w-full max-w-30" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{instance.getItem("styles")}</SelectLabel>
                <SelectItem value="original">{instance.getItem("original")}</SelectItem>
                <SelectItem value="swing">Bossa nova</SelectItem>
                <SelectItem value="blues">Blues</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ParamsAccordion>
  );
}
