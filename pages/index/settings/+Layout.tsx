import type { ReactNode } from "react";
import MobileHeader from "@/components/features/layout/mobile-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import AnimatedTabs from "@/components/organisms/animated-tabs";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";
import useSettingsNavigation from "@/hooks/use-settings-navigation";

export default function Layout({ children }: { children: ReactNode }) {
  return <SizeAdapter sm={<Mobile>{children}</Mobile>} md={<Desktop>{children}</Desktop>} />;
}

function Desktop({ children }: { children: ReactNode }) {
  const { activeTab, handleNav } = useSettingsNavigation();
  const { instance } = useLanguage();
  const tabs = [
    { id: "", label: instance.getItem("account") },
    { id: "appearance", label: instance.getItem("appearance") },
  ];

  return (
    <>
      <Headline>{instance.getItem("settings")}</Headline>
      <div className="flex flex-col gap-8 z-0 relative">
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="underline-demo"
          onChange={handleNav}
          tabs={tabs}
          variant="underline"
        />
        {children}
      </div>
    </>
  );
}

function Mobile({ children }: { children: ReactNode }) {
  const { instance } = useLanguage();
  const { activeTab, handleNav } = useSettingsNavigation();
  const tabs = [
    { id: "", label: instance.getItem("account") },
    { id: "appearance", label: instance.getItem("appearance") },
  ];

  return (
    <>
      <MobileHeader title={instance.getItem("settings")} />
      <div className="flex flex-col gap-8 z-0 relative">
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="underline-demo"
          onChange={handleNav}
          tabs={tabs}
          variant="underline"
        />
        <div className="flex-1 overflow-y-auto flex flex-col gap-3">{children}</div>
      </div>
    </>
  );
}
