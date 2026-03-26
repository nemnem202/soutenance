import { useState } from "react";
import ChordCarousel from "./chord-carousel";
import ChordGrid from "./chord-grid";
import { ChevronLeft, ChevronRight, Columns3, Grid3X3 } from "lucide-react";
import { Separator } from "../separator";
import { Button } from "../button";
import useCarousel from "embla-carousel-react";
import useScreen from "@/hooks/use-screen";

export default function ChordTab() {
  const screen = useScreen();
  const [display, setDisplay] = useState<"grid" | "carousel">("grid");
  const axis = screen === "sm" ? "y" : "x";
  const [carouselRef, api] = useCarousel({ loop: true, align: "center", axis });
  const handleClickNext = () => {
    if (display === "carousel") {
      api?.scrollNext();
    } else {
    }
  };
  const handleClickPrev = () => {
    if (display === "carousel") {
      api?.scrollPrev();
    } else {
    }
  };
  return (
    <div className="h-full w-full flex flex-col justify-between">
      {display === "grid" ? (
        <ChordGrid />
      ) : (
        <ChordCarousel key={axis} api={api} carouselRef={carouselRef} axis={axis} />
      )}
      <div className="w-full h-20 flex justify-between items-end gap-2 p-2 hidden md:flex">
        <div className="border rounded-md flex items-center h-10 overflow-hidden ">
          <button
            onClick={() => setDisplay("carousel")}
            className={`cursor-pointer w-full h-full flex justify-center items-center px-2 ${display === "grid" && "text-muted-foreground bg-popover"}`}
          >
            <Columns3 />
          </button>
          <Separator orientation="vertical" />
          <button
            onClick={() => setDisplay("grid")}
            className={`cursor-pointer w-full h-full flex justify-center items-center px-2 ${display === "carousel" && "text-muted-foreground bg-popover"}`}
          >
            <Grid3X3 />
          </button>
        </div>
        <div className="flex gap-2 ">
          <Button variant={"outline"} className="rounded-full" size={"icon"} onClick={handleClickPrev}>
            <ChevronLeft />
          </Button>
          <Button variant={"outline"} className="rounded-full" size={"icon"} onClick={handleClickNext}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
