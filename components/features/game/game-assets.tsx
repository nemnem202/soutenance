import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Columns3, Grid3X3, Maximize, Minimize } from "lucide-react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CustomInputGroupInput,
  InputGroup,
  InputGroupAddon,
} from "@/components/molecules/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/molecules/tooltip";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider, type SliderProps } from "@/components/ui/slider";
import useScreen from "@/hooks/use-screen";
import useGame from "@/hooks/use-game";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/organisms/select";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action } from "@/midi-editor/types/actions";
import {
  PlayButton,
  StopButton,
  ZoomInButton,
  ZoomOutButton,
} from "@/components/ui/custom-buttons";
import { CustomInput } from "@/components/ui/custom_input";
import { logger } from "@/lib/logger";
import { Field, FieldLabel } from "@/components/molecules/field";
import { useLanguage } from "@/hooks/use-language";
import { Separator } from "@/components/ui/separator";
import AnimatedTabs from "@/components/organisms/animated-tabs";
import type { TabID } from "@/providers/game-provider";
import { MidiInstrumentNumber } from "@/midi-editor/types/instruments";
import useAudio from "@/hooks/use-audio";
import PianoChordDiagram from "./piano-chord-diagram";
import { ClientOnly } from "vike-react/ClientOnly";
import { Chord } from "@/types/music";
import { CellSchema, ChordSchema, MeasureSchema } from "@/types/entities";
import { chordCellsWithTransposition, chordToString } from "@/lib/utils";
import { trackIsDrums } from "@/midi-editor/lib/utils";

export function ControlsSection({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 w-fit h-12 px-5 bg-card rounded-md items-center select-none">
      {children}
    </div>
  );
}

export function SidebarTabButton({
  text,
  isActive,
  onClick = () => {},
  props = {},
  disabled = false,
}: {
  text: string;
  isActive: boolean;
  onClick?: () => void;
  props?: ButtonProps;
  disabled?: boolean;
}) {
  return (
    <Button
      className={`bg-transparent text-[0.885rem] font-bold md:text-[1.115rem] h-8 md:h-12 text-foreground flex items-center justify-start text-left hover:bg-popover p-2 rounded ${isActive && "text-primary fill-primary transition"}`}
      onClick={onClick}
      {...props}
    >
      {text}
      {disabled && (
        <span className="paragraph-sm text-muted-foreground ml-5 hidden md:block">upcoming</span>
      )}
    </Button>
  );
}

export function SidebarSlider({
  children,
  axis = "y",
  ...props
}: SliderProps & {
  children: ReactNode;
  axis?: "y" | "x";
}) {
  const [valueIsZero, setValueIsZero] = useState<boolean>(props.defaultValue?.[0] === 0);
  const id = useId();
  return (
    <div className={`flex items-center gap-2 ${axis === "y" && "flex-col items-start"}`}>
      <Label
        htmlFor={id}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </Label>
      <Slider
        {...props}
        onValueChange={(v) => {
          if (v[0] === 0 && !valueIsZero) {
            setValueIsZero(true);
          } else if (v[0] !== 0 && valueIsZero) {
            setValueIsZero(false);
          }
          props.onValueChange?.(v);
        }}
      />
    </div>
  );
}

