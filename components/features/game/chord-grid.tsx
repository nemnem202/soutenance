import useGame from "@/hooks/use-game";
import { useLanguage } from "@/hooks/use-language";
import { logger } from "@/lib/logger";
import { musicalNotationRootNote } from "@/lib/utils";
import type { BarsSchema, CellSchema, MeasureSchema, SectionSchema } from "@/types/entities";
import React, { useEffect, type ReactNode } from "react";

export default function ChordGrid() {
  const { exercise } = useGame();
  const { instance } = useLanguage();

  useEffect(() => {
    logger.info("Exercise", exercise);
  }, [exercise]);

  if (!exercise.chordsGrid)
    return (
      <div className="size-full p-0 md:p-4 flex flex-col gap-5">
        <p className="paragraph-md text-muted-foreground">
          {instance.getItem("this_exercise_does_not_contains_chords_grid")}
        </p>
      </div>
    );
  return (
    <div className="size-full p-1 md:p-6 flex flex-col gap-5">
      {exercise.chordsGrid.sections
        .sort((a, b) => a.index - b.index)
        .map((section) => (
          <Section section={section} key={section.index} />
        ))}
    </div>
  );
}

// function Section({ section }: { section: SectionSchema }) {
//   return (
//     <div className="flex flex-col gap-2">
//       {section.type !== "Generic" && <SectionLabel label={section.type} />}

//       <div className="w-full grid grid-cols-4 gap-y-2">
//         {section.commonMeasures
//           .sort((a, b) => a.index - b.index)
//           .map((measure) => (
//             <MeasureBlock measure={measure} key={measure.index} />
//           ))}
//         {section.voltas.map((volta) => (
//           <>
//             {volta.measures
//               .sort((a, b) => a.index - b.index)
//               .map((measure, index) => (
//                 <MeasureBlock
//                   measure={measure}
//                   key={measure.index}
//                   volta={index === 0 ? volta.volta : undefined}
//                 />
//               ))}
//           </>
//         ))}
//       </div>
//     </div>
//   );
// }

