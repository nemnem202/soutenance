import { Field, FieldLabel } from "@/components/field";
import Header from "@/components/game-header";
import { ControlsSection, IconButton } from "@/components/game/gameAssets";
import { Input } from "@/components/input";
import { Separator } from "@/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Play, Settings, Square } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [sidebarOpen, setOpen] = useState(false);
  return (
    <div className="flex col w-screen h-screen">
      <GameSidebar sidebarOpen={sidebarOpen} />
      <div className="w-full h-screen flex flex-col">
        <Header />
        <Game openSidebar={() => setOpen((prev) => !prev)} />
      </div>
    </div>
  );
}

function GameSidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  return (
    <div
      className={`bg-card  overflow-hidden transition-all duration-100 ease-in-out ${sidebarOpen && "border-r"} `}
      style={{ width: sidebarOpen ? "350px" : "0px" }}
    >
      <div className="w-[350px]"></div>
    </div>
  );
}

interface Gameprops {
  openSidebar: () => void;
}

function Game({ ...props }: Gameprops) {
  return (
    <main className="flex-1 flex flex-col items-center pt-5">
      <h1 className="headline select-none">Brown Sugar</h1>
      <div className=" w-full px-20 py-5 h-full flex flex-col gap-5">
        <div className="flex-1">
          <Tabs defaultValue="piano-roll" className="w-full h-full">
            <div className="w-full flex justify-center">
              <TabsList className="rounded-full">
                <TabsTrigger value="piano-roll" className="rounded-full rounded-e-sm select-none paragraph-md">
                  piano roll
                </TabsTrigger>
                <TabsTrigger value="sheet" className="rounded-sm select-none paragraph-md">
                  sheet
                </TabsTrigger>
                <TabsTrigger value="guitar" className="rounded-full rounded-s-sm select-none paragraph-md">
                  guitar
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="piano-roll"></TabsContent>
            <TabsContent value="sheet"></TabsContent>
            <TabsContent value="guitar"></TabsContent>
          </Tabs>
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