export function SmallInput({
  label,
  icon,
  align = "inline-start",
  containerClassName,
  tooltip,
  defaultValue,
  onBlur,
  ...props
}: {
  label: string;
  containerClassName?: string;
  icon?: ReactNode;
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
  tooltip?: ReactNode;
} & ComponentProps<"input">) {
  const id = useId();
  const isMobile = useScreen().size === "sm";

  const [localValue, setLocalValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (defaultValue !== undefined) {
      setLocalValue(defaultValue);
    }
  }, [defaultValue]);

  if (tooltip && !isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex flex-col gap-2 p-1 ${containerClassName}`}>
            <Label className="paragraph-sm cursor-pointer !text-left" htmlFor={id}>
              {label}
            </Label>
            <InputGroup className="w-full border-none !bg-popover h-full !rounded-xs">
              <CustomInputGroupInput
                id={id}
                {...props}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={onBlur}
                className={`paragraph-sm h-6 full !rounded-xs text-left! ${!icon && "pl-1"}`}
              />
              {icon ? (
                <InputGroupAddon align={align} className="pl-1">
                  {icon}
                </InputGroupAddon>
              ) : (
                <InputGroupAddon align={align} />
              )}
            </InputGroup>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  } else {
    return (
      <div className={`flex flex-col gap-2 p-1 ${containerClassName}`}>
        <Label className="paragraph-sm cursor-pointer" htmlFor={id}>
          {label}
        </Label>
        <InputGroup className="w-full border-none !bg-popover h-full !rounded-xs">
          <CustomInputGroupInput
            id={id}
            {...props}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={onBlur}
            className={`paragraph-sm h-6 full !rounded-xs text-left! ${!icon && "pl-1"}`}
          />
          {icon ? (
            <InputGroupAddon align={align} className="pl-1">
              {icon}
            </InputGroupAddon>
          ) : (
            <InputGroupAddon align={align} />
          )}
        </InputGroup>
      </div>
    );
  }
}

export function SmallCheckboxGroup({
  label,
  checkboxProps,
  labelProps,
}: {
  label: string;
  checkboxProps?: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;
  labelProps?: ComponentProps<"label">;
}) {
  const id = useId();
  return (
    <div className="flex gap-2">
      <Label htmlFor={id} className={`paragraph ${labelProps?.className}`} {...labelProps}>
        {label}
      </Label>
      <Checkbox id={id} {...checkboxProps} />
    </div>
  );
}

export function FullScreenButton({
  fullScreen,
  setFullScreen,
}: {
  fullScreen: boolean;
  setFullScreen: (full: boolean) => void;
}) {
  return (
    <Button variant={"ghost"} onClick={() => setFullScreen(!fullScreen)}>
      {fullScreen ? (
        <Minimize className=" stroke-muted-foreground !hover:stroke-foreground" />
      ) : (
        <Maximize className=" stroke-muted-foreground !hover:stroke-foreground" />
      )}
    </Button>
  );
}

export function Tab({ children }: { children: ReactNode }) {
  const [fullScreen, setFullScreen] = useState(false);
  const { activeTab, tabs, setActiveTab } = useGame();
  const { audioLoaded } = useAudio();
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleFullScreen = (value: boolean) => {
    if (value) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setFullScreen(value);
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!fullScreen) {
      setIsIdle(false);
      return;
    }

    const handleMouseMove = () => {
      setIsIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 1500);
    };

    handleMouseMove();

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fullScreen]);

  const interactiveProps = { role: "region", tabIndex: 0 };
  if (!audioLoaded)
    return (
      <div className="size-full flex items-center justify-center">
        <p className="paragraph">Click anywhere to start</p>
      </div>
    );
  if (!fullScreen) {
    return (
      <div
        {...interactiveProps}
        className="md:size-full md:bg-card md:rounded-md relative overflow-hidden group min-h-0"
      >
        <div className="hidden z-10 absolute p-2 top-0 right-0 inset-0 transition opacity-0 group-hover:opacity-100 md:flex flex-col justify-between items-end pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {activeTab === "piano-roll" && <ZoomButtons />}
            {activeTab === "piano-roll" && <TrackSelect />}
            <FullScreenButton fullScreen={fullScreen} setFullScreen={handleFullScreen} />
          </div>
          {(activeTab === "chords-grid" || activeTab === "chords-carousel") && (
            <div className="pointer-events-auto">
              <ChordDisplaySelector />
            </div>
          )}
          {activeTab === "piano-roll" && <div />}
        </div>
        <div className="z-0 h-full min-h-0 flex flex-col justify-end">{children}</div>
      </div>
    );
  } else {
    return (
      <div
        {...interactiveProps}
        className={`inset-0 absolute top-0 left-0 z-100 bg-background group min-h-0 p-5 transition-all ${
          isIdle ? "cursor-none" : ""
        }`}
      >
        <div
          className={`z-10 absolute top-0 left-0 w-full transition-opacity duration-300 flex flex-col justify-between p-2 ${
            isIdle ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex justify-between items-center w-full ">
            <div className="flex gap-3 flex-1 justify-start items-center">
              <PlayButton />
              <StopButton />
              <Separator orientation="vertical" className="!h-6" />
              <BpmControl />
            </div>
            <div className="flex-1 flex h-fit justify-center">
              <AnimatedTabs
                activeTab={activeTab}
                onChange={(v) => setActiveTab(v as TabID)}
                tabs={tabs}
                variant="pill"
              />
            </div>
            <div className="flex gap-3 flex-1 justify-end">
              {activeTab === "piano-roll" && <ZoomButtons />}
              {activeTab === "piano-roll" && (
                <div className="w-max-50">
                  <TrackSelect />
                </div>
              )}
              <FullScreenButton fullScreen={fullScreen} setFullScreen={handleFullScreen} />
            </div>
          </div>
          <div></div>
        </div>
        <div
          className={`z-0 md:h-full md:min-h-0 ${activeTab !== "piano-roll" && "pt-12"} flex flex-col gap-5`}
        >
          {children}
          <ChordsDiagramsView />
        </div>
      </div>
    );
  }
}

