import SwitchParam from "@/components/molecules/switch-param";
import { useLanguage } from "@/hooks/use-language";

import { ParamsAccordion } from "../game-sidebar";
import { SmallInput } from "../game-assets";

export default function GeneralSettings() {
  const { instance } = useLanguage();
  return (
    <ParamsAccordion
      title={<h3 className="title-3">{instance.getItem("general")}</h3>}
    >
      <div className="mb-2">
        <SwitchParam checked={true} order="label-switch" setChecked={() => {}}>
          <p className="paragraph text-foreground">
            {instance.getItem("count_before_play")}
          </p>
        </SwitchParam>
      </div>
      <div className={`flex flex-col w-full py-2`}>
        <div className="grid gap-3 grid-cols-3">
          <SmallInput
            label={instance.getItem("transpose")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
          />
          <SmallInput
            label={instance.getItem("practice")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">sem:</p>}
            tooltip={
              <p className="paragraph-sm">
                Increase the global trampose at each loop.
              </p>
            }
          />
          <SmallInput
            label={instance.getItem("repeats")}
            type="number"
            defaultValue={3}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">x</p>}
          />
        </div>
        <div className="grid gap-3 grid-cols-3">
          <SmallInput
            label={instance.getItem("bpm")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
          />
          <SmallInput
            label={instance.getItem("bpm_practice")}
            type="number"
            defaultValue={0}
            containerClassName="w-full"
            icon={<p className="paragraph-sm text-muted-foreground">+</p>}
            tooltip={
              <p className="paragraph-sm ">Increase the Bpm at each loop.</p>
            }
          />
        </div>
      </div>
    </ParamsAccordion>
  );
}
