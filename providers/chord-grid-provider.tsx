import type { MeasureWithLoopIndexes, SectionWithLoopIndexes } from "@/lib/computeLoopIndexes";
import { logger } from "@/lib/logger";
import SoundEngine from "@/midi-editor/engines/sound-engine";
import { convertSecondsToTick, getCurrentMeasureIndex } from "@/midi-editor/lib/utils";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { timeSignatureSchema } from "@/schemas/entities.schema";
import type { ExerciseSchema, TimeSignatureSchema } from "@/types/entities";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

const ChordGridContext = createContext<{ currentMeasure: number } | null>(null);

export default function ChordGridProvider({
  children,
  sectionsWithLoopIndexes,
  exercise,
}: {
  children: ReactNode;
  sectionsWithLoopIndexes: SectionWithLoopIndexes[];
  exercise: ExerciseSchema;
}) {
  const { state } = useMidiStore();
  const requestRef = useRef<number>(null);
  const [currentMeasure, setCurrentMeasure] = useState(0);
  const [currentTimeSignature, setCurrentTimeSignature] = useState<TimeSignatureSchema>({
    top: exercise.defaultConfig.timeSignatureTop ?? 4,
    bottom: exercise.defaultConfig.timeSignatureBottom ?? 4,
  });
  useEffect(() => {
    const loop = () => {
      const soundInstance = SoundEngine.get();
      if (!soundInstance || !state?.transport.isPlaying) {
        return () => {
          requestRef.current && cancelAnimationFrame(requestRef.current);
        };
      }
      const time = convertSecondsToTick(
        soundInstance.currentTime,
        soundInstance.currentTempo,
        state.config.ppq
      );

      const nextMeasure = getCurrentMeasureIndex(state.config.ppq, time, currentTimeSignature);
      if (nextMeasure !== currentMeasure) {
        const foundedMeasure: MeasureWithLoopIndexes | undefined = sectionsWithLoopIndexes
          .flatMap((section) => [
            ...section.commonMeasures,
            ...section.voltas.flatMap((volta) => volta.measures),
          ])
          .find((measure) => measure.inLoopIndexes.includes(nextMeasure));

        const cellWithTimeSigInFoundedMeasure = foundedMeasure?.cells.find(
          (cell) => cell.timeSignatureChangeTop && timeSignatureSchema
        );

        if (cellWithTimeSigInFoundedMeasure) {
          const timeSig = {
            top: cellWithTimeSigInFoundedMeasure.timeSignatureChangeTop!,
            bottom: cellWithTimeSigInFoundedMeasure.timeSignatureChangeBottom!,
          };
          logger.info("New time signature founded !", timeSig);
          setCurrentTimeSignature(timeSig);
        }

        setCurrentMeasure(nextMeasure);
      }

      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    };
  }, [state, currentTimeSignature, currentMeasure, sectionsWithLoopIndexes.flatMap]);

  return (
    <ChordGridContext.Provider value={{ currentMeasure }}>{children}</ChordGridContext.Provider>
  );
}

export function useChordGrid() {
  const context = useContext(ChordGridContext);
  if (!context) throw new Error("Use chord grid must be used within it's provider");
  return context;
}
