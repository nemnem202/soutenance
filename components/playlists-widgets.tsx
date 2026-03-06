import { RefObject, useEffect, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import usePlaylistCaroussel from "@/hooks/use-playlist-caroussel";
import { getRandomProject } from "@/pages/+data";

export function SmallPlaylistWidget() {
  const [project, setProject] = useState(getRandomProject());
  return (
    <a
      className="h-12 w-full hover:bg-popover rounded flex gap-2 cursor-pointer transition"
      href={`/playlist/${project.id}`}
    >
      <div className="h-12 w-12 aspect-square overflow-hidden">
        <img src={project.image.src} alt={project.image.alt} className="object-cover h-full w-full" width={48} />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{project.title}</p>
        <p className="paragraph-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          par {project.author}
        </p>
      </div>
    </a>
  );
}

export function MediumPlaylistWidget() {
  const [project, setProject] = useState(getRandomProject());

  return (
    <div className=" w-50 cursor-pointer hover:bg-popover p-2 rounded-md transition">
      <a href={`/playlist/${project.id}`} className="flex flex-col rounded gap-2.5">
        <div className="w-full aspect-square rounded overflow-hidden">
          <img src={project.image.src} alt={project.image.alt} className="w-full h-full object-cover" width={185} />
        </div>

        <div className="flex-col flex w-full">
          <h3 className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{project.title}</h3>
          <div className="w-full justify-between paragraph-sm text-muted-foreground flex wrap">
            <p className="whitespace-nowrap overflow-hidden text-ellipsis">par {project.author}</p>
          </div>
        </div>
      </a>
    </div>
  );
}

function MediumAddNewProjectWidget() {
  return (
    <div className=" w-50 cursor-pointer hover:bg-popover p-2 rounded-md transition">
      <a href="/new-project" className="flex flex-col rounded gap-2.5">
        <div className="w-full aspect-square rounded overflow-hidden bg-card flex items-center justify-center">
          <Plus size={100} />
        </div>

        <div className="flex-col flex w-full">
          <h3 className="title-4">New Project</h3>
        </div>
      </a>
    </div>
  );
}

interface MediumPlaylistWidgetGroupProps {
  containerRef: RefObject<HTMLDivElement | null>;
  widgetsRef: RefObject<(HTMLDivElement | null)[]>;
  handleScroll: () => void;
  handleScrollEnd: () => void;
  onLastItemVisibilityChange: (isVisible: boolean) => void;
}

export function MediumPlaylistWidgetGroup(props: MediumPlaylistWidgetGroupProps) {
  const { containerRef, widgetsRef, handleScroll, handleScrollEnd, onLastItemVisibilityChange } = props;
  const ITEMS_COUNT = 20;

  useEffect(() => {
    const lastItem = widgetsRef.current[ITEMS_COUNT - 1];
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
      {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
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
  const {
    isLastItemVisible,
    itemIndex,
    containerRef,
    widgetsRef,
    scrollToIndex,
    handleScroll,
    handleScrollEnd,
    setIsLastItemVisible,
  } = usePlaylistCaroussel();
  return (
    <section className="flex flex-col gap-6 mx-auto mb-6 container">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-x-5">
          <h2 className="title-2">{props.title}</h2>
          <Button variant="outline" size="sm" className="py-0" asChild>
            <a href="/see-all" className="paragraph-md !h-min py-1">
              see all
            </a>
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
            disabled={isLastItemVisible}
            onClick={() => scrollToIndex(Math.min(widgetsRef.current.length - 1, itemIndex + 1))}
          >
            <ChevronRight className={isLastItemVisible ? "text-muted-foreground" : ""} />
          </Button>
        </div>
      </div>
      <MediumPlaylistWidgetGroup
        containerRef={containerRef}
        widgetsRef={widgetsRef}
        handleScroll={handleScroll}
        handleScrollEnd={handleScrollEnd}
        onLastItemVisibilityChange={setIsLastItemVisible}
      />
    </section>
  );
}

export function MediumPlaylistWrapper({ allowToAddANewProject }: { allowToAddANewProject?: boolean }) {
  return (
    <div className="flex  gap-x-auto gap-y-5 flex-wrap container">
      {allowToAddANewProject && (
        <div className="mr-6.5">
          <MediumAddNewProjectWidget />
        </div>
      )}
      {Array.from({ length: 50 }).map((_, index) => (
        <div className="mr-6.5" key={index}>
          <MediumPlaylistWidget />
        </div>
      ))}
    </div>
  );
}
