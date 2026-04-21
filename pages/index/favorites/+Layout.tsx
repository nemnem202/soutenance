import type { ReactNode } from "react";
import MobileHeader from "@/components/features/layout/mobile-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import AnimatedTabs from "@/components/organisms/animated-tabs";
import Headline from "@/components/ui/headline";
import useFavoritesNavigation from "@/hooks/use-favorites-navigation";
import { useLanguage } from "@/hooks/use-language";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export default function Layout({ children }: { children: ReactNode }) {
  return <SizeAdapter sm={<Mobile>{children}</Mobile>} md={<Desktop>{children}</Desktop>} />;
}

function Desktop({ children }: { children: ReactNode }) {
  const data = useData<Data>();
  const { activeTab, handleNav } = useFavoritesNavigation();
  const { instance } = useLanguage();
  const tabs = [
    { id: "", label: instance.getItem("overview") },
    { id: "exercises", label: instance.getItem("exercises") },
    { id: "playlists", label: instance.getItem("playlists") },
    { id: "users", label: instance.getItem("users") },
  ];

  return (
    <>
      <Headline>{instance.getItem("favoritesPageTitle")}</Headline>
      {(data.exercises.success && data.exercises.data.length > 0) ||
      (data.playlists.success && data.playlists.data.length > 0) ||
      (data.users.success && data.users.data.length > 0) ? (
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
      ) : (
        <p className="paragraph-md text-muted-foreground">{instance.getItem("nothing_yet")}</p>
      )}
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
