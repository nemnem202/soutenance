import { MediumAccountWidget } from "@/components/account-widgets";
import { SearchExercisesList } from "@/components/playlist-items";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCarousel } from "@/components/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { routeParams } = usePageContext();
  const { instance } = useLanguage();
  return (
    <>
      <SearchExercisesList seeAllUrl={`/search/${routeParams.searchParam}/exercises`} />
      <MediumWidgetCarousel
        title={instance.getItem("users")}
        seeAllUrl={`/search/${routeParams.searchParam}/users`}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCarousel
        title="Playlists"
        seeAllUrl={`/search/${routeParams.searchParam}/playlists`}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}
