import { Separator } from "@/components/ui/separator";
import { BpmControl, ControlsSection, TrackSelect } from "./game-assets";
import useGame from "@/hooks/use-game";
import {
  MetronomeButton,
  PlayButton,
  SettingsButton,
  StopButton,
} from "@/components/ui/custom-buttons";
import { Action } from "@/midi-editor/types/actions";
import useScreen from "@/hooks/use-screen";

interface Gameprops {
  toggleSidebar: () => void;
}

export default function DesktopGameControlsSection({ ...props }: Gameprops) {
  const { midiState, dispatch } = useGame();
  return (
    <div className="hidden md:block">
      <ControlsSection>
        <SettingsButton onClick={() => props.toggleSidebar()} />
        <PlayButton
          onClick={() => dispatch({ type: Action.TOGGLE_PLAY })}
          isPlaying={!!midiState?.transport.isPlaying}
        />
        <StopButton onClick={() => dispatch({ type: Action.STOP })} />
        <Separator orientation="vertical" className="!h-6" />
        <BpmControl />
      </ControlsSection>
    </div>
  );
}

export function MobileGameControlSection({ ...props }: Gameprops) {
  const { activeTab } = useGame();
  const { midiState, dispatch } = useGame();
  const isHorizontal = useScreen().orientation === "horizontal";
  return (
    <div className=" flex w-full justify-evenly">
      {isHorizontal && <div className="w-40" />}

      <SettingsButton onClick={() => props.toggleSidebar()} />

      {midiState && (
        <>
          <StopButton onClick={() => dispatch({ type: Action.STOP })} />
          <PlayButton
            onClick={() => dispatch({ type: Action.TOGGLE_PLAY })}
            isPlaying={!!midiState?.transport.isPlaying}
          />
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
