import { useState } from "react";
import ChordCarousel from "./chord-carousel";
import ChordGrid from "./chord-grid";
import { ChevronLeft, ChevronRight, Columns3, Grid3X3 } from "lucide-react";
import { Separator } from "../separator";
import { Button } from "../button";
import useCarousel from "embla-carousel-react";

export default function ChordTab() {
  const [display, setDisplay] = useState<"grid" | "carousel">("grid");
  const [carouselRef, api] = useCarousel({ loop: true, align: "center" });
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
      {display === "grid" ? <ChordGrid /> : <ChordCarousel api={api} carouselRef={carouselRef} />}
      <div className="w-full h-20 flex justify-between items-end gap-2 p-2">
        <div className="border rounded-md flex  h-10 overflow-hidden">
          <button
            onClick={() => setDisplay("carousel")}
            className={`w-full h-full flex justify-center items-center px-2 ${display === "carousel" ? "bg-popover" : "text-muted-foreground"}`}
          >
            <Columns3 />
          </button>
          <Separator orientation="vertical" />
          <button
            onClick={() => setDisplay("grid")}
            className={`w-full h-full flex justify-center items-center px-2 ${display === "grid" ? "bg-popover" : "text-muted-foreground"}`}
          >
            <Grid3X3 />
          </button>
        </div>
        <div>
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
