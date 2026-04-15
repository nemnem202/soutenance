/** biome-ignore-all lint/correctness/useExhaustiveDependencies: sdfsdf */

import { ChevronRight } from "lucide-react";
import { type ReactNode, type RefObject, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useCarousel from "@/hooks/use-carousel";
import { useLanguage } from "@/hooks/use-language";
import useScreen from "@/hooks/use-screen";
import SizeAdapter from "../molecules/size-adapter";
import { ChevronLeftButton, ChevrontRightButton } from "../ui/custom-buttons";

interface MediumWidgetGroupProps {
  widgets: ReactNode[];
  containerRef: RefObject<HTMLDivElement | null>;
  widgetsRef: RefObject<(HTMLDivElement | null)[]>;
  handleScroll: () => void;
  handleScrollEnd: () => void;
  onLastItemVisibilityChange: (isVisible: boolean) => void;
}

export function MediumWidgetGroup(props: MediumWidgetGroupProps) {
  const {
    widgets,
    containerRef,
    widgetsRef,
    handleScroll,
    handleScrollEnd,
    onLastItemVisibilityChange,
  } = props;
  const size = useScreen();

  useEffect(() => {
    if (size === "sm") return;
    const lastItem = widgetsRef.current[widgets.length - 1];
    if (!lastItem) return;

    const observer = new IntersectionObserver(
      ([entry]) => onLastItemVisibilityChange(entry.isIntersecting),
      {
        root: containerRef.current,
        threshold: 1.0,
      }
    );

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full overflow-x-auto scrollbar-hide flex md:gap-8.5 gap-2 scroll-smooth relative snap-x snap-mandatory bg-background"
      ref={containerRef}
      onScroll={handleScroll}
      //@eslint-ignore
      onScrollEnd={handleScrollEnd}
    >
      {widgets.map((widget, index) => (
        <div
          key={index}
          ref={(el) => {
            widgetsRef.current[index] = el;
          }}
          className={`widget-${index} shrink-0 snap-start md:w-55 w-30 aspect-square`}
        >
          {widget}
        </div>
      ))}
    </div>
  );
}

export interface MediumWidgetCarouselProps {
  title: string;
  widgets: ReactNode[];
  seeAllUrl?: string;
}

export function MediumWidgetCarousel({
  title,
  widgets,
  seeAllUrl = "/see-all",
}: MediumWidgetCarouselProps) {
  const {
    isLastItemVisible,
    itemIndex,
    containerRef,
    widgetsRef,
    scrollToIndex,
    handleScroll,
    handleScrollEnd,
    setIsLastItemVisible,
  } = useCarousel();

  return (
    <section className="flex flex-col md:gap-6 gap-1 mx-auto mb-6 container">
      <WidgetTitle
        title={title}
        seeAllUrl={seeAllUrl}
        isLastItemVisible={isLastItemVisible}
        itemIndex={itemIndex}
        scrollToIndex={scrollToIndex}
        widgetsRef={widgetsRef}
      />

      <MediumWidgetGroup
        widgets={widgets}
        containerRef={containerRef}
        widgetsRef={widgetsRef}
        handleScroll={handleScroll}
        handleScrollEnd={handleScrollEnd}
        onLastItemVisibilityChange={setIsLastItemVisible}
      />
    </section>
  );
}

export function WidgetTitle({
  title,
  seeAllUrl,
  itemIndex,
  isLastItemVisible,
  scrollToIndex,
  widgetsRef,
}: {
  title?: string;
  seeAllUrl?: string;
  itemIndex?: number;
  isLastItemVisible?: boolean;
  scrollToIndex?: (index: number) => void;
  widgetsRef?: RefObject<(HTMLDivElement | null)[]>;
}) {
  const { instance } = useLanguage();
  const isMobile = useScreen() === "sm";
  return (
    <div className="flex w-full justify-between items-center min-h-5">
      <div className="flex items-center gap-x-5 w-full">
        {title && <h2 className="title-2">{title}</h2>}
        {!isMobile && seeAllUrl && (
          <Button variant="outline" size="sm" className="py-0" asChild>
            <a href={seeAllUrl} className="paragraph-md !h-min py-1">
              {instance.getItem("seeAll")}
            </a>
          </Button>
        )}
      </div>
      <SizeAdapter
        sm={
          <a href={seeAllUrl}>
            <ChevronRight />
          </a>
        }
        md={
          itemIndex !== undefined &&
          isLastItemVisible !== undefined &&
          scrollToIndex &&
          widgetsRef && (
            <div className="flex">
              <ChevronLeftButton
                disabled={itemIndex <= 0}
                onClick={() => scrollToIndex(Math.max(0, itemIndex - 1))}
              />
              <ChevrontRightButton
                disabled={isLastItemVisible}
                onClick={() =>
                  scrollToIndex(Math.min(widgetsRef.current.length - 1, itemIndex + 1))
                }
              />
            </div>
          )
        }
      />
    </div>
  );
}
