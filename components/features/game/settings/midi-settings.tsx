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

export default function MidiSettings() {
  const { instance } = useLanguage();
  return (
    <ParamsAccordion
      title={<h3 className="title-3">{instance.getItem("midi")}</h3>}
    >
      <div className="gap-2 flex flex-col">
        <div className="w-full flex items-center">
          <Label className="paragraph w-25" htmlFor="style-select">
            {instance.getItem("midi_inputs")}
          </Label>
          <Select defaultValue="Keysation mk3">
            <SelectTrigger className="w-full max-w-40" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{instance.getItem("midi_inputs")}</SelectLabel>
                <SelectItem value="Keysation mk3">Keysation mk3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex items-center">
          <Label className="paragraph w-25" htmlFor="style-select">
            {instance.getItem("sound_preset")}
          </Label>
          <Select defaultValue="Piano grand">
            <SelectTrigger className="w-full max-w-40" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{instance.getItem("sounds")}</SelectLabel>
                <SelectItem value="Piano grand">Piano grand</SelectItem>
                <SelectItem value="Piano electric">Piano electric</SelectItem>
                <SelectItem value="Synth pad">Synth pad</SelectItem>
                <SelectItem value="Strings">Strings</SelectItem>
                <SelectItem value="Vibraphone">Vibraphone</SelectItem>
                <SelectItem value="Organ">Organ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-38 text-foreground">
            {instance.getItem("highlight_wrong_notes")}
          </p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-38 text-foreground">
            {instance.getItem("highlight_correct_notes")}
          </p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-38 text-foreground">
            {instance.getItem("highlight_missed_notes")}
          </p>
        </SwitchParam>
      </div>
    </ParamsAccordion>
  );
}
