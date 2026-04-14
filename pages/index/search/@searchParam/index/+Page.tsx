import { usePageContext } from "vike-react/usePageContext";
import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import { SearchExercisesList } from "@/components/features/playlist/playlist-items";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import { useData } from "vike-react/useData";
import { Data } from "../+data";

export default function Page() {
  const { routeParams } = usePageContext();
  const { instance } = useLanguage();
  const { exercises, playlists, users } = useData<Data>();
  return (
    <>
      {exercises.success && exercises.data.length > 0 && (
        <SearchExercisesList
          seeAllUrl={`/search/${routeParams.searchParam}/exercises`}
          exercises={exercises.data}
        />
      )}

      {users.success && users.data.length > 0 && (
        <MediumWidgetCarousel
          title={instance.getItem("users")}
          seeAllUrl={`/search/${routeParams.searchParam}/users`}
          widgets={users.data.map((user, index) => (
            <MediumAccountWidget key={index} account={user} />
          ))}
        />
      )}

      {playlists.success && playlists.data.length > 0 && (
        <MediumWidgetCarousel
          title="Playlists"
          seeAllUrl={`/search/${routeParams.searchParam}/playlists`}
          widgets={playlists.data.map((playlist, index) => (
            <MediumPlaylistWidget key={index} playlist={playlist} />
          ))}
        />
      )}
    </>
  );
}
