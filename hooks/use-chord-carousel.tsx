import { ChordCarouselProps } from "@/components/game/chord-carousel";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionnary";
import { CarouselChord, ChordHarmony, Notes } from "@/types/midi";
import { faker } from "@faker-js/faker";
import { EmblaCarouselType } from "embla-carousel";
import { useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const HARMONIES = Object.keys(CHORDS_DICTIONNARY) as ChordHarmony[];
const TWEEN_FACTOR_BASE = 0.4;
const CHORDS_PLACEHOLDER: CarouselChord[] = Array.from({ length: 20 }, (_, index) => {
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

export default function useChordCarousel({ carouselRef, api, axis }: ChordCarouselProps) {
  const chords = CHORDS_PLACEHOLDER;
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (axis === "y") {
        if (event.key === "ArrowUp") api?.scrollPrev();
        else if (event.key === "ArrowDown") api?.scrollNext();
      } else {
        if (event.key === "ArrowLeft") api?.scrollPrev();
        else if (event.key === "ArrowRight") api?.scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [api, axis]);

  return { chords, springWidth };
}
