import { faker } from "@faker-js/faker";
import { useData } from "vike-react/useData";
import useScreen from "@/hooks/use-screen";
import type { Data } from "@/pages/+data";
import type { CarouselChord, Note } from "@/types/music";

export default function ChordGrid() {
  return (
    <div className="size-full p-0 md:p-4 flex flex-col gap-5">
      <Section label="A" />
      <Section label="B" />
    </div>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel label={label} />
      <div className="w-full grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-y-2">
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
      </div>
    </div>
  );
}

function MeasureBlock() {
  return (
    <div className="flex w-full h-12 relative">
      <ChordCellGroup />
      <div className="absolute -right-[0.5px] top-0 h-12 bg-muted-foreground/50 w-[2px]" />
    </div>
  );
}

function ChordCellGroup() {
  const screen = useScreen();
  const chordsPlaceholder = useData<Data>().chordsPlaceholders;
  const chords: (CarouselChord | undefined)[] = Array(4).fill(undefined);

  const count = faker.number.int({ min: 0, max: 4 });

  const randomChords = faker.helpers.arrayElements(chordsPlaceholder, count);
  const indices = faker.helpers.arrayElements([0, 1, 2, 3], count);

  indices.forEach((index, i) => {
    chords[index] = randomChords[i];
  });
  const visibleChords = chords.filter((c) => c || screen !== "sm");
  const columnCount = visibleChords.length;

  if (columnCount === 0)
    return (
      <div className="w-full">
        <ChordNameCell root={"%"} />
      </div>
    );
  return (
    <div className="flex w-full">
      {chords.map(
        (chord) =>
          chord && (
            <ChordNameCell
              key={chord.tickStart}
              root={chord.root}
              harm={chord?.harm?.symbolLabel}
            />
          ),
      )}
    </div>
  );
}

function ChordNameCell({
  root,
  harm,
}: {
  root: Note | undefined;
  harm?: string;
}) {
  return (
    <div className=" w-[25%] px-0.5 md:px-2 h-full overflow-hidden">
      <div className=" rounded-md h-full w-full flex items-center ">
        <p className="whitespace-nowrap font-mono semibold text-xl flex lg:gap-1">
          <span>{root}</span>
          {harm && (
            <span className="text-muted-foreground  paragraph-sm max-w[50%]">
              {harm}
            </span>
          )}
        </p>
      </div>
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
