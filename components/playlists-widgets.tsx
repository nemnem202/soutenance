import { RefObject, useEffect, useRef, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SmallPlaylistWidget() {
  return (
    <div className="h-12 w-full hover:bg-popover rounded flex gap-2 cursor-pointer">
      <img src="assets/playlist1.png" />
      <div className="flex flex-col">
        <p className="title-4">2501 standarts</p>
        <p className="paragraph-sm text-muted-foreground">par Naïm</p>
      </div>
    </div>
  );
}

export function MediumPlaylistWidget() {
  return (
    <a className="flex flex-col w-50 gap-2.5 cursor-pointer hover:bg-popover p-2 rounded-md transition" href="#">
      <div className="w-full aspect-square rounded overflow-hidden">
        <img src="assets/playlist2.png" />
      </div>

      <div className="flex-col flex w-full">
        <h3 className="title-4">Brown Sugar</h3>
        <div className="w-full justify-between paragraph-sm text-muted-foreground flex wrap">
          <p>par Naïm</p>
          <p>Jazz</p>
        </div>
        <div className="flex wrap">
          <Badge variant="outline" className="text-muted-foreground paragraph-xs">
            chords
          </Badge>
          <Badge variant="outline" className="text-muted-foreground paragraph-xs">
            melody
          </Badge>
        </div>
      </div>
    </a>
  );
}

export function MediumPlaylistWidgetGroup({
  containerRef,
  widgetsRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  widgetsRef: RefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    <div
      className="
    w-full overflow-x-auto scrollbar-hide flex gap-8.5 scroll-smooth relative snap-x snap-mandatory
    "
      ref={containerRef}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            widgetsRef.current[index] = el;
          }}
          className={`widget-${index} shrink-0 snap-start`}
        >
          <MediumPlaylistWidget />
        </div>
      ))}
    </div>
  );
}

export interface MediumPlaylistWidgetCarousselProps {
  title: string;
}

export function MediumPlaylistWidgetCaroussel({ ...props }: MediumPlaylistWidgetCarousselProps) {
  const [itemIndex, setItemIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);

  const updateIndex = () => {
    const container = containerRef.current;
    if (!container || widgetsRef.current.length === 0) return;

    const scrollLeft = container.scrollLeft;

    const itemWidth = widgetsRef.current[0]?.offsetWidth || 0;
    const gap = 34;

    const newIndex = Math.round(scrollLeft / (itemWidth + gap));

    setItemIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const target = widgetsRef.current[index];

    if (!container || !target) return;

    isScrollingRef.current = true;
    setItemIndex(index);

    container.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!isScrollingRef.current) {
        updateIndex();
      }
    };

    const handleScrollEnd = () => {
      isScrollingRef.current = false;
      updateIndex();
    };

    container.addEventListener("scroll", handleScroll);
    container.addEventListener("scrollend", handleScrollEnd);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scrollend", handleScrollEnd);
    };
  }, []);

  return (
    <section className="container max-w-7xl flex flex-col gap-6 mx-auto px-6 mt-6">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-x-5">
          <h2 className="title-2">{props.title}</h2>

          <Button variant="outline" size="sm" asChild>
            <a href="#">see all</a>
          </Button>
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            disabled={itemIndex <= 0}
            onClick={() => scrollToIndex(Math.max(0, itemIndex - 1))}
          >
            <ChevronLeft className={itemIndex === 0 ? "text-muted-foreground" : ""} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            disabled={itemIndex >= 19}
            onClick={() => scrollToIndex(Math.min(19, itemIndex + 1))}
          >
            <ChevronRight className={itemIndex === 19 ? "text-muted-foreground" : ""} />
          </Button>
        </div>
      </div>
      <MediumPlaylistWidgetGroup containerRef={containerRef} widgetsRef={widgetsRef} />
    </section>
  );
}
