import SwitchParam from "@/components/molecules/switch-param";
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
import { useMemo, useState } from "react";
import {
  getFamilyFromInstrumentNumber,
  MidiInstrumentFamily,
  MidiInstrumentNumber,
} from "@/midi-editor/types/instruments";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
          <InstrumentSelect />
        </div>
      </div>
    </ParamsAccordion>
  );
}

export function InstrumentSelect() {
  const [open, setOpen] = useState(false);
  const { outputInstrument, setOutputInstrument, midiEnabled } = useMidi();
  const instrumentOptions = useMemo(() => {
    const instruments = Object.entries(MidiInstrumentNumber)
      .filter(([_, value]) => typeof value === "number")
      .map(([name, value]) => ({
        name: name.replace(/([A-Z])/g, " $1").trim(), // Formatage CamelCase -> Espace
        value: value as number,
        family: getFamilyFromInstrumentNumber(value as number),
      }));

    // Regroupement par famille
    return Object.values(MidiInstrumentFamily).map((family) => ({
      family,
      items: instruments.filter((i) => i.family === family),
    }));
  }, []);

  const selectedInstrumentName = useMemo(() => {
    if (outputInstrument === null) return "Choisir un instrument...";
    const entry = Object.entries(MidiInstrumentNumber).find(
      ([_, value]) => value === outputInstrument
    );

    return entry ? entry[0].replace(/([A-Z])/g, " $1").trim() : "Instrument inconnu";
  }, [outputInstrument]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={!midiEnabled}
        >
          {selectedInstrumentName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un instrument..." />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>Aucun instrument trouvé.</CommandEmpty>
            {instrumentOptions.map((group) => (
              <CommandGroup key={group.family} heading={group.family.toUpperCase()}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.name}
                    onSelect={() => {
                      setOutputInstrument(item.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        outputInstrument === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
