import useScreen from "@/hooks/use-screen";
import { faker } from "@faker-js/faker";
import { AutoTextSize } from "auto-text-size";

export default function ChordGrid() {
  return (
    <div className="size-full p-2 md:p-5 flex flex-col gap-5">
      <Section label="A" />
      <Section label="B" />
    </div>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel label={label} />
      <div className="w-full grid grid-cols-4 items-center items-center gap-x-0 gap-x-2 md:gap-x-4 gap-y-5 ">
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
    <div className="flex text-[2rem] items-center gap-4 w-full">
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center">
          <ChordCellGroup />
          <div className="h-12 bg-muted-foreground/60 w-px  md:translate-x-2 translate-x-1" />
        </div>
        <MeasureComment />
      </div>
    </div>
  );
}

function MeasureComment() {
  return (
    <p className="whitespace-nowrap text-muted-foreground text-ellipsis h-6 paragraph-md w-full overflow-hidden">
      {faker.lorem.lines(1)}
    </p>
  );
}

function ChordCellGroup() {
  return (
    <div className="flex gap-1 w-full grid grid-cols-4">
      <ChordNameCell text="Db 7sus4b9b13" />
      <ChordNameCell text="%" />
      <ChordNameCell text="C maj7" />
      <ChordNameCell text="%" />
    </div>
  );
}

function ChordNameCell({ text }: { text: string }) {
  const screen = useScreen();
  return (
    <div className="row-1 md:border w-full rounded-sm flex items-center justify-center h-12 md:px-1">
      <div className=" text-[2rem] w-full flex  items-center justify-center ">
        <AutoTextSize
          className="font-mono font-semibold "
          mode={screen === "sm" ? "multiline" : "oneline"}
          minFontSizePx={screen === "sm" ? undefined : 1}
          maxFontSizePx={screen === "sm" ? 12 : 16}
        >
          {text}
        </AutoTextSize>
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
