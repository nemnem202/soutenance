import AnimatedTabs from "@/components/animated-tabs";
import { useLanguage } from "@/hooks/use-language";
import useSearchNavigation from "@/hooks/use-search-navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { activeTab, handleNav } = useSearchNavigation();
  const { instance } = useLanguage();
  const tabs = [
    { id: "", label: instance.getItem("all") },
    { id: "exercices", label: instance.getItem("exercices") },
    { id: "users", label: instance.getItem("users") },
    { id: "playlists", label: instance.getItem("playlists") },
  ];
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
