import type { SectionSchema, MeasureSchema } from "@/types/entities";

export type MeasureWithLoopIndexes = MeasureSchema & {
  inLoopIndexes: number[];
};

export type SectionWithLoopIndexes = Omit<SectionSchema, "commonMeasures" | "voltas"> & {
  commonMeasures: MeasureWithLoopIndexes[];
  voltas: { volta: number; measures: MeasureWithLoopIndexes[] }[];
};

/**
 * Simule le déroulé linéaire du fichier MIDI généré par MMA
 * et assigne à chaque mesure les positions MIDI qu'elle occupe.
 */
export function computeLoopIndexes(sections: SectionSchema[]): SectionWithLoopIndexes[] {
  const midiPositions = new Map<number, Set<number>>();
  let cursor = 0;

  const track = (measureIndex: number) => {
    if (!midiPositions.has(measureIndex)) {
      midiPositions.set(measureIndex, new Set());
    }
    midiPositions.get(measureIndex)?.add(cursor);
    cursor++;
  };

  for (const section of [...sections].sort((a, b) => a.index - b.index)) {
    const hasVoltas = section.voltas.length > 0;
    const sortedCommon = [...section.commonMeasures].sort((a, b) => a.index - b.index);

    if (hasVoltas) {
      const sortedVoltas = [...section.voltas].sort((a, b) => a.volta - b.volta);

      for (const volta of sortedVoltas) {
        for (const m of sortedCommon) track(m.index);
        for (const m of [...volta.measures].sort((a, b) => a.index - b.index)) track(m.index);
      }
    } else {
      let i = 0;
      while (i < sortedCommon.length) {
        const measure = sortedCommon[i];

        if (measure.bars.left === "loopOpen") {
          const closeIndex = sortedCommon.findIndex(
            (m, idx) => idx >= i && m.bars.right === "loopClose"
          );
          const end = closeIndex === -1 ? sortedCommon.length - 1 : closeIndex;
          const group = sortedCommon.slice(i, end + 1);

          for (const m of group) track(m.index);
          for (const m of group) track(m.index);

          i = end + 1;
        } else {
          track(measure.index);
          i++;
        }
      }
    }
  }

  const inject = (m: MeasureSchema): MeasureWithLoopIndexes => ({
    ...m,
    inLoopIndexes: Array.from(midiPositions.get(m.index) ?? []),
  });

  return sections.map((section) => ({
    ...section,
    commonMeasures: section.commonMeasures.map(inject),
    voltas: section.voltas.map((v) => ({
      ...v,
      measures: v.measures.map(inject),
    })),
  }));
}