function Section({ section }: { section: SectionSchema }) {
  const commonMeasuresCount = section.commonMeasures.length;
  const firstVoltaStartColumn = (commonMeasuresCount % 4) + 1;
  return (
    <div className="flex flex-col gap-2">
      {section.type !== "Generic" && <SectionLabel label={section.type} />}

      <div className="w-full grid grid-cols-4 gap-y-2">
        {section.commonMeasures
          .sort((a, b) => a.index - b.index)
          .map((measure) => (
            <MeasureBlock measure={measure} key={measure.index} />
          ))}
        {section.voltas.length > 0 &&
          section.voltas[0].measures
            .sort((a, b) => a.index - b.index)
            .map((measure, index) => (
              <MeasureBlock
                measure={measure}
                key={measure.index}
                volta={index === 0 ? section.voltas[0].volta : undefined}
              />
            ))}
      </div>
      <div className="w-full grid grid-cols-4 gap-y-2">
        {section.voltas.slice(1).map((volta, index) => (
          <React.Fragment key={index}>
            {volta.measures.map((measure, index) => (
              <div
                key={measure.index}
                style={index === 0 ? { gridColumnStart: firstVoltaStartColumn } : {}}
              >
                <MeasureBlock measure={measure} volta={index === 0 ? volta.volta : undefined} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function MeasureBlock({ measure, volta }: { measure: MeasureSchema; volta?: number }) {
  return (
    <div className="flex w-full h-12 relative items-center">
      {volta && <VoltaBracket volta={volta} />}
      {measure.bars.left && <LeftBar bar={measure.bars.left} />}
      <div className="flex-1 max-w-[100%] flex items-center pl-1 overflow-hidden">
        {measure.cells
          .sort((a, b) => a.index - b.index)
          .map((cell, index) => (
            <CellGroup cell={cell} measure={measure} key={index} />
          ))}
      </div>

      {measure.bars.right && <RightBar bar={measure.bars.right} />}
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
      className={`px-0.5 md:px-2 h-full flex justify-between items-center  gap-1 ${cell.kind === "Chord" ? "flex-1" : "!w-0 !md:w-auto md:flex-1"}`}
      style={{ maxWidth: `${100 / measure.cells.length}%` }}
    >
      {cell.timeSignatureChangeBottom && cell.timeSignatureChangeTop && (
        <TimeSignature top={cell.timeSignatureChangeTop} bottom={cell.timeSignatureChangeBottom} />
      )}

      {renderCellContent()}
    </div>
  );
}

type ChordCellType = Extract<CellSchema, { kind: "Chord" }>;
type EmptyCellType = Extract<CellSchema, { kind: "Empty" }>;
type SpacerCellType = Extract<CellSchema, { kind: "Spacer" }>;

function ChordCell({ cell }: { cell: ChordCellType }) {
  return (
    <div className="h-min w-full flex items-center text-foreground bg-background md:bg-transparent">
      <p className="whitespace-nowrap font-mono semibold text-xl md:text-3xl flex h-fit lg:gap-1 ">
        <span>{musicalNotationRootNote(cell.chord.content.note)}</span>
        {cell.chord.content.modifier && (
          <span className="opacity-60 md:text-xl text-sm  max-w[50%]">
            {cell.chord.content.modifier}
          </span>
        )}
      </p>
    </div>
  );
}

function EmptyCell({ cell }: { cell: EmptyCellType }) {
  return (
    <div />
    // <div className="w-full h-full border flex items-center justify-center opacity-40">
    //   {cell.index}
    // </div>
  );
}

function SpacerCell({ cell }: { cell: SpacerCellType }) {
  return <div className="w-full h-full border border-secondary">SP{cell.index}</div>;
}

function TimeSignature({ top, bottom }: { top: number; bottom: number }) {
  return (
    <div className="flex flex-col text-xs -left-3.5 leading-none paragraph-md absolute opacity-50">
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
        return null;
      case "repeatOpen":
        return <div className="w-1 h-full border-x border-foreground absolute top-0 -right-0.5" />;
      case "sectionOpen":
        return (
          <div className="w-3 h-full border-l-2 border-foreground absolute top-0 -right-2 rounded-lg flex items-center text-foreground text-center justify-center">
            <span>:</span>
          </div>
        );
    }
  };

  return (
    <div className="relative h-full opacity-50" id={`bar-${bar}`}>
      {getBar()}
    </div>
  );
}

function RightBar({ bar }: { bar: BarsSchema["right"] }) {
  const getBar = () => {
    switch (bar) {
      case "single":
        return <div className="w-px h-full bg-foreground absolute top-0 right-0" />;
      case "repeatClose":
        return <div className="w-1 h-full border-x border-foreground absolute top-0 -right-0.5" />;
      case "sectionClose":
        return (
          <div className="w-3 h-full border-r-2 border-foreground absolute top-0 -right-0.5 rounded-lg flex items-center text-foreground text-center justify-center">
            <span>:</span>
          </div>
        );
      case "final":
        return (
          <>
            <span className="h-full flex items-center pr-1 text-foreground">:</span>
            <div className="w-1 h-full border-x border-foreground absolute top-0 -right-0.5" />
          </>
        );
    }
  };
  return (
    <div className="relative h-full opacity-50" id={`bar-${bar}`}>
      {getBar()}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="w-fit aspect-square border bg-popover paragraph-md rounded-xs text-secondary font-mono font-bold flex items-center justify-center opacity-60">
      {label}
    </div>
  );
}

function VoltaBracket({ volta }: { volta?: number }) {
  return (
    <div className="absolute inset-0 h-[30%] w-[60%] left-1 -top-1 border-1 border-r-0 border-b-0 border-foreground text-foreground opacity-50">
      <p className="paragraph-sm px-1 font-bold">{volta}.</p>
    </div>
  );
}