export function TrackSelect() {
  const { state, dispatch } = useMidiStore();

  if (!state || state.tracks.filter((t) => trackIsDrums(t.family)).length <= 0) return;

  return (
    <Select
      defaultValue={String(state.currentTrackId)}
      onValueChange={(value) =>
        dispatch({
          type: Action.CHANGE_CURRENT_TRACK,
          trackId: parseInt(value, 10),
        })
      }
    >
      <SelectTrigger className="w-full" onClick={(e) => e.stopPropagation()}>
        <SelectValue className="text-left" />
      </SelectTrigger>
      <SelectContent className="z-200 ">
        <SelectGroup>
          {state.tracks.flatMap(
            (track) =>
              !trackIsDrums(track.family) && (
                <SelectItem
                  value={String(track.id)}
                  key={track.id}
                  onClick={(e) => e.stopPropagation()}
                >
                  {MidiInstrumentNumber[track.id].split(/(?=[A-Z])/).join(" ")}
                </SelectItem>
              )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function BpmControl() {
  const { instance } = useLanguage();
  const { state, dispatch } = useMidiStore();
  return (
    <Field className="flex flex-row items-center justify-center !w-min">
      <CustomInput
        id="bpm"
        type="number"
        disabled={!state}
        defaultValue={state ? Math.floor(state.config.bpm) : undefined}
        onBlur={(e) => {
          let value = parseInt(e.currentTarget.value, 10);
          if (value < 30) value = 30;
          if (value > 500) value = 500;
          e.currentTarget.value = value.toString();
          dispatch({ type: Action.SET_BPM, bpm: value });
        }}
        className="!w-15 min-w-0 p-0 text-center"
      />
      <FieldLabel htmlFor="bpm" className="!w-min text-muted-foreground paragraph-small">
        {instance.getItem("bpm").toLowerCase()}
      </FieldLabel>
    </Field>
  );
}

export function ZoomButtons() {
  const { dispatch, state } = useMidiStore();
  return (
    <div className="flex gap-1 border rounded-md bg-background h-10 items-center">
      <ZoomInButton
        onClick={(e) => {
          e.stopPropagation();
          dispatch({
            type: Action.ZoomY,
            zoomY: Math.min(100, (state?.display.zoomY ?? 0) + 10),
          });
        }}
      />
      <ZoomOutButton
        onClick={(e) => {
          e.stopPropagation();
          dispatch({
            type: Action.ZoomY,
            zoomY: Math.max(0, (state?.display.zoomY ?? 0) - 10),
          });
        }}
      />
    </div>
  );
}

export function ChordDisplaySelector() {
  const { setActiveTab, activeTab } = useGame();

  return (
    <div className="border rounded-md flex items-center h-10 overflow-hidden ">
      <button
        type="button"
        onClick={() => setActiveTab("chords-carousel")}
        className={`cursor-pointer w-full h-full flex justify-center items-center px-2 ${activeTab === "chords-grid" && "text-muted-foreground bg-popover"}`}
      >
        <Columns3 />
      </button>
      <Separator orientation="vertical" />
      <button
        type="button"
        onClick={() => setActiveTab("chords-grid")}
        className={`cursor-pointer w-full h-full flex justify-center items-center px-2 ${activeTab === "chords-carousel" && "text-muted-foreground bg-popover"}`}
      >
        <Grid3X3 />
      </button>
    </div>
  );
}

export function RepeatsDisplay() {
  const { state } = useMidiStore();

  if (!state || !state.config.loop || state.config.repeats === 0) return null;
  return (
    <>
      <Separator orientation="vertical" className="!h-6" />
      <div className="flex">
        <p className="font-mono semibold text-muted-foreground whitespace-nowrap">
          {state.config.loop.currentRepeatIndex}/
          {state.config.repeats !== Infinity ? state.config.repeats : "∞"}
        </p>
      </div>
    </>
  );
}

export function ChordsDiagramsView() {
  const { state } = useMidiStore();
  const { exercise } = useGame();
  const { size } = useScreen();

  const allMeasures = useMemo<MeasureSchema[]>(() => {
    if (!exercise.chordsGrid) return [];
    return exercise.chordsGrid.sections.flatMap((section) => [
      ...section.commonMeasures,
      ...section.voltas.flatMap((volta) => volta.measures),
    ]);
  }, [exercise.chordsGrid]);

  const currentChords = useMemo<Chord[]>(() => {
    if (!state || !allMeasures.length) return [];

    const currentMeasureIndex = state.transport.currentMeasureIndex;
    const currentMeasure = allMeasures.find((m) => m.index === currentMeasureIndex);
    if (!currentMeasure) return [];

    // Applique la transposition comme dans MeasureBlock
    const transposedCells = chordCellsWithTransposition(
      currentMeasure.cells,
      state.config.transposition ?? 0
    );

    const rawChords = transposedCells
      .filter((cell) => cell.kind === "Chord" && cell.chord)
      // @ts-expect-error
      .map((cell) => (cell as CellSchema).chord!);

    const findFallbackChord = (startIndex: number): ChordSchema | null => {
      for (let i = startIndex - 1; i >= 0; i--) {
        const prevMeasure = allMeasures.find((m) => m.index === i);
        const chordCell = prevMeasure?.cells.find(
          (cell) => cell.kind === "Chord" && cell.chord?.content.note !== "%"
        );
        // @ts-expect-error
        if (chordCell?.chord) return (chordCell as CellSchema).chord;
      }
      return null;
    };

    const processedChords: ChordSchema[] = [];

    rawChords.forEach((chord, index) => {
      if (chord.content.note === "%") {
        if (index > 0) {
          processedChords.push(processedChords[processedChords.length - 1]);
        } else {
          const fallback = findFallbackChord(currentMeasureIndex);
          if (fallback) processedChords.push(fallback);
        }
      } else {
        processedChords.push(chord);
      }
    });

    return processedChords;
  }, [state?.transport.currentMeasureIndex, state?.config.transposition, allMeasures]);

  if (
    !state ||
    (!state.config.displayPianoDiagrams && !state.config.displayGuitarDiagrams) ||
    size === "sm"
  ) {
    return null;
  }

  return (
    <ClientOnly>
      <div className="h-30 w-full flex md:flex-row flex-col justify-center gap-2 md:pb-0 pb-5">
        {currentChords.map((chord, index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="whitespace-nowrap font-mono bold text-primary">{chordToString(chord)}</p>
            <PianoChordDiagram chord={chord} />
          </div>
        ))}
      </div>
    </ClientOnly>
  );
}
