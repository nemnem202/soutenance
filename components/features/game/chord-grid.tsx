import useGame from "@/hooks/use-game";
import { useLanguage } from "@/hooks/use-language";
import { logger } from "@/lib/logger";
import type { BarsSchema, CellSchema, MeasureSchema, SectionSchema } from "@/types/entities";
import type { ReactNode } from "react";

export default function ChordGrid() {
  const { exercise } = useGame();
  const { instance } = useLanguage();

  if (!exercise.chordsGrid)
    return (
      <div className="size-full p-0 md:p-4 flex flex-col gap-5">
        <p className="paragraph-md text-muted-foreground">
          {instance.getItem("this_exercise_does_not_contains_chords_grid")}
        </p>
      </div>
    );
  return (
    <div className="size-full p-0 md:p-4 flex flex-col gap-5">
      {exercise.chordsGrid.sections
        .sort((a, b) => a.index - b.index)
        .map((section) => (
          <Section section={section} key={section.index} />
        ))}
    </div>
  );
}

function Section({ section }: { section: SectionSchema }) {
  logger.info("voltas", section.voltas);
  return (
    <div className="flex flex-col gap-2">
      {section.type !== "Generic" && <SectionLabel label={section.type} />}

      <div className="w-full grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-y-2">
        {section.commonMeasures
          .sort((a, b) => a.index - b.index)
          .map((measure) => (
            <MeasureBlock measure={measure} key={measure.index} />
          ))}
        {section.voltas.map((volta, index) => (
          <>
            <SectionLabel label={`Volta ${volta.volta}`} />
            {volta.measures
              .sort((a, b) => a.index - b.index)
              .map((measure) => (
                <MeasureBlock measure={measure} key={measure.index} />
              ))}
          </>
        ))}
      </div>
    </div>
  );
}

function MeasureBlock({ measure }: { measure: MeasureSchema }) {
  return (
    <div className="flex w-full h-12 relative items-center">
      {measure.bars.left && <LeftBar bar={measure.bars.left} />}
      {measure.cells
        .sort((a, b) => a.index - b.index)
        .map((cell, index) => (
          <CellGroup cell={cell} measure={measure} key={index} />
        ))}
      <div id="right">{measure.bars.right && <RightBar bar={measure.bars.right} />}</div>
    </div>
  );
}

function CellGroup({ cell, measure }: { cell: CellSchema; measure: MeasureSchema }) {
  const renderCellContent = (): ReactNode => {
    switch (cell.kind) {
      case "Chord":
        return <ChordCell cell={cell} />;
      case "Empty":
        return <EmptyCell cell={cell} />;
      case "Spacer":
        return <SpacerCell cell={cell} />;
      default:
        return null;
    }
  };

  return (
    <div
      className=" px-0.5 md:px-2 h-full overflow-hidden flex justify-between items-center gap-1"
      style={{ width: `${100 / measure.cells.length}%` }}
    >
      <div id="left" className="flex items-center">
        {cell.timeSignatureChangeBottom && cell.timeSignatureChangeTop && (
          <TimeSignature
            top={cell.timeSignatureChangeTop}
            bottom={cell.timeSignatureChangeBottom}
          />
        )}
      </div>
      {renderCellContent()}
    </div>
  );
}

type ChordCellType = Extract<CellSchema, { kind: "Chord" }>;
type EmptyCellType = Extract<CellSchema, { kind: "Empty" }>;
type SpacerCellType = Extract<CellSchema, { kind: "Spacer" }>;

function ChordCell({ cell }: { cell: ChordCellType }) {
  return (
    <div className=" rounded-md h-full w-full flex items-center ">
      <p className="whitespace-nowrap font-mono semibold text-xl flex lg:gap-1">
        <span>{cell.chord.content.note}</span>
        {cell.chord.content.modifier && (
          <span className="text-muted-foreground  paragraph-sm max-w[50%]">
            {cell.chord.content.modifier}
          </span>
        )}
      </p>
    </div>
  );
}

function EmptyCell({ cell }: { cell: EmptyCellType }) {
  return <div className="w-full h-full border border-primary">@{cell.index}</div>;
}

function SpacerCell({ cell }: { cell: SpacerCellType }) {
  return <div className="w-full h-full border border-secondary">SP{cell.index}</div>;
}

function TimeSignature({ top, bottom }: { top: number; bottom: number }) {
  return (
    <div className="flex flex-col text-xs leading-none paragraph-md">
      <span>{top}</span>
      <div className="h-[1px] w-full border border-foreground" />
      <span>{bottom}</span>
    </div>
  );
}

function LeftBar({ bar }: { bar: BarsSchema["left"] }) {
  const getBar = () => {
    switch (bar) {
      case "single":
        return "(";
      case "repeatOpen":
        return "[";
      case "sectionOpen":
        return "{";
    }
  };

  return <span className="text-primary">{getBar()}</span>;
}

function RightBar({ bar }: { bar: BarsSchema["right"] }) {
  const getBar = () => {
    switch (bar) {
      case "single":
        return ")";
      case "repeatClose":
        return "]";
      case "sectionClose":
        return "}";
      case "final":
        return "Z";
    }
  };
  return <span className="text-primary">{getBar()}</span>;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="w-fit aspect-square border bg-popover paragraph-md rounded-xs text-secondary font-mono font-bold flex items-center justify-center">
      {label}
    </div>
  );
}
