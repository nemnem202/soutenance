import SwitchParam from "@/components/molecules/switch-param";
import { useLanguage } from "@/hooks/use-language";

import { SmallCheckboxGroup } from "../game-assets";
import { ParamsAccordion } from "../game-sidebar";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action } from "@/midi-editor/types/actions";

export default function AppearanceSettings() {
  const { instance } = useLanguage();
  const { state, dispatch } = useMidiStore();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("appearance")}</h3>}>
      <div className="gap-2 flex flex-col">
        <SwitchParam
          checked={!!state?.config.currentMeasureOverline}
          order="label-switch"
          setChecked={(value) => {
            dispatch({ type: Action.DISPLAY_CURRENT_MEASURE, display: value });
          }}
        >
          <p className="paragraph w-45 text-foreground">
            {instance.getItem("highlight_current_measure")}
          </p>
        </SwitchParam>
        <p className="pragraph">{instance.getItem("chords_diagrams")}:</p>
        <div className="flex gap-4">
          <SmallCheckboxGroup
            label={instance.getItem("piano")}
            labelProps={{ className: "text-muted-foreground" }}
          />
          <SmallCheckboxGroup
            label={instance.getItem("guitar")}
            labelProps={{ className: "text-muted-foreground" }}
          />
        </div>
      </div>
    </ParamsAccordion>
  );
}
