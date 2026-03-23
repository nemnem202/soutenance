import { AutoTextSize } from "auto-text-size";

export default function ChordGrid() {
  return (
    <div className="size-full">
      <div className="w-full grid grid-cols-4 items-center  items-center p-5">
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock /> <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock /> <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock />
        <MeasureBlock /> <MeasureBlock />
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
        <Section />
        <ChordCellGroup />
        <MeasureComment />
      </div>
    </div>
  );
}

function MeasureComment() {
  return (
    <p className="whitespace-nowrap text-ellipsis h-6 text-[1rem] w-full overflow-hidden">
      Est nisi id nisi velit non laboris ullamco cupidatat ea voluptate veniam veniam. Est nisi id nisi velit non
      laboris ullamco cupidatat ea voluptate veniam veniam. Est nisi id nisi velit non laboris ullamco cupidatat ea
      voluptate veniam veniam.
    </p>
  );
}

function ChordCellGroup() {
  return (
    <div className="flex gap-1 w-full pr-2 grid grid-cols-4">
      <ChordNameCell text="Db maj7 alt4" />
      <ChordNameCell text="%" />
      <ChordNameCell text="C maj7" />
      <ChordNameCell text="%" />
    </div>
  );
}

function ChordNameCell({ text }: { text: string }) {
  return (
    <div className="row-1 border w-full rounded-sm flex items-center justify-center px-2">
      <div className=" text-[2rem] w-full flex  items-center justify-center">
        <AutoTextSize className="font-mono font-semibold" maxFontSizePx={32}>
          {text}
        </AutoTextSize>
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="w-full">
      <SectionLabel />
    </div>
  );
}

function SectionLabel() {
  return (
    <div className="w-10 aspect-square border bg-popover text-[1.5rem] rounded-sm text-primary font-mono font-bold flex items-center justify-center">
      A
    </div>
  );
}
