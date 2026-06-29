import { useEffect, useMemo, useState } from "react";
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
import { Action } from "@/midi-editor/types/actions";
import { MidiInstrumentNumber } from "@/midi-editor/types/instruments";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { MMA_GROOVES } from "@/config/grooves_dictionnary";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import useGame from "@/hooks/use-game";
import { MMAGrooveTitle } from "@/lib/generated/prisma/enums";
import onMidiFile from "@/telefunc/midifile.telefunc";
import { Midi } from "@tonejs/midi";
import { logger } from "@/lib/logger";
import { errorToast } from "@/lib/toaster";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/midi-editor/lib/midiconverter";

export default function BackingTrackSettings() {
  const { instance } = useLanguage();
  const { state, dispatch } = useMidiStore();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("backing_track")}</h3>}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-4 w-full"></div>
        <div className={`flex flex-col w-full gap-2 py-2`}>
          {state?.tracks.map((track) => (
            <>
              <SidebarSlider
                defaultValue={[100]}
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
        <div className="w-full flex items-center gap-2">
          <Label className="paragraph " htmlFor="style-select">
            {instance.getItem("style")}
          </Label>
          <StyleSelectCombobox />
          {/* <Select defaultValue="original">
            <SelectTrigger className="w-full max-w-30" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{instance.getItem("styles")}</SelectLabel>
                <SelectItem value="original">
                  {instance.getItem("original")} {`(${state?.config.groove})`}
                </SelectItem>
                {Array.from(MMA_GROOVES.entries()).map(([title]) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
      </div>
    </ParamsAccordion>
  );
}

export function StyleSelectCombobox() {
  const { instance } = useLanguage();
  const { state, dispatch } = useMidiStore();
  const [open, setOpen] = useState(false);
  const { exercise, setMidiLoading } = useGame();
  const [value, setValue] = useState<MMAGrooveTitle>(exercise.defaultConfig.groove);

  const options = useMemo<{ value: MMAGrooveTitle; label: string }[]>(() => {
    const originalLabel = `${instance.getItem("original")} (${exercise.defaultConfig.groove})`;
    const grooveOptions = Array.from(MMA_GROOVES.entries())
      .filter(([title]) => title !== exercise.defaultConfig.groove)
      .map(([title]) => ({
        value: title,
        label: title,
      }));

    return [{ value: exercise.defaultConfig.groove, label: originalLabel }, ...grooveOptions];
  }, [instance, state, MMA_GROOVES]);

  const selectedOption = options.find((opt) => opt.value === value);

  const updateGroove = async () => {
    setMidiLoading(true);
    if (value === exercise.defaultConfig.groove) return setMidiLoading(false);

    const file = await onMidiFile(exercise.id, value);

    if (file.success) {
      const midi = await getMidiFileFromBuffer(file.data);
      const newState = await convertMidiFileToState(midi, exercise, state ?? undefined, value);
      useMidiStore.setState({ state: newState });
      dispatch({ type: Action.RESET_STATE });
    } else {
      errorToast(file.title, file.description);
    }
    setMidiLoading(false);
  };

  useEffect(() => {
    updateGroove();
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-50 justify-between text-left font-normal"
          id="style-select"
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : instance.getItem("styles")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 z-100" align="start">
        <Command>
          <CommandInput placeholder={`${instance.getItem("styles")}...`} />

          <CommandList className="max-h-[250px] overflow-y-auto">
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue as MMAGrooveTitle);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
