import { type Dispatch, type SetStateAction, useState } from "react";
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
import Headline from "@/components/ui/headline";
import MobileHeaderNavContainer from "@/components/features/layout/mobile-header-nav-container";
import { HistoryBackButton } from "@/components/ui/custom-buttons";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import GameProvider, { type TabID } from "@/providers/game-provider";
import PianoRoll from "@/midi-editor/components/piano-roll";
import { ClientOnly } from "vike-react/ClientOnly";
import useGame from "@/hooks/use-game";
import { Spinner } from "@/components/ui/spinner";
import useAudio from "@/hooks/use-audio";
import useScreen from "@/hooks/use-screen";

export default function Page() {
  const { exercise } = useData<Data>();

  if (!exercise.success) return null;

  return (
    <GameProvider exercise={exercise.data}>
      <GameContent />
    </GameProvider>
  );
}

function GameContent() {
  const { exercise } = useGame();
  const [sidebarOpen, setOpen] = useState(false);

  return (
    <div className="flex flex-row w-screen h-[100dvh] overflow-hidden">
      <GameSidebar sidebarOpen={sidebarOpen} setOpen={setOpen} />
      <div className="flex-1 min-w-0 h-screen flex flex-col">
        <SizeAdapter
          sm={<MobileGameView setOpen={setOpen} />}
          md={
            <>
              <Header />
              <main className="flex-1 min-w-0 flex flex-col items-center p-4 max-w-screen min-h-0">
                <Headline>{exercise.title}</Headline>
                <GameView toggleSidebar={() => setOpen(!sidebarOpen)} />
              </main>
            </>
          }
        />
      </div>
    </div>
  );
}

function GameView({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { activeTab, tabs, setActiveTab } = useGame();
  const { audioLoaded } = useAudio();
  const { size } = useScreen();
  return (
    <div className="size-full lg:px-10 md:py-5 flex flex-col gap-2 min-h-0">
      <div className="flex-1 flex flex-col h-full min-h-0 gap-3">
        {size !== "sm" && (
          <div className="w-full flex justify-between items-center gap-2">
            <div className="flex-1">
              <DesktopGameControlsSection toggleSidebar={toggleSidebar} />
            </div>
            <div className="hidden md:block flex-1 md:flex-initial text-center">
              <AnimatedTabs
                activeTab={activeTab}
                onChange={(v) => setActiveTab(v as TabID)}
                tabs={tabs}
                variant="pill"
              />
            </div>
            <div className="flex-1 hidden lg:block" />
          </div>
        )}
        <Tab>
          {activeTab === "chords" && <ChordTab />}
          {activeTab === "piano-roll" && (
            <ClientOnly>
              {!audioLoaded ? (
                <div className="size-full flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <PianoRoll />
              )}
            </ClientOnly>
          )}
        </Tab>
      </div>
    </div>
  );
}

function MobileGameView({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { exercise } = useGame();
  const [drawersVisible, setDrawersVisible] = useState(true);
  const { orientation } = useScreen();

  if (orientation === "vertical") {
    return (
      <Drawer modal={false} open={drawersVisible} onOpenChange={setDrawersVisible}>
        <DrawerTrigger asChild>
          <main className="flex-1 min-w-0 h-full flex flex-col items-center p-4 max-w-screen min-h-0">
            <div
              className={`w-full overflow-hidden transition-[height] duration-300`}
              style={{ height: drawersVisible ? `4.5rem` : "0px" }}
            >
              <MobileHeaderNavContainer>
                <HistoryBackButton />
                <Headline>{exercise.title}</Headline>
                <div />
              </MobileHeaderNavContainer>
            </div>
            <GameView toggleSidebar={() => setOpen((prev) => !prev)} />
          </main>
        </DrawerTrigger>
        <DrawerContent className="rounded-none border-0 border-t">
          <DrawerTitle className="hidden">Controls</DrawerTitle>
          <div className="mx-auto w-full max-w-sm py-10">
            <MobileGameControlSection toggleSidebar={() => setOpen((prev) => !prev)} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Drawer modal={false} open={drawersVisible} onOpenChange={setDrawersVisible}>
        <DrawerTrigger asChild>
          <main className="flex-1 min-w-0 h-full flex flex-col items-center p-4 max-w-screen min-h-0">
            <GameView toggleSidebar={() => setOpen((prev) => !prev)} />
          </main>
        </DrawerTrigger>
        <DrawerContent className="rounded-none border-0 border-t">
          <DrawerTitle className="hidden">Controls</DrawerTitle>
          <div className="mx-auto w-full max-w-sm py-5">
            <MobileGameControlSection toggleSidebar={() => setOpen((prev) => !prev)} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}
