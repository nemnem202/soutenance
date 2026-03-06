import AnimatedTabs from "@/components/animated-tabs";
import { Button } from "@/components/button";
import { Field, FieldLabel } from "@/components/field";
import Header from "@/components/game-header";
import { ControlsSection, IconButton } from "@/components/game/game-assets";
import GameSidebar from "@/components/game/game-sidebar";
import { Input } from "@/components/input";
import { Separator } from "@/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import UpcomingToolTip from "@/components/upcoming-tooltip";
import { TabsContent } from "@radix-ui/react-tabs";
import { Maximize, Minimize, Play, Settings, Square } from "lucide-react";
import { ReactNode, useState } from "react";

export default function Page() {
  const [sidebarOpen, setOpen] = useState(false);
  return (
    <div className="flex col w-screen h-screen">
      <GameSidebar sidebarOpen={sidebarOpen} />
      <div className="flex-1 h-screen flex flex-col" onClickCapture={() => setOpen(false)}>
        <Header />
        <Game openSidebar={() => setOpen((prev) => !prev)} />
      </div>
    </div>
  );
}

interface Gameprops {
  openSidebar: () => void;
}

const tabs = [
  { id: "piano-roll", label: "piano-roll" },
  { id: "chords", label: "chords" },
  { id: "sheet", label: "sheet", disabled: true },
  { id: "guitar", label: "guitar", disabled: true },
];

function Game({ ...props }: Gameprops) {
  const [activeTab, setActiveTab] = useState("piano-roll");
  return (
    <main className="flex-1 flex flex-col items-center pt-5">
      <h1 className="headline select-none">Brown Sugar</h1>
      <div className=" size-full px-20 py-5  flex flex-col gap-2">
        <div className="flex-1 flex flex-col">
          <div className="w-full flex justify-center">
            <AnimatedTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} variant="pill" className="my-2" />
          </div>
          <div className=" flex-1">
            <Tab>
              <></>
            </Tab>
          </div>
        </div>
        <ControlsSection>
          <IconButton onClick={props.openSidebar}>
            <Settings className="hover:stroke-primary  transition" />
          </IconButton>
          <IconButton>
            <Play className="hover:stroke-primary hover:fill-primary fill-foreground transition" />
          </IconButton>
          <IconButton>
            <Square className="hover:stroke-primary hover:fill-primary fill-foreground transition" />
          </IconButton>
          <Separator orientation="vertical" className="!h-6" />
          <Field className="flex flex-row items-center justify-center !w-min">
            <Input id="bpm" type="number" defaultValue={"120"} className="!w-15 min-w-0 p-0 text-center" />
            <FieldLabel htmlFor="bpm" className="!w-min text-muted-foreground paragraph-small">
              bpm
            </FieldLabel>
          </Field>
        </ControlsSection>
      </div>
    </main>
  );
}

function FullScreenButton({
  hover,
  fullScreen,
  setFullScreen,
}: {
  hover: boolean;
  fullScreen: boolean;
  setFullScreen: (full: boolean) => void;
}) {
  return (
    <div className={`absolute m-2 top-0 right-0 transition ${hover ? "opacity-100" : "opacity-0"}`}>
      <Button variant={"ghost"} onClick={() => setFullScreen(!fullScreen)}>
        {fullScreen ? (
          <Minimize className=" stroke-muted-foreground !hover:stroke-foreground" />
        ) : (
          <Maximize className=" stroke-muted-foreground !hover:stroke-foreground" />
        )}
      </Button>
    </div>
  );
}

function Tab({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  if (!fullScreen) {
    return (
      <div
        className="size-full bg-card rounded-md relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FullScreenButton hover={hover} fullScreen={fullScreen} setFullScreen={setFullScreen} />
        {children}
      </div>
    );
  } else {
    return (
      <div
        className="inset-0 absolute top-0 left-0 z-100 bg-background"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FullScreenButton hover={hover} fullScreen={fullScreen} setFullScreen={setFullScreen} />
        {children}
      </div>
    );
  }
}
