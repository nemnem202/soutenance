import AnimatedTabs from "@/components/animated-tabs";
import Header from "@/components/game-header";
import ChordTab from "@/components/game/chord-tab";
import { Tab } from "@/components/game/game-assets";
import DesktopGameControlsSection, { MobileGameControlSection } from "@/components/game/game-controls-section";
import GameSidebar from "@/components/game/game-sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useEffect, useState } from "react";

export default function Page() {
  const [sidebarOpen, setOpen] = useState(false);

  useEffect(() => {
    console.log("open ?", sidebarOpen);
  }, [sidebarOpen]);
  return (
    <div className="flex flex-row w-screen h-screen overflow-hidden">
      <GameSidebar sidebarOpen={sidebarOpen} setOpen={setOpen} />
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-auto">
        {/* <Header /> */}
        <Game toggleSidebar={() => setOpen((prev) => !prev)} />
      </div>
    </div>
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

  const [activeTab, setActiveTab] = useState<TabID>("chords");

  return (
    <main className="flex-1 min-w-0  flex flex-col items-center pt-5 max-w-screen">
      <h1 className="headline select-none">Brown Sugar</h1>
      <div className="size-full lg:px-10 px-2 py-5  flex flex-col gap-2 min-w-0">
        <div className="flex-1 flex flex-col">
          <div className="w-full flex  gap-2 justify-between">
            <div className="col-1 flex flex-1  items-center">
              <DesktopGameControlsSection {...props} />
            </div>

            <div className="col-2 flex-1 justify-center hidden sm:flex">
              <AnimatedTabs
                activeTab={activeTab}
                onChange={(v) => setActiveTab(v as any)}
                tabs={tabs}
                variant="pill"
                className="my-2"
              />
            </div>
            <div className="md:flex-1"></div>
          </div>
          <Tab>{activeTab === "chords" && <ChordTab />}</Tab>
        </div>
      </div>
    </main>
  );
}
