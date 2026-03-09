import AnimatedTabs from "@/components/animated-tabs";
import { useState } from "react";

const tabs = [
  { id: "all", label: "All" },
  { id: "playlists", label: "Playlists" },
  { id: "authors", label: "Authors" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <div className="flex flex-col gap-8 z-0 relative">
      <AnimatedTabs
        activeTab={activeTab}
        layoutId="underline-demo"
        onChange={setActiveTab}
        tabs={tabs}
        variant="underline"
        className="my-5"
      />

      <div></div>
    </div>
  );
}
