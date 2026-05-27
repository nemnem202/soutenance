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

export default function ChordTab() {
  const { activeTab, tabs, setActiveTab } = useGame();
  const { size } = useScreen();
  const axis = size === "sm" ? "y" : "x";
  const [carouselRef, api] = useCarousel({ loop: true, align: "center", axis });
  // const handleClickNext = () => {
  //   if (activeTab === "chords-carousel") {
  //     api?.scrollNext();
  //   }
  // };
  // const handleClickPrev = () => {
  //   if (activeTab === "chords-carousel") {
  //     api?.scrollPrev();
  //   }
  // };
  return (
    <div className="h-full w-full flex flex-col justify-between overflow-auto">
      {activeTab === "chords-grid" ? (
        <ChordGrid />
      ) : (
        <ChordCarousel key={axis} api={api} carouselRef={carouselRef} axis={axis} />
      )}
    </div>
  );
}
