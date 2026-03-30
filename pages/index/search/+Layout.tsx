import AnimatedTabs from "@/components/organisms/animated-tabs";
import Searchbar from "@/components/organisms/searchbar";
import SizeAdapter from "@/components/molecules/size-adapter";
import { useLanguage } from "@/hooks/use-language";
import useSearchNavigation from "@/hooks/use-search-navigation";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SizeAdapter
      sm={<Mobile>{children}</Mobile>}
      md={<Desktop>{children}</Desktop>}
    />
  );
}

function Desktop({ children }: { children: ReactNode }) {
  const { activeTab, handleNav } = useSearchNavigation();
  const { instance } = useLanguage();
  const tabs = [
    { id: "", label: instance.getItem("all") },
    { id: "exercises", label: instance.getItem("exercises") },
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

function Mobile({ children }: { children: ReactNode }) {
  const { instance } = useLanguage();
  return (
    <div className="flex flex-col gap-5">
      <Searchbar placeholder={instance.getItem("search")} />
      {children}
    </div>
  );
}
