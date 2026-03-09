import AnimatedTabs from "@/components/animated-tabs";
import { ReactNode, useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

const tabs = [
  { id: "", label: "All" },
  { id: "exercices", label: "Exercices" },
  { id: "users", label: "Users" },
  { id: "playlists", label: "Playlists" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { routeParams, urlPathname } = usePageContext();
  const [activeTab, setActiveTab] = useState(urlPathname.split("/")[3] ?? "");
  const handleNav = (to: string) => {
    setActiveTab(to);
    navigate("/search/" + routeParams.searchParam + "/" + to);
  };

  useEffect(() => {
    setActiveTab(urlPathname.split("/")[3] ?? "");
  }, [urlPathname]);
  return (
    <div className="flex flex-col gap-8 z-0 relative">
      <AnimatedTabs
        activeTab={activeTab}
        layoutId="underline-demo"
        onChange={handleNav}
        tabs={tabs}
        variant="underline"
        className="my-5"
      />
      {children}
    </div>
  );
}
