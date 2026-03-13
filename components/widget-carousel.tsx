import useCaroussel from "@/hooks/use-caroussel";
import { ReactNode, RefObject, useEffect } from "react";
import { Button } from "./button";
import { ChevronLeftButton, ChevrontRightButton } from "./custom-buttons";
import { useLanguage } from "@/hooks/use-language";
import useScreen from "@/hooks/use-screen";
import { navigate } from "vike/client/router";

interface MediumWidgetGroupProps {
  widgets: ReactNode[];
  containerRef: RefObject<HTMLDivElement | null>;
  widgetsRef: RefObject<(HTMLDivElement | null)[]>;
  handleScroll: () => void;
  handleScrollEnd: () => void;
  onLastItemVisibilityChange: (isVisible: boolean) => void;
}

export function MediumWidgetGroup(props: MediumWidgetGroupProps) {
  const { widgets, containerRef, widgetsRef, handleScroll, handleScrollEnd, onLastItemVisibilityChange } = props;
  const size = useScreen();

  useEffect(() => {
    if (size === "sm") return;
    const lastItem = widgetsRef.current[widgets.length - 1];
    if (!lastItem) return;

    const observer = new IntersectionObserver(([entry]) => onLastItemVisibilityChange(entry.isIntersecting), {
      root: containerRef.current,
      threshold: 1.0,
    });

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full overflow-x-auto scrollbar-hide flex md:gap-8.5 gap-2 scroll-smooth relative snap-x snap-mandatory bg-background"
      ref={containerRef}
      onScroll={handleScroll}
      onScrollEnd={handleScrollEnd}
    >
      {widgets.map((widget, index) => (
        <div
          key={index}
          ref={(el) => {
            widgetsRef.current[index] = el;
          }}
          className={`widget-${index} shrink-0 snap-start`}
        >
          {widget}
        </div>
      ))}
    </div>
  );
}

export interface MediumWidgetCarousselProps {
  title: string;
  widgets: ReactNode[];
  seeAllUrl?: string;
}

export function MediumWidgetCaroussel({ title, widgets, seeAllUrl = "/see-all" }: MediumWidgetCarousselProps) {
  const {
    isLastItemVisible,
    itemIndex,
    containerRef,
    widgetsRef,
    scrollToIndex,
    handleScroll,
    handleScrollEnd,
    setIsLastItemVisible,
  } = useCaroussel();

  const isMobile = useScreen() === "sm";

  return (
    <section className="flex flex-col md:gap-6 gap-1 mx-auto mb-6 container">
      <div className="flex w-full justify-between items-center">
        <WidgetTitle title={title} seeAllUrl={seeAllUrl} />
        {isMobile ? (
          <>
            <ChevrontRightButton onClick={() => navigate(seeAllUrl)} />
          </>
        ) : (
          <div className="flex">
            <ChevronLeftButton disabled={itemIndex <= 0} onClick={() => scrollToIndex(Math.max(0, itemIndex - 1))} />
            <ChevrontRightButton
              disabled={isLastItemVisible}
              onClick={() => scrollToIndex(Math.min(widgetsRef.current.length - 1, itemIndex + 1))}
            />
          </div>
        )}
      </div>
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

export function WidgetTitle({ title, seeAllUrl = "/see-all" }: { title: string; seeAllUrl?: string }) {
  const { instance } = useLanguage();
  const isMobile = useScreen() == "sm";
  return (
    <div className="flex items-center gap-x-5">
      <h2 className="title-2">{title}</h2>
      {!isMobile && (
        <Button variant="outline" size="sm" className="py-0" asChild>
          <a href={seeAllUrl} className="paragraph-md !h-min py-1">
            {instance.getItem("seeAll")}
          </a>
        </Button>
      )}
    </div>
  );
}
