import useGame from "@/hooks/use-game";
import { useLanguage } from "@/hooks/use-language";
import { CellSchema, MeasureSchema, SectionSchema } from "@/types/entities";
import { logger } from "@/lib/logger";
import { ReactNode, useEffect } from "react";

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
    <div className="flex w-full h-12 relative">
      {measure.cells.map((cell, index) => (
        <ChordCellGroup cell={cell} key={index} />
      ))}
      <div className="absolute -right-[0.5px] top-0 h-12 bg-muted-foreground/50 w-[2px]" />
    </div>
  );
}

function ChordCellGroup({ cell }: { cell: CellSchema }) {
  useEffect(() => {
    logger.info("Cell", cell);
  }, [cell]);

  const renderCellContent = (): ReactNode => {
    switch (cell.kind) {
      case "Chord":
        return <ChordCell cell={cell} />;
      case "Empty":
        return <EmptyCell />;
      case "Spacer":
        return <SpacerCell />;
      default:
        return null;
    }
  };

  return (
    <div className=" w-[25%] px-0.5 md:px-2 h-full overflow-hidden flex items-center gap-1">
      {cell.timeSignatureChangeBottom && cell.timeSignatureChangeTop && (
        <TimeSignature top={cell.timeSignatureChangeTop} bottom={cell.timeSignatureChangeBottom} />
      )}
      {renderCellContent()}
    </div>
  );
}

type ChordCellType = Extract<CellSchema, { kind: "Chord" }>;

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

function EmptyCell() {
  return <div className="w-full h-full border border-primary">@</div>;
}

function SpacerCell() {
  return <div className="w-full h-full border border-secondary">SP</div>;
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

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="w-fit aspect-square border bg-popover paragraph-md rounded-xs text-secondary font-mono font-bold flex items-center justify-center">
      {label}
    </div>
  );
}
