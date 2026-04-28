import { Field, FieldLabel } from "@/components/molecules/field";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import { ControlsSection } from "./game-assets";
import { CustomInput } from "@/components/ui/custom_input";
import useGame from "@/hooks/use-game";
import { PlayButton, SettingsButton, StopButton } from "@/components/ui/custom-buttons";

interface Gameprops {
  toggleSidebar: () => void;
}

export default function DesktopGameControlsSection({ ...props }: Gameprops) {
  const { instance } = useLanguage();
  const { audioReady, togglePlay, midiState } = useGame();
  return (
    <div className="hidden md:block">
      <ControlsSection>
        <SettingsButton onClick={() => props.toggleSidebar()} />
        <PlayButton
          disabled={!audioReady}
          onClick={togglePlay}
          isPlaying={!!midiState?.config.isPlaying}
        />
        <StopButton disabled={!audioReady} />
        <Separator orientation="vertical" className="!h-6" />
        <Field className="flex flex-row items-center justify-center !w-min">
          <CustomInput
            id="bpm"
            type="number"
            defaultValue={"120"}
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
  const { audioReady, togglePlay, midiState } = useGame();
  return (
    <div className=" flex w-full justify-evenly">
      <SettingsButton onClick={() => props.toggleSidebar()} />
      {midiState && (
        <>
          <StopButton disabled={!audioReady} />
          <PlayButton
            disabled={!audioReady}
            onClick={togglePlay}
            isPlaying={!!midiState?.config.isPlaying}
          />
        </>
      )}
      <p className="text-4xl/7 font-bold font-mono flex items-end">120</p>
    </div>
  );
}
