import { MediumAccountWidget } from "@/components/account-widgets";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import SizeAdapter from "@/components/size-adapter";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
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

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MediumWidgetCaroussel
        seeAllUrl="favorites/exercises"
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
      <MediumWidgetCaroussel
        seeAllUrl="favorites/users"
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCaroussel
        seeAllUrl="favorites/playlists"
        title={instance.getItem("playlists")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}
