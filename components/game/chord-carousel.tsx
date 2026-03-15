import { CHORDS_DICTIONNARY } from "@/config/chords-dictionnary";
import { CarouselChord, ChordHarmony, Notes } from "@/types/midi";
import { faker } from "@faker-js/faker";
import useCarousel from "embla-carousel-react";
import { Button } from "../button";
import { chordToString } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import { EmblaCarouselType, EmblaEventListType, EmblaEventType } from "embla-carousel";

const HARMONIES = Object.keys(CHORDS_DICTIONNARY) as ChordHarmony[];
const TWEEN_FACTOR_BASE = 0.52;
export const CHORDS_PLACEHOLDER: CarouselChord[] = Array.from({ length: 10 }, (_, index) => {
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
    const slidesInView = emblaApi.slidesInView();

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      // snapIndex correspond directement à l'index du slide dans Embla
      let diffToTarget = scrollSnap - scrollProgress;

      // Correction pour le loop
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
      const scale = numberWithinRange(tweenValue, 0, 1).toString();

      const tweenNode = tweenNodes.current[snapIndex];
      if (tweenNode) tweenNode.style.transform = `scale(${scale})`;
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
    <div className="embla">
      <div className="embla__viewport" ref={carouselRef}>
        <div className="embla__container">
          {CHORDS_PLACEHOLDER.map((chord, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <span>{chordToString(chord)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
