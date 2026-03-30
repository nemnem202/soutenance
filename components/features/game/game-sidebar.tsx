import { SidebarSection } from "../layout/app-sidebar";
import { SidebarTabButton } from "./game-assets";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/organisms/select";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import useScreen from "@/hooks/use-screen";
import { X } from "lucide-react";
import GeneralSettings from "./settings/general-settings";
import BackingTrackSettings from "./settings/backing-track-settings";
import AppearanceSettings from "./settings/appearance-settings";
import MidiSettings from "./settings/midi-settings";

export default function GameSidebar({
  sidebarOpen,
  setOpen,
}: {
  sidebarOpen: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { instance } = useLanguage();
  const size = useScreen();
  return (
    <div
      className={`fixed z-51 md:static w-screen bg-card h-screen overflow-x-hidden transition-all shrink-0 duration-100 ease-in-out ${sidebarOpen && "border-r"} `}
      style={{ width: sidebarOpen ? (size === "sm" ? "100vw" : "350px") : "0px" }}
    >
      <div className="w-full h-full">
        <div className="w-fullflex flex-col">
          <div className="h-20 p-4 flex items-center justify-between w-full md:flex-wrap gap-2">
            <h2 className="headline !text-[2rem] hidden md:block">{instance.getItem("settings")}</h2>
            <PresetSelect />

            <div className="md:hidden">
              <button onClick={() => setOpen(false)} className="cursor-pointer">
                <X />
              </button>
            </div>
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
              <Button className="title-2 md:w-full">{instance.getItem("save_settings")}</Button>
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
      <SelectTrigger className="w-full max-w-35">
        <SelectValue className="text-left" />
      </SelectTrigger>
      <SelectContent className="z-52">
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
    <nav className="flex flex-wrap md:flex-col  w-full">
      <SidebarTabButton text={instance.getItem("piano_roll")} isActive={true} />
      <SidebarTabButton text={instance.getItem("chords")} isActive={false} />
      <SidebarTabButton text={instance.getItem("sheet")} isActive={false} props={{ disabled: true }} />
      <SidebarTabButton text={instance.getItem("guitar")} isActive={false} props={{ disabled: true }} />
    </nav>
  );
}

export function ParamsAccordion({ children, title }: { children: ReactNode; title: ReactNode }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent className="pt-1">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
