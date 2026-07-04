import { Separator } from "@/components/ui/separator";
import {
  BpmControl,
  ControlsSection,
  RepeatsDisplay,
  TrackSelect,
  ZoomButtons,
} from "./game-assets";
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
        ? (<ZoomButtons />)!
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
