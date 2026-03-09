import useCaroussel from "@/hooks/use-caroussel";
import { ReactNode, RefObject, useEffect } from "react";
import { Button } from "./button";
import { ChevronLeftButton, ChevrontRightButton } from "./custom-buttons";

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

  useEffect(() => {
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
      className="w-full overflow-x-auto scrollbar-hide flex gap-8.5 scroll-smooth relative snap-x snap-mandatory bg-background"
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
}

export function MediumWidgetCaroussel({ ...props }: MediumWidgetCarousselProps) {
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
  return (
    <section className="flex flex-col gap-6 mx-auto mb-6 container">
      <div className="flex w-full justify-between items-center">
        <WidgetTitle {...props} />
        <div className="flex">
          <ChevronLeftButton disabled={itemIndex <= 0} onClick={() => scrollToIndex(Math.max(0, itemIndex - 1))} />
          <ChevrontRightButton
            disabled={isLastItemVisible}
            onClick={() => scrollToIndex(Math.min(widgetsRef.current.length - 1, itemIndex + 1))}
          />
        </div>
      </div>
      <MediumWidgetGroup
        widgets={props.widgets}
        containerRef={containerRef}
        widgetsRef={widgetsRef}
        handleScroll={handleScroll}
        handleScrollEnd={handleScrollEnd}
        onLastItemVisibilityChange={setIsLastItemVisible}
      />
    </section>
  );
}

export function WidgetTitle({ ...props }: MediumWidgetCarousselProps) {
  return (
    <div className="flex items-center gap-x-5">
      <h2 className="title-2">{props.title}</h2>
      <Button variant="outline" size="sm" className="py-0" asChild>
        <a href="/see-all" className="paragraph-md !h-min py-1">
          see all
        </a>
      </Button>
    </div>
  );
}
