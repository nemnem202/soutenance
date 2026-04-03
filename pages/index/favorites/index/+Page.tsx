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
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      />
      <MediumWidgetCarousel
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumAccountWidget key={index} />)}
      />
      <MediumWidgetCarousel
        title={instance.getItem("playlists")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
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
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      />
      <MediumWidgetCarousel
        seeAllUrl="favorites/users"
        title={instance.getItem("accounts")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumAccountWidget key={index} />)}
      />
      <MediumWidgetCarousel
        seeAllUrl="favorites/playlists"
        title={instance.getItem("playlists")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      />
    </>
  );
}
