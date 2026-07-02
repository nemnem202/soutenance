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

import { ParamsAccordion } from "../game-sidebar";
import { useMidi } from "@/providers/midi-provider";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { Button } from "@/components/ui/button";
import PLAYABLE_INSTRUMENTS from "@/config/playable-instruments";

export default function MidiSettings() {
  const { instance } = useLanguage();
  const {
    midiInputs,
    updateMidiInputs,
    outputInstrument,
    setOutputInstrument,
    midiEnabled,
    setMidiEnabled,
  } = useMidi();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("midi")}</h3>}>
      <div className="gap-2 flex flex-col">
        <SwitchParam checked={midiEnabled} order="label-switch" setChecked={setMidiEnabled}>
          <p className="paragraph w-38 text-foreground">{instance.getItem("enabled")}</p>
        </SwitchParam>
        <div className="w-full flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!midiEnabled}>
              <Button variant={"outline"}> {instance.getItem("midi_inputs")}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {midiInputs.length > 0 ? (
                midiInputs.map((input) => (
                  <DropdownMenuCheckboxItem
                    checked={input.enabled}
                    onCheckedChange={(v) =>
                      updateMidiInputs([
                        ...midiInputs.map((i) => {
                          if (i.id === input.id) input.enabled = v;
                          return i;
                        }),
                      ])
                    }
                  >
                    {input.title}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <DropdownMenuItem>{instance.getItem("no_midi_inputs")}</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full flex items-center">
          <Label className="paragraph w-25" htmlFor="style-select">
            {instance.getItem("sound_preset")}
          </Label>
          <Select
            defaultValue="Piano grand"
            disabled={!midiEnabled}
            onValueChange={(v) => {
              setOutputInstrument(parseInt(v));
            }}
          >
            <SelectTrigger
              className="w-full max-w-40"
              id="style-select"
              defaultValue={outputInstrument ? outputInstrument.toString() : undefined}
            >
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{instance.getItem("sounds")}</SelectLabel>
                {PLAYABLE_INSTRUMENTS.map(([name, value]) => (
                  <SelectItem value={value.toString()}>{name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ParamsAccordion>
  );
}
