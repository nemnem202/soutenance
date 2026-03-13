import AnimatedTabs from "@/components/animated-tabs";
import Headline from "@/components/headline";
import { ReactNode } from "react";
import { useLanguage } from "@/hooks/use-language";
import useFavoritesNavigation from "@/hooks/use-favorites-navigation";
import MobileHeader from "@/components/mobile/header";
import SizeAdapter from "@/components/size-adapter";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumAccountWidget } from "@/components/account-widgets";

export default function Layout({ children }: { children: ReactNode }) {
  return <SizeAdapter sm={<Mobile>{children}</Mobile>} md={<Desktop>{children}</Desktop>} />;
}

function Desktop({ children }: { children: ReactNode }) {
  const { activeTab, handleNav } = useFavoritesNavigation();
  const { instance } = useLanguage();
  const tabs = [
    { id: "", label: instance.getItem("overview") },
    { id: "exercices", label: instance.getItem("exercices") },
    { id: "playlists", label: instance.getItem("playlists") },
    { id: "users", label: instance.getItem("users") },
  ];

  return (
    <>
      <Headline>{instance.getItem("favoritesPageTitle")}</Headline>
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
  return (
    <>
      <MobileHeader title={instance.getItem("favoritesPageTitle")} />
      {children}
    </>
  );
}
