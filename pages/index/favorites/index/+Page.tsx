import { MediumAccountWidget } from "@/components/account-widgets";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import SizeAdapter from "@/components/size-adapter";
import { MediumWidgetCarousel } from "@/components/widget-carousel";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { instance } = useLanguage();
  return (
    <>
      <MediumWidgetCarousel
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCarousel
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
      <MediumWidgetCarousel
        seeAllUrl="favorites/exercises"
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
      <MediumWidgetCarousel
        seeAllUrl="favorites/users"
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCarousel
        seeAllUrl="favorites/playlists"
        title={instance.getItem("playlists")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}
