import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
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
          <MediumPlaylistWidget key={crypto.randomUUID()}/>
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget key={crypto.randomUUID()}/>
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("playlists")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget key={crypto.randomUUID()}/>
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
          <MediumPlaylistWidget key={crypto.randomUUID()}/>
        ))}
      />
      <MediumWidgetCarousel
        seeAllUrl="favorites/users"
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget key={crypto.randomUUID()}/>
        ))}
      />
      <MediumWidgetCarousel
        seeAllUrl="favorites/playlists"
        title={instance.getItem("playlists")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget key={crypto.randomUUID()}/>
        ))}
      />
    </>
  );
}
