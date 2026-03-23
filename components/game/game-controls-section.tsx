import { Play, Settings, Square } from "lucide-react";
import { ControlsSection, IconButton } from "./game-assets";
import { Field, FieldLabel } from "../field";
import { Separator } from "../separator";
import { Input } from "../input";
import { Gameprops } from "@/pages/game/+Page";
import { useLanguage } from "@/hooks/use-language";

export default function GameControlsSection({ ...props }: Gameprops) {
  const { instance } = useLanguage();
  return (
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
        <Input id="bpm" type="number" defaultValue={"120"} className="!w-15 min-w-0 p-0 text-center" />
        <FieldLabel htmlFor="bpm" className="!w-min text-muted-foreground paragraph-small">
          {instance.getItem("bpm").toLowerCase()}
        </FieldLabel>
      </Field>
    </ControlsSection>
  );
}
