import { useEffect, useState } from "react";
import ChordTab from "@/components/features/game/chord-tab";
import { Tab } from "@/components/features/game/game-assets";
import DesktopGameControlsSection, {
  MobileGameControlSection,
} from "@/components/features/game/game-controls-section";
import GameSidebar from "@/components/features/game/game-sidebar";
import Header from "@/components/features/layout/game-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import AnimatedTabs from "@/components/organisms/animated-tabs";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/organisms/drawer";
import { useLanguage } from "@/hooks/use-language";
import Headline from "@/components/ui/headline";
import MobileHeaderNavContainer from "@/components/features/layout/mobile-header-nav-container";
import { HistoryBackButton } from "@/components/ui/custom-buttons";
import type { Exercise } from "@/types/entities";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import GameProvider from "@/providers/game-provider";
import PianoRoll from "@/midi-editor/components/piano-roll";
import { ClientOnly } from "vike-react/ClientOnly";
import { MidiProvider } from "@/midi-editor/providers/midi-provider";
import type { State } from "@/midi-editor/types/instance";
import { logger } from "@/lib/logger";
import { convertMidiFileToState, getMidiFile } from "@/midi-editor/lib/midiconverter";
import midiFile from "@/assets/midi/FlyMeToTheMoon.mid?url";

export default function Page() {
  logger.info("Game page");
  const { exercise } = useData<Data>();
  const [midiState, setMidiState] = useState<State | null>(null);

  useEffect(() => {
    getMidiFile(midiFile).then(convertMidiFileToState).then(setMidiState);
  }, []);

  if (!exercise.success) return;
  return (
    <MidiProvider initialMidiData={midiState}>
      <GameProvider exercise={exercise.data}>
        <Content exercise={exercise.data} />
      </GameProvider>
    </MidiProvider>
  );
}

function Content({ exercise }: { exercise: Exercise }) {
  const [sidebarOpen, setOpen] = useState(false);
  const [drawersVisible, setDrawersVisible] = useState(true);
  return (
    <GameProvider exercise={exercise}>
      <div className="flex flex-row w-screen h-screen overflow-hidden">
        <GameSidebar sidebarOpen={sidebarOpen} setOpen={setOpen} />
        <div className="flex-1 min-w-0 h-screen flex flex-col overflow-auto">
          <SizeAdapter
            sm={
              <Drawer
                modal={false}
                open={drawersVisible}
                onOpenChange={(open) => setDrawersVisible(open)}
              >
                <DrawerTrigger asChild>
                  <main className="flex-1 min-w-0 flex flex-col items-center p-4 max-w-screen">
                    <div
                      className={` w-full overflow-hidden transition-[height] duration-300 ease-in-out`}
                      style={{ height: drawersVisible ? `${14 / 4 + 1}rem` : "0px" }}
                    >
                      <MobileHeaderNavContainer>
                        <HistoryBackButton />
                        <Headline>{exercise.title}</Headline>
                        <div></div>
                      </MobileHeaderNavContainer>
                    </div>
                    <Game toggleSidebar={() => setOpen((prev) => !prev)} />
                  </main>
                </DrawerTrigger>
                <DrawerContent className="rounded-none border-t border-l-0 border-r-0 border-b-0">
                  <DrawerTitle className="hidden">Game controls</DrawerTitle>
                  <div className="mx-auto w-full max-w-sm h-fit py-10 pt-0">
                    <MobileGameControlSection toggleSidebar={() => setOpen((prev) => !prev)} />
                  </div>
                </DrawerContent>
              </Drawer>
            }
            md={
              <>
                <Header />
                <main className="flex-1 min-w-0  flex flex-col items-center p-4 max-w-screen">
                  <Headline>{exercise.title}</Headline>
                  <Game toggleSidebar={() => setOpen((prev) => !prev)} />
                </main>
              </>
            }
          />
        </div>
      </div>
    </GameProvider>
  );
}

export interface Gameprops {
  toggleSidebar: () => void;
}

const tabsIds = ["piano-roll", "chords", "sheet", "guitar"] as const;
type TabID = (typeof tabsIds)[number];

function Game({ ...props }: Gameprops) {
  const { instance } = useLanguage();

  const tabs: { id: TabID; label: string; disabled?: boolean }[] = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];

  const [activeTab, setActiveTab] = useState<TabID>("piano-roll");

  return (
    <div className="size-full lg:px-10 md:py-5  flex flex-col gap-2 min-w-0">
      <div className="flex-1 flex flex-col">
        <div className="w-full flex  gap-2 justify-between">
          <div className="col-1 flex flex-1  items-center">
            <DesktopGameControlsSection {...props} />
          </div>

          <div className="col-2 flex-1 justify-center hidden sm:flex">
            <AnimatedTabs
              activeTab={activeTab}
              onChange={(v) => setActiveTab(v as "piano-roll" | "chords" | "sheet" | "guitar")}
              tabs={tabs}
              variant="pill"
              className="my-2"
            />
          </div>
          <div className="md:flex-1"></div>
        </div>
        <Tab>
          {activeTab === "chords" ? (
            <ChordTab />
          ) : (
            activeTab === "piano-roll" && (
              <ClientOnly>
                <PianoRoll />
              </ClientOnly>
            )
          )}
        </Tab>
      </div>
    </div>
  );
}
