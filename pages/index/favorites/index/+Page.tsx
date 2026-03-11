import { MediumAccountWidget } from "@/components/account-widgets";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
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
    </>
  );
}
