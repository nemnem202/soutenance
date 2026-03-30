import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import { SearchExercisesList } from "@/components/features/playlist/playlist-items";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { routeParams } = usePageContext();
  const { instance } = useLanguage();
  return (
    <>
      <SearchExercisesList
        seeAllUrl={`/search/${routeParams.searchParam}/exercises`}
      />
      <MediumWidgetCarousel
        title={instance.getItem("users")}
        seeAllUrl={`/search/${routeParams.searchParam}/users`}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumAccountWidget key={index} />
        ))}
      />
      <MediumWidgetCarousel
        title="Playlists"
        seeAllUrl={`/search/${routeParams.searchParam}/playlists`}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
        ))}
      />
    </>
  );
}
