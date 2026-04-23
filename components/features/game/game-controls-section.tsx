import { Play, Settings, Square } from "lucide-react";
import { Field, FieldLabel } from "@/components/molecules/field";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { Gameprops } from "@/pages/game/@id/+Page";
import { ControlsSection, IconButton } from "./game-assets";
import { CustomInput } from "@/components/ui/custom_input";

export default function DesktopGameControlsSection({ ...props }: Gameprops) {
  const { instance } = useLanguage();
  return (
    <div className="hidden md:block">
      <ControlsSection>
        <IconButton onClick={props.toggleSidebar}>
          <Settings className="hover:stroke-primary  transition" />
        </IconButton>
        <IconButton>
          <Play className="hover:stroke-primary hover:fill-primary fill-foreground transition" />
        </IconButton>
        <IconButton>
          <Square className="hover:stroke-primary hover:fill-primary fill-foreground transition" />
        </IconButton>
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
  return (
    <div className=" flex w-full justify-evenly">
      <IconButton onClick={() => props.toggleSidebar()}>
        <Settings className="hover:stroke-primary  transition h-8 w-8" />
      </IconButton>
      <IconButton>
        <Square className="hover:stroke-primary hover:fill-primary fill-foreground transition h-8 w-8" />
      </IconButton>
      <IconButton>
        <Play className="hover:stroke-primary hover:fill-primary fill-foreground transition h-8 w-8" />
      </IconButton>
      <p className="text-4xl/7 font-bold font-mono flex items-end">120</p>
    </div>
  );
}
