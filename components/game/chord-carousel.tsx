import { EmblaViewportRefType } from "embla-carousel-react";
import { chordToString } from "@/lib/utils";
import { EmblaCarouselType } from "embla-carousel";
import { motion } from "motion/react";
import useChordCarousel from "@/hooks/use-chord-carousel";

export interface ChordCarouselProps {
  carouselRef: EmblaViewportRefType;
  api: EmblaCarouselType | undefined;
}

export default function ChordCarousel({ carouselRef, api }: ChordCarouselProps) {
  const { chords, springWidth } = useChordCarousel({ carouselRef, api });

  return (
    <>
      <div></div>
      <div className="relative w-full pointer-events-none">
        <div className="relative z-10 w-full mx-auto [--slide-height:19rem] [--slide-spacing:1rem] [--slide-size:100%] [--slide-spacing-sm:1.6rem] [--slide-size-sm:50%] [--slide-spacing-lg:2rem]">
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex touch-pan-y gap-8">
              {chords.map((chord, index) => (
                <div className="flex-none min-w-0 font-mono text-[5rem]" key={index}>
                  <div
                    className="embla__slide__number rounded-[1.8rem] text-[6rem] font-semibold flex items-center justify-center h-fit select-none px-[3rem] min-w-[5ch] max-w-[20ch]"
                    style={{ opacity: 0, transform: "scale(0)" }}
                  >
                    <span className="whitespace-nowrap ">{chordToString(chord)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex justify-center items-center z-0">
          <motion.div className="border rounded-full bg-background h-full" style={{ width: springWidth }} />
        </div>
      </div>
    </>
  );
}
