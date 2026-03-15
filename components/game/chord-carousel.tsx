import { CHORDS_DICTIONNARY } from "@/config/chords-dictionnary";
import { CarouselChord, ChordHarmony, Notes } from "@/types/midi";
import { faker } from "@faker-js/faker";
import useCarousel from "embla-carousel-react";
import { chordToString } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import { EmblaCarouselType } from "embla-carousel";
import { motion, useSpring } from "motion/react";
import { Button } from "../button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const HARMONIES = Object.keys(CHORDS_DICTIONNARY) as ChordHarmony[];
const TWEEN_FACTOR_BASE = 0.4;
export const CHORDS_PLACEHOLDER: CarouselChord[] = Array.from({ length: 20 }, (_, index) => {
  const root = faker.helpers.arrayElement(Notes);
  const harm = faker.helpers.arrayElement(HARMONIES);

  const tickStart = index * 480;
  const tickEnd = tickStart + faker.number.int({ min: 240, max: 960 });

  return {
    index,
    root,
    harm,
    tickStart,
    tickEnd,
  };
});

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max);

export default function ChordCarousel() {
  const [carouselRef, api] = useCarousel({ loop: true, align: "center" });
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const springWidth = useSpring(240, {
    stiffness: 300,
    damping: 18,
    mass: 0.1,
  });
  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApi: EmblaCarouselType) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (snapIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
      const scale = numberWithinRange(tweenValue, 0, 1);

      const tweenNode = tweenNodes.current[snapIndex];
      if (tweenNode) {
        console.log(100 * scale);
        tweenNode.style.transform = `scale(${scale})`;
        tweenNode.style.opacity = `${100 * scale}%`;
      }

      if (scale >= 0.95 && tweenNode) {
        const innerWidth = tweenNode.getBoundingClientRect().width;
        if (innerWidth) {
          springWidth.set(innerWidth);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!api) return;

    setTweenNodes(api);
    setTweenFactor(api);
    tweenScale(api);

    api
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [api, tweenScale]);

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div></div>
      <div className="relative w-full pointer-events-none">
        <div className="relative z-10 w-full mx-auto [--slide-height:19rem] [--slide-spacing:1rem] [--slide-size:100%] [--slide-spacing-sm:1.6rem] [--slide-size-sm:50%] [--slide-spacing-lg:2rem]">
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex touch-pan-y gap-8">
              {CHORDS_PLACEHOLDER.map((chord, index) => (
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
      <div className="w-full h-20 flex justify-end items-end gap-2 p-2">
        <Button variant={"outline"} className="rounded-full" size={"icon"} onClick={() => api?.scrollPrev()}>
          <ChevronLeft />
        </Button>
        <Button variant={"outline"} className="rounded-full" size={"icon"} onClick={() => api?.scrollNext()}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
