import AnimatedTabs from "@/components/animated-tabs";
import { MediumAccountWidget } from "@/components/account-widgets";
import Headline from "@/components/headline";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { useState } from "react";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "liked", label: "Liked" },
  { id: "playlists", label: "Playlists" },
  { id: "authors", label: "Authors" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <>
      <Headline>Favorites</Headline>
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
            title="Recently played"
            widgets={Array.from({ length: 20 }).map(() => (
              <MediumPlaylistWidget />
            ))}
          />
          <MediumWidgetCaroussel
            title="Accounts"
            widgets={Array.from({ length: 20 }).map(() => (
              <MediumAccountWidget />
            ))}
          />
          <MediumWidgetCaroussel
            title="Playlists"
            widgets={Array.from({ length: 20 }).map(() => (
              <MediumPlaylistWidget />
            ))}
          />
        </div>
      </div>
    </>
  );
}
