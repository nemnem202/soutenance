import { MediumAccountWidget } from "@/components/account-widgets";
import { SearchExercicesList } from "@/components/playlist-items";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { routeParams } = usePageContext();
  return (
    <>
      <SearchExercicesList seeAllUrl={`/search/${routeParams.searchParam}/exercices`} />
      <MediumWidgetCaroussel
        title="Users"
        seeAllUrl={`/search/${routeParams.searchParam}/users`}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title="Playlists"
        seeAllUrl={`/search/${routeParams.searchParam}/playlists`}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}
