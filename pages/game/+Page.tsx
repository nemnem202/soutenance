import AnimatedTabs from "@/components/animated-tabs";
import Header from "@/components/game-header";
import ChordCarousel from "@/components/game/chord-carousel";
import { Tab } from "@/components/game/game-assets";
import GameControlsSection from "@/components/game/game-controls-section";
import GameSidebar from "@/components/game/game-sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";

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

export interface Gameprops {
  openSidebar: () => void;
}

function Game({ ...props }: Gameprops) {
  const { instance } = useLanguage();

  const tabs = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];

  const [activeTab, setActiveTab] = useState("piano-roll");

  return (
    <main className="flex-1 flex flex-col items-center pt-5 w-screen">
      <h1 className="headline select-none">Brown Sugar</h1>
      <div className=" size-full px-20 py-5  flex flex-col gap-2">
        <div className="flex-1 flex flex-col">
          <div className="w-full flex justify-center">
            <AnimatedTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} variant="pill" className="my-2" />
          </div>
          <div className="flex-1">
            <Tab>
              <ChordCarousel />
            </Tab>
          </div>
        </div>
        <GameControlsSection {...props} />
      </div>
    </main>
  );
}
