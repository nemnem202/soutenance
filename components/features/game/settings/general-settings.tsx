import SwitchParam from "@/components/molecules/switch-param";
import { useLanguage } from "@/hooks/use-language";
import { SidebarSlider, SmallInput } from "../game-assets";
import { ParamsAccordion } from "../game-sidebar";
import useGame from "@/hooks/use-game";
import { logger } from "@/lib/logger";
import { Action } from "@/midi-editor/types/actions";
import SizeAdapter from "@/components/molecules/size-adapter";

export default function GeneralSettings() {
  const { instance } = useLanguage();
  const { midiState, dispatch } = useGame();
  return (
    <ParamsAccordion title={<h3 className="title-3">{instance.getItem("general")}</h3>}>
      <div className="mb-2">
        <SwitchParam
          checked={!!midiState?.config.countIn}
          order="label-switch"
          setChecked={() => {
            if (!midiState) return;
            dispatch({ type: Action.SET_COUNT_INT, countin: !midiState.config.countIn });
          }}
        >
          <p className="paragraph text-foreground">{instance.getItem("count_before_play")}</p>
        </SwitchParam>
      </div>
      <SizeAdapter sm={<MobileInputsGroup />} md={<DesktopInputsGroup />} />
    </ParamsAccordion>
  );
}

function DesktopInputsGroup() {
  const { instance } = useLanguage();
  const { midiState, dispatch } = useGame();
  return (
    <div className={`flex flex-col w-full py-2`}>
      <div className="grid gap-3 grid-cols-3">
        <SmallInput
          label={instance.getItem("transpose")}
          type="number"
          defaultValue={midiState?.config.transposition}
          containerClassName="w-full"
          icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
        />
        <SmallInput
          label={instance.getItem("practice")}
          type="number"
          defaultValue={midiState?.config.transpositionPractice}
          containerClassName="w-full"
          icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
          tooltip={<p className="paragraph-sm">Increase the global trampose at each loop.</p>}
        />
        <SmallInput
          label={instance.getItem("repeats")}
          type="number"
          defaultValue={midiState?.config.repeats}
          containerClassName="w-full"
          icon={<p className="paragraph-sm text-muted-foreground">x</p>}
        />
      </div>
      <div className="grid gap-3 grid-cols-3">
        <SmallInput
          label={instance.getItem("bpm")}
          type="number"
          disabled={!midiState}
          defaultValue={midiState ? Math.floor(midiState.config.bpm) : undefined}
          containerClassName="w-full"
          onBlur={(e) => {
            let value = parseInt(e.currentTarget.value, 10);
            if (value < 30) value = 30;
            if (value > 500) value = 500;
            e.currentTarget.value = value.toString();
            dispatch({ type: Action.SET_BPM, bpm: value });
          }}
        />
        <SmallInput
          label={instance.getItem("bpm_practice")}
          type="number"
          defaultValue={midiState?.config.bpmPractice}
          onBlur={(e) => {
            let value = parseInt(e.currentTarget.value, 10);
            if (value < 30) value = 30;
            if (value > 500) value = 500;
            e.currentTarget.value = value.toString();
            dispatch({ type: Action.SET_BPM, bpm: value });
          }}
          containerClassName="w-full"
          icon={<p className="paragraph-sm text-muted-foreground">+</p>}
          tooltip={<p className="paragraph-sm ">Increase the Bpm at each loop.</p>}
        />
      </div>
    </div>
  );
}

function MobileInputsGroup() {
  const { midiState, dispatch } = useGame();
  const { instance } = useLanguage();
  if (midiState)
    return (
      <div className={`flex flex-col w-full py-2 gap-5`}>
        <SidebarSlider
          onValueChange={(value) =>
            dispatch({ type: Action.SET_TRANSPOSITION, transposition: value[0] })
          }
          defaultValue={[midiState.config.transposition]}
          axis="y"
          min={-11}
          max={11}
          step={1}
        >
          <div className="w-full flex gap-2">
            <p className="paragraph">{instance.getItem("transpose")}:</p>
            <p className="paragaph text-primary">{midiState.config.transposition}</p>
          </div>
        </SidebarSlider>
        <SidebarSlider
          onValueChange={(value) =>
            dispatch({ type: Action.SET_TRANSPOSITION_PRACTICE, transposition: value[0] })
          }
          defaultValue={[midiState.config.transpositionPractice]}
          axis="y"
          min={-11}
          max={11}
          step={1}
        >
          <div className="w-full flex gap-2">
            <p className="paragraph">{instance.getItem("practice")}:</p>
            <p className="paragaph text-primary">{midiState.config.transpositionPractice}</p>
          </div>
        </SidebarSlider>
        <SidebarSlider
          onValueChange={(value) => dispatch({ type: Action.SET_REPEATS, repeats: value[0] })}
          defaultValue={[midiState.config.repeats]}
          axis="y"
          min={1}
          max={100}
          step={1}
        >
          <div className="w-full flex gap-2">
            <p className="paragraph">{instance.getItem("repeats")}:</p>
            <p className="paragaph text-primary">{midiState.config.repeats}</p>
          </div>
        </SidebarSlider>
        <SidebarSlider
          onValueChange={(value) => dispatch({ type: Action.SET_BPM, bpm: value[0] })}
          defaultValue={[midiState?.config.bpm]}
          axis="y"
          min={30}
          max={500}
          step={1}
        >
          <div className="w-full flex gap-2">
            <p className="paragraph">{instance.getItem("bpm")}:</p>
            <p className="paragaph text-primary">{midiState.config.bpm}</p>
          </div>
        </SidebarSlider>
        <SidebarSlider
          onValueChange={(value) => dispatch({ type: Action.SET_BPM_PRACTICE, bpm: value[0] })}
          defaultValue={[midiState.config.bpmPractice]}
          axis="y"
          min={5}
          max={200}
          step={1}
        >
          <div className="w-full flex gap-2">
            <p className="paragraph">{instance.getItem("bpm_practice")}:</p>
            <p className="paragaph text-primary">{midiState.config.bpmPractice}</p>
          </div>
        </SidebarSlider>
      </div>
    );
}
