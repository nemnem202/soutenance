import ChordCarousel from "./chord-carousel";
import ChordGrid from "./chord-grid";
import useGame from "@/hooks/use-game";
import ChordGridProvider from "@/providers/chord-grid-provider";

export default function ChordTab() {
  const { activeTab } = useGame();
  return (
    <div className="w-full h-full min-h-0 overflow-y-auto bg-transparent">
      <ChordGridProvider>
        {activeTab === "chords-grid" ? <ChordGrid /> : <ChordCarousel />}
      </ChordGridProvider>
    </div>
  );
}
