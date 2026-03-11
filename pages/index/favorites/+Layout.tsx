import AnimatedTabs from "@/components/animated-tabs";
import Headline from "@/components/headline";
import { ReactNode, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import useFavoritesNavigation from "@/hooks/use-favorites-navigation";

export default function Layout({ children }: { children: ReactNode }) {
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
