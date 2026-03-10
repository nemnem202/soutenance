import AnimatedTabs from "@/components/animated-tabs";
import { MediumAccountWidget } from "@/components/account-widgets";
import Headline from "@/components/headline";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const { instance } = useLanguage();
  const tabs = [
    { id: "overview", label: instance.getItem("overview") },
    { id: "liked", label: instance.getItem("liked") },
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
          onChange={setActiveTab}
          tabs={tabs}
          variant="underline"
        />
        <div>
          <MediumWidgetCaroussel
            title={instance.getItem("recentlyPlayed")}
            widgets={Array.from({ length: 20 }).map(() => (
              <MediumPlaylistWidget />
            ))}
          />
          <MediumWidgetCaroussel
            title={instance.getItem("accounts")}
            widgets={Array.from({ length: 20 }).map(() => (
              <MediumAccountWidget />
            ))}
          />
          <MediumWidgetCaroussel
            title={instance.getItem("playlists")}
            widgets={Array.from({ length: 20 }).map(() => (
              <MediumPlaylistWidget />
            ))}
          />
        </div>
      </div>
    </>
  );
}
