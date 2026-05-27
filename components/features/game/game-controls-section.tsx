import { Separator } from "@/components/ui/separator";
import { BpmControl, ControlsSection, RepeatsDisplay, TrackSelect } from "./game-assets";
import useGame from "@/hooks/use-game";
import {
  MetronomeButton,
  PlayButton,
  SettingsButton,
  StopButton,
  ZoomInButton,
  ZoomOutButton,
} from "@/components/ui/custom-buttons";
import { Action } from "@/midi-editor/types/actions";
import useScreen from "@/hooks/use-screen";
import useAudio from "@/hooks/use-audio";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";

interface Gameprops {
  toggleSidebar: () => void;
}

export default function DesktopGameControlsSection({ ...props }: Gameprops) {
  const { audioLoaded } = useAudio();
  return (
    <div className="hidden md:block">
      <ControlsSection>
        <SettingsButton onClick={() => props.toggleSidebar()} />
        <PlayButton disabled={!audioLoaded} />
        <StopButton disabled={!audioLoaded} />
        <Separator orientation="vertical" className="!h-6" />
        <BpmControl />
        <RepeatsDisplay />
      </ControlsSection>
    </div>
  );
}

export function MobileGameControlSection({ ...props }: Gameprops) {
  const { activeTab } = useGame();
  const { state, dispatch } = useMidiStore();
  const isHorizontal = useScreen().orientation === "horizontal";
  return (
    <div className=" flex w-full justify-evenly">
      {isHorizontal && activeTab === "piano-roll"
        ? (
            <div className="flex gap-1 border rounded-md">
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
          )!
        : isHorizontal && <div className="w-40" />}

      <SettingsButton onClick={() => props.toggleSidebar()} />

      {state && (
        <>
          <StopButton />
          <PlayButton />
          <MetronomeButton />

          {isHorizontal &&
            (activeTab === "piano-roll" ? (
              <div className="w-40">
                <TrackSelect />
              </div>
            ) : (
              <div className="w-40" />
            ))}
        </>
      )}
    </div>
  );
}
