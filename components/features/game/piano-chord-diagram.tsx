import { Application, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";
import { findChordFromModifier } from "@/config/chords-dictionary";

import { Chord } from "@/types/music";
import { indexesOfNotes, notes } from "@/schemas/entities.schema";
import { logger } from "@/lib/logger";

const BLACK_SEMITONES = new Set([1, 3, 6, 8, 10]);

function getPrimaryColor(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

  if (raw.startsWith("#")) return parseInt(raw.slice(1), 16);

  return 0x6366f1;
}

export default function PianoChordDiagram({ chord }: { chord: Chord }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const gfxRef = useRef<Graphics | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new Application();
    appRef.current = app;

    app
      .init({
        backgroundAlpha: 1,
        backgroundColor: 0xffffff,
        resizeTo: containerRef.current,
        antialias: false,
        preference: "webgl",
      })
      .then(() => {
        if (!containerRef.current) return;
        containerRef.current.appendChild(app.canvas);

        const gfx = new Graphics();
        app.stage.addChild(gfx);
        gfxRef.current = gfx;

        drawDiagram();

        app.renderer.on("resize", drawDiagram);
      });

    return () => {
      appRef.current?.destroy(true, { children: true, texture: true });
      appRef.current = null;
      gfxRef.current = null;
    };
  }, []);

  useEffect(() => {
    drawDiagram();
  }, [chord]);

  function drawDiagram() {
    const app = appRef.current;
    const gfx = gfxRef.current;
    if (!app || !gfx || !app.renderer) return;

    gfx.clear();

    const rawIntervals: number[] = findChordFromModifier(chord.content.modifier)?.intervals ?? [];
    const rootAsIndex = indexesOfNotes[chord.content.note];
    if (rawIntervals.length === 0 || rootAsIndex < 0) return;

    const absoluteIntervals = rawIntervals.map((i) => i + rootAsIndex);

    const highlightedAbsolute = new Set([rootAsIndex, ...absoluteIntervals]);

    const maxInterval = Math.max(...absoluteIntervals);
    const numberOfOctaves = Math.max(2, Math.floor(maxInterval / 12) + 1);
    const totalWhiteKeys = 7 * numberOfOctaves;

    const W = app.renderer.width;
    const H = app.renderer.height;
    const whiteW = W / totalWhiteKeys;
    const blackW = whiteW * 0.55;
    const blackH = H * 0.62;
    const primaryColor = getPrimaryColor();

    for (let i = 0; i < totalWhiteKeys; i++) {
      const absoluteSemitone = whiteIndexToAbsoluteSemitone(i);
      const isHighlighted = highlightedAbsolute.has(absoluteSemitone);

      if (isHighlighted) {
        gfx.rect(i * whiteW, 0, whiteW, H);
        gfx.fill(primaryColor);
      }

      gfx.rect(i * whiteW, 0, whiteW, H);
      gfx.stroke({ color: 0x000000, width: 1, pixelLine: true });
    }

    for (let octave = 0; octave < numberOfOctaves; octave++) {
      for (const semitone of BLACK_SEMITONES) {
        const absoluteSemitone = octave * 12 + semitone;
        const whiteKeysBefore = countWhiteKeysBefore(semitone);
        const globalWhiteIdx = octave * 7 + whiteKeysBefore;
        const x = globalWhiteIdx * whiteW - blackW / 2;
        const isHighlighted = highlightedAbsolute.has(absoluteSemitone);

        gfx.rect(x, 0, blackW, blackH);
        gfx.fill(isHighlighted ? primaryColor : 0x000000);
      }
    }
  }

  return <div ref={containerRef} className="flex-1 overflow-hidden max-w-200 rounded-md" />;
}

function whiteIndexToAbsoluteSemitone(whiteIndex: number): number {
  const octave = Math.floor(whiteIndex / 7);
  const pos = whiteIndex % 7;
  const semitoneInOctave = [0, 2, 4, 5, 7, 9, 11][pos];
  return octave * 12 + semitoneInOctave;
}
function countWhiteKeysBefore(semitone: number): number {
  const map: Record<number, number> = {
    1: 1,
    3: 2,
    6: 4,
    8: 5,
    10: 6,
  };
  return map[semitone] ?? 0;
}
