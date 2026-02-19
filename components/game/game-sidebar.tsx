import { SidebarSection } from "../app-sidebar";
import { SidebarSlider, SidebarTabButton, SmallCheckboxGroup, SmallInput } from "./game-assets";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Separator } from "../separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";
import { ReactNode, useState } from "react";
import { Switch } from "../switch";
import { Button } from "../button";
import SwitchParam from "../switch-param";
import { Label } from "../label";
import { Input } from "../input";

export default function GameSidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <div
      className={`bg-card  overflow-y-auto overflow-x-hidden transition-all duration-100 ease-in-out ${sidebarOpen && "border-r"} `}
      style={{ width: sidebarOpen ? "350px" : "0px" }}
    >
      <div className="w-[350px]">
        <div className="w-full ">
          <div className="h-20 p-4 flex items-center justify-between w-full">
            <h2 className="headline !text-[2rem]">Settings</h2>
            <PresetSelect />
          </div>
          <SidebarSection>
            <TabBar />
          </SidebarSection>
          <Separator />
          <SidebarSection>
            <BackingTrackSettings />
          </SidebarSection>
          <Separator />
          <SidebarSection>
            <GeneralSettings />
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
            <Button className="title-2 w-full">Save settings</Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto "></div>
      </div>
    </div>
  );
}

function PresetSelect() {
  return (
    <Select defaultValue="default">
      <SelectTrigger className="w-full max-w-40">
        <SelectValue className="text-left" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Presets</SelectLabel>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="bossa nova training">Bossa nova training</SelectItem>
          <SelectItem value="blues jam">Blues jam</SelectItem>
          <SelectItem value="orchestra">Orchestra</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function TabBar() {
  return (
    <nav className="flex flex-col w-full">
      <SidebarTabButton text="Piano roll" isActive={true} />
      <SidebarTabButton text="Sheet" isActive={false} />
      <SidebarTabButton text="Guitar" isActive={false} />
    </nav>
  );
}

function ParamsAccordion({ children, title }: { children: ReactNode; title: ReactNode }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function BackingTrackSettings() {
  const [backingTackActive, setBackingTrackActive] = useState(false);
  return (
    <ParamsAccordion title={<h3 className="title-3">Backing Track</h3>}>
      <div className="flex gap-4 w-full">
        <SwitchParam checked={backingTackActive} order="label-switch" setChecked={setBackingTrackActive}>
          <p className="paragraph w-10 text-foreground">Active</p>
        </SwitchParam>
        <SwitchParam checked={true} setChecked={() => {}} disabled={!backingTackActive} order="label-switch">
          <p className="paragraph w-12">Melody</p>
        </SwitchParam>
      </div>
      <div className={`flex flex-col w-full gap-2 py-2 ${!backingTackActive && "text-muted-foreground"}`}>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-10">Piano</p>
        </SidebarSlider>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-10">Guitar</p>
        </SidebarSlider>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-10">Bass</p>
        </SidebarSlider>
        <SidebarSlider defaultValue={50} disabled={!backingTackActive}>
          <p className="paragraph w-10">Drums</p>
        </SidebarSlider>
        <div className="w-full flex items-center">
          <Label className="paragraph w-10" htmlFor="style-select">
            Style
          </Label>
          <Select defaultValue="custom" disabled={!backingTackActive}>
            <SelectTrigger className="w-full max-w-30" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Styles</SelectLabel>
                <SelectItem value="custom">Custom</SelectItem>
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
  return (
    <ParamsAccordion title={<h3 className="title-3">General</h3>}>
      <div className="mb-2">
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-33 text-foreground">Count before play</p>
        </SwitchParam>
      </div>
      <div className={`flex flex-col w-full py-2`}>
        <div className="flex gap-3">
          <SmallInput
            label="Transpose"
            type="number"
            defaultValue={0}
            icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
          />
          <SmallInput
            label="Practice"
            type="number"
            defaultValue={0}
            icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
          />
          <SmallInput
            label="Repeats"
            type="number"
            defaultValue={3}
            icon={<p className="paragraph-sm text-muted-foreground">x</p>}
          />
        </div>
        <div className="flex gap-3">
          <SmallInput label="Bpm" type="number" defaultValue={0} containerClassName="flex-1" />
          <SmallInput label="Bpm practice" type="number" defaultValue={0} containerClassName="flex-1" />
          <div className="flex-1"></div>
        </div>
      </div>
    </ParamsAccordion>
  );
}

function AppearanceSettings() {
  return (
    <ParamsAccordion title={<h3 className="title-3">Appearance</h3>}>
      <div className="gap-2 flex flex-col">
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-45 text-foreground">Show chords</p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-45 text-foreground">Highlight current measure</p>
        </SwitchParam>
        <p className="pragraph">Chords diagrams:</p>
        <div className="flex gap-4">
          <SmallCheckboxGroup label="Piano" labelProps={{ className: "text-muted-foreground" }} />
          <SmallCheckboxGroup label="Guitar" labelProps={{ className: "text-muted-foreground" }} />
        </div>
      </div>
    </ParamsAccordion>
  );
}

function MidiSettings() {
  return (
    <ParamsAccordion title={<h3 className="title-3">Midi</h3>}>
      <div className="gap-2 flex flex-col pt-1">
        <div className="w-full flex items-center">
          <Label className="paragraph w-25" htmlFor="style-select">
            Midi inputs
          </Label>
          <Select defaultValue="Keysation mk3">
            <SelectTrigger className="w-full max-w-40" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Midi inputs</SelectLabel>
                <SelectItem value="Keysation mk3">Keysation mk3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex items-center">
          <Label className="paragraph w-25" htmlFor="style-select">
            Sound preset
          </Label>
          <Select defaultValue="Piano grand">
            <SelectTrigger className="w-full max-w-40" id="style-select">
              <SelectValue className="text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sounds</SelectLabel>
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
          <p className="paragraph w-38 text-foreground">Highlight wrong notes</p>
        </SwitchParam>
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph w-38 text-foreground">Highlight correct notes</p>
        </SwitchParam>
      </div>
    </ParamsAccordion>
  );
}
