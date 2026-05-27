import useCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Columns3, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useScreen from "@/hooks/use-screen";

import ChordCarousel from "./chord-carousel";
import ChordGrid from "./chord-grid";
import { ChordDisplaySelector } from "./game-assets";
import useGame from "@/hooks/use-game";
import ChordGridProvider from "@/providers/chord-grid-provider";

export default function ChordTab() {
  const { activeTab, tabs, setActiveTab } = useGame();
  return (
    <div className="h-full w-full flex flex-col justify-between overflow-auto">
      <ChordGridProvider>
        {activeTab === "chords-grid" ? <ChordGrid /> : <ChordCarousel />}
      </ChordGridProvider>
    </div>
  );
}
