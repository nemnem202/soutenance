import { SidebarSection } from "../app-sidebar";
import { SidebarSlider, SidebarTabButton, SmallCheckboxGroup, SmallInput } from "./game-assets";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Separator } from "../separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";
import { ReactNode, useState } from "react";
import { Button } from "../button";
import SwitchParam from "../switch-param";
import { Label } from "../label";
import UpcomingToolTip from "../upcoming-tooltip";
import { useLanguage } from "@/hooks/use-language";

export default function GameSidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const { instance } = useLanguage();
  return (
    <div
      className={`bg-card h-screen overflow-x-hidden transition-all shrink-0 duration-100 ease-in-out ${sidebarOpen && "border-r"} `}
      style={{ width: sidebarOpen ? "350px" : "0px" }}
    >
      <div className="w-[350px] h-full">
        <div className="w-full h-full flex flex-col">
          <div className="h-20 p-4 flex items-center justify-between w-full">
            <h2 className="headline !text-[2rem]">{instance.getItem("settings")}</h2>
            <PresetSelect />
          </div>
          <div className="w-full p-4 pt-0">
            <TabBar />
          </div>

          <Separator />
          <div className="flex-1 overflow-y-auto">
            <SidebarSection>
              <GeneralSettings />
            </SidebarSection>
            <Separator />
            <SidebarSection>
              <BackingTrackSettings />
            </SidebarSection>
            <Separator />
            <SidebarSection>
              <AppearanceSettings />
            </SidebarSection>
            <Separator />
            <SidebarSection>
              <MidiSettings />
            </SidebarSection>
            <Separator />
            <div className="p-4">
              <Button className="title-2 w-full">{instance.getItem("save_settings")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PresetSelect() {
  const { instance } = useLanguage();
  return (
    <Select defaultValue="default">
      <SelectTrigger className="w-full max-w-40">
        <SelectValue className="text-left" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{instance.getItem("presets")}</SelectLabel>
          <SelectItem value="default">{instance.getItem("default")}</SelectItem>
          <SelectItem value="bossa nova training">Bossa nova training</SelectItem>
          <SelectItem value="blues jam">Blues jam</SelectItem>
          <SelectItem value="orchestra">Orchestra</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function TabBar() {
  const { instance } = useLanguage();
  return (
    <nav className="flex flex-col w-full">
      <SidebarTabButton text={instance.getItem("piano_roll")} isActive={true} />
      <SidebarTabButton text={instance.getItem("chords")} isActive={false} />
      <UpcomingToolTip>
        <SidebarTabButton text={instance.getItem("sheet")} isActive={false} props={{ disabled: true }} />
      </UpcomingToolTip>
      <UpcomingToolTip>
        <SidebarTabButton text={instance.getItem("guitar")} isActive={false} props={{ disabled: true }} />
      </UpcomingToolTip>
    </nav>
  );
}

function ParamsAccordion({ children, title }: { children: ReactNode; title: ReactNode }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="pt-1">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function BackingTrackSettings() {
  const [backingTackActive, setBackingTrackActive] = useState(false);
  const { instance } = useLanguage();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("backing_track")}</h3>}>
      <div className="flex gap-4 w-full">
        <SwitchParam checked={backingTackActive} order="label-switch" setChecked={setBackingTrackActive}>
          <p className="paragraph  text-foreground">{instance.getItem("active")}</p>
        </SwitchParam>
        <SwitchParam checked={true} setChecked={() => {}} disabled={!backingTackActive} order="label-switch">
          <p className="paragraph">{instance.getItem("melody")}</p>
        </SwitchParam>
      </div>
      <div className={`flex flex-col w-full gap-2 py-2 ${!backingTackActive && "text-muted-foreground"}`}>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-15">{instance.getItem("piano")}</p>
        </SidebarSlider>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-15">{instance.getItem("guitar")}</p>
        </SidebarSlider>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-15">{instance.getItem("bass")}</p>
        </SidebarSlider>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-15">{instance.getItem("drums")}</p>
        </SidebarSlider>
        <div className="w-full flex items-center">
          <Label className="paragraph w-15" htmlFor="style-select">
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

function GeneralSettings() {
  const { instance } = useLanguage();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("general")}</h3>}>
      <div className="mb-2">
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph text-foreground">{instance.getItem("count_before_play")}</p>
        </SwitchParam>
      </div>
      <div className={`flex flex-col w-full py-2`}>
        <div className="grid gap-3 grid-cols-3">
          <SmallInput
            label={instance.getItem("transpose")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
          />
          <SmallInput
            label={instance.getItem("practice")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
            tooltip={<p className="paragraph-sm">Increase the global trampose at each loop.</p>}
          />
          <SmallInput
            label={instance.getItem("repeats")}
            type="number"
            defaultValue={3}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">x</p>}
          />
        </div>
        <div className="grid gap-3 grid-cols-3">
          <SmallInput label={instance.getItem("bpm")} type="number" defaultValue={0} containerClassName="w-full" />
          <SmallInput
            label={instance.getItem("bpm_practice")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">+</p>}
            tooltip={<p className="paragraph-sm ">Increase the Bpm at each loop.</p>}
          />
          {/* <div className=" w-full "></div> */}
        </div>
      </div>
    </ParamsAccordion>
  );
}

function AppearanceSettings() {
  const { instance } = useLanguage();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("appearance")}</h3>}>
      <div className="gap-2 flex flex-col">
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-45 text-foreground">{instance.getItem("show_chords")}</p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-45 text-foreground">{instance.getItem("highlight_current_measure")}</p>
        </SwitchParam>
        <p className="pragraph">{instance.getItem("chords_diagrams")}:</p>
        <div className="flex gap-4">
          <SmallCheckboxGroup label={instance.getItem("piano")} labelProps={{ className: "text-muted-foreground" }} />
          <SmallCheckboxGroup label={instance.getItem("guitar")} labelProps={{ className: "text-muted-foreground" }} />
        </div>
      </div>
    </ParamsAccordion>
  );
}

function MidiSettings() {
  const { instance } = useLanguage();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("midi")}</h3>}>
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
          <p className="paragraph w-38 text-foreground">{instance.getItem("highlight_wrong_notes")}</p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-38 text-foreground">{instance.getItem("highlight_correct_notes")}</p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-38 text-foreground">{instance.getItem("highlight_missed_notes")}</p>
        </SwitchParam>
      </div>
    </ParamsAccordion>
  );
}
