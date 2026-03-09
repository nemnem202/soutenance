import AnimatedTabs from "@/components/animated-tabs";
import useSearchNavigation from "@/hooks/use-search-navigation";
import { ReactNode } from "react";

const tabs = [
  { id: "", label: "All" },
  { id: "exercices", label: "Exercices" },
  { id: "users", label: "Users" },
  { id: "playlists", label: "Playlists" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { activeTab, handleNav } = useSearchNavigation();
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
