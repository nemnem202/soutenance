import AnimatedTabs from "@/components/animated-tabs";
import Headline from "@/components/headline";
import { MediumPlaylistWidgetCaroussel } from "@/components/playlists-widgets";
import { useState } from "react";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "liked", label: "Liked" },
  { id: "playlists", label: "Playlists" },
  { id: "authors", label: "Authors" },
  { id: "albums", label: "Albums" },
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
          <MediumPlaylistWidgetCaroussel title="Recently played" />
          <MediumPlaylistWidgetCaroussel title="Playlists" />
          <MediumPlaylistWidgetCaroussel title="Albums" />
        </div>
      </div>
    </>
  );
}
