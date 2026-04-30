import { Field, FieldLabel } from "@/components/molecules/field";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import { ControlsSection } from "./game-assets";
import { CustomInput } from "@/components/ui/custom_input";
import useGame from "@/hooks/use-game";
import {
  MetronomeButton,
  PlayButton,
  SettingsButton,
  StopButton,
} from "@/components/ui/custom-buttons";
import { Action } from "@/midi-editor/types/actions";
import { logger } from "@/lib/logger";

interface Gameprops {
  toggleSidebar: () => void;
}

export default function DesktopGameControlsSection({ ...props }: Gameprops) {
  const { instance } = useLanguage();
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
        <Field className="flex flex-row items-center justify-center !w-min">
          <CustomInput
            id="bpm"
            type="number"
            disabled={!midiState}
            defaultValue={midiState ? Math.floor(midiState.config.bpm) : undefined}
            onBlur={(e) => {
              let value = parseInt(e.currentTarget.value, 10);
              if (value < 30) value = 30;
              if (value > 500) value = 500;
              e.currentTarget.value = value.toString();
              logger.info("New bpm is set to: ", value);
              dispatch({ type: Action.SET_BPM, bpm: value });
            }}
            className="!w-15 min-w-0 p-0 text-center"
          />
          <FieldLabel htmlFor="bpm" className="!w-min text-muted-foreground paragraph-small">
            {instance.getItem("bpm").toLowerCase()}
          </FieldLabel>
        </Field>
      </ControlsSection>
    </div>
  );
}

export function MobileGameControlSection({ ...props }: Gameprops) {
  const { midiState, dispatch } = useGame();
  return (
    <div className=" flex w-full justify-evenly">
      <SettingsButton onClick={() => props.toggleSidebar()} />
      {midiState && (
        <>
          <StopButton onClick={() => dispatch({ type: Action.STOP })} />
          <PlayButton
            onClick={() => dispatch({ type: Action.TOGGLE_PLAY })}
            isPlaying={!!midiState?.transport.isPlaying}
          />
          <MetronomeButton />
        </>
      )}
    </div>
  );
}
