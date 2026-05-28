import type { EmblaCarouselType } from "embla-carousel";
import type { EmblaViewportRefType } from "embla-carousel-react";
import { motion } from "motion/react";
import useChordCarousel from "@/hooks/use-chord-carousel";
import { chordToString } from "@/lib/utils";
import { useData } from "vike-react/useData";
import type { Data } from "@/pages/game/@id/+data";
import type { ChordsGridSchema, MeasureSchema } from "@/types/entities";
import type { Chord } from "@/types/music";
import { CellKind } from "@/lib/generated/prisma/enums";
import { useChordGrid } from "@/providers/chord-grid-provider";
import { useEffect, useRef } from "react";
import useScreen from "@/hooks/use-screen";
import useCarousel from "embla-carousel-react";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";

export interface ChordCarouselProps {
  carouselRef: EmblaViewportRefType;
  api: EmblaCarouselType | undefined;
  axis: "x" | "y";
}

export default function ChordCarousel() {
  const { exercise } = useData<Data>();
  const { size } = useScreen();
  const { state } = useMidiStore();
  const initialMeasureRef = useRef(state?.transport.currentMeasureIndex ?? 0);

  const [carouselRef, api] = useCarousel({
    loop: true,
    align: "center",
    startIndex: initialMeasureRef.current,
  });

  if (!exercise.success || !exercise.data.chordsGrid) return null;
  const axis = size === "sm" ? "y" : "x";

  return (
    <ChordCarouselContent
      carouselRef={carouselRef}
      api={api}
      axis={axis}
      chordsGrid={exercise.data.chordsGrid}
    />
  );
}

function ChordCarouselContent({
  carouselRef,
  api,
  axis,
  chordsGrid,
}: ChordCarouselProps & { chordsGrid: ChordsGridSchema }) {
  const { state } = useMidiStore();
  const { springWidth } = useChordCarousel({ carouselRef, api, axis });

  const measures: MeasureSchema[] = chordsGrid.sections.flatMap((section) => [
    ...section.commonMeasures,
    ...section.voltas.flatMap((volta) => volta.measures),
  ]);

  useEffect(() => {
    api?.scrollTo(state?.transport.currentMeasureIndex ?? 0);
  }, [state?.transport.currentMeasureIndex]);

  return (
    <div className="flex items-center justify-center size-full">
      <div></div>
      <div className="relative w-full h-40 pointer-events-none">
        <div className="relative z-10 w-full mx-auto [--slide-height:19rem] [--slide-spacing:1rem] [--slide-size:100%] [--slide-spacing-sm:1.6rem] [--slide-size-sm:50%] [--slide-spacing-lg:2rem]">
          <div
            className={`md:overflow-hidden ${axis === "y" ? "h-40" : "w-full"}`}
            ref={carouselRef}
          >
            <div
              className={`flex gap-8 ${axis === "y" ? "flex-col touch-pan-x h-full" : "flex-row touch-pan-y"}`}
            >
              {measures.map((measure) => (
                <div className="flex-none min-w-0 font-mono text-[5rem]" key={measure.index}>
                  <div
                    className={`embla__slide__number rounded-[1.8rem] text-[6rem] font-semibold flex gap-20 items-center justify-center h-fit select-none px-[3rem] flex-none min-w-0 font-mono text-[5rem] ${axis === "y" ? "w-full" : ""}`}
                    style={{ opacity: 0, transform: "scale(0)" }}
                  >
                    {measure.cells.map((cell) => {
                      if (cell.kind === CellKind.Chord) {
                        return (
                          <span className="whitespace-nowrap flex" key={cell.index}>
                            {chordToString(cell.chord)}
                          </span>
                        );
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {axis !== "y" && (
          <div className="absolute inset-0 flex justify-center items-center z-0">
            <motion.div
              className="border rounded-full bg-background h-full"
              style={{ width: springWidth }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
