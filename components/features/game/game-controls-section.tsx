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
  return (
    <div className="hidden md:block">
      <ControlsSection>
        <SettingsButton onClick={() => props.toggleSidebar()} />
        <PlayButton />
        <StopButton />
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

  const handlePlay = () => {
    const status = midiState?.transport.status;

    if (status === "playing" || status === "counting") {
      dispatch({ type: Action.SET_TRANSPORT_STATUS, status: "paused" });
    } else {
      // Si l'exercice a le count-in activé dans sa config
      const nextStatus = midiState?.config.countInActive ? "counting" : "playing";
      dispatch({ type: Action.SET_TRANSPORT_STATUS, status: nextStatus });
    }
  };
  return (
    <div className=" flex w-full justify-evenly">
      {isHorizontal && <div className="w-40" />}

      <SettingsButton onClick={() => props.toggleSidebar()} />

      {midiState && (
        <>
          <StopButton onClick={() => dispatch({ type: Action.STOP })} />
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
