import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import { SearchExercisesList } from "@/components/features/playlist/playlist-items";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import { useData } from "vike-react/useData";
import type { Data } from "../+data";

export default function Page() {
  const data = useData<Data>();
  return <SizeAdapter sm={<Mobile {...data} />} md={<Desktop {...data} />} />;
}

function Desktop({ ...data }: Data) {
  const { instance } = useLanguage();
  const { exercises, playlists, users } = data;
  return (
    <>
      {exercises.success && exercises.data.length > 0 && (
        <SearchExercisesList
          key="exercises"
          title={instance.getItem("exercises")}
          seeAllUrl={`/favorites/exercises`}
          exercises={exercises.data.slice(0, 5)}
        />
      )}

      {playlists.success && playlists.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl="favorites/playlists"
          title={instance.getItem("playlists")}
          widgets={playlists.data.map((playlist, index) => (
            <MediumPlaylistWidget key={index} playlist={playlist} />
          ))}
        />
      )}
      {users.success && users.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl="favorites/users"
          title={instance.getItem("accounts")}
          widgets={users.data.map((user, index) => (
            <MediumAccountWidget key={index} account={user} />
          ))}
        />
      )}
    </>
  );
}

function Mobile({ ...data }: Data) {
  const { instance } = useLanguage();
  const { exercises, playlists, users } = data;
  return (
    <>
      {exercises.success && exercises.data.length > 0 && (
        <SearchExercisesList
          key="exercises"
          title={instance.getItem("exercises")}
          seeAllUrl={`/favorites/exercises`}
          exercises={exercises.data.slice(0, 5)}
        />
      )}
      {playlists.success && playlists.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl="favorites/playlists"
          title={instance.getItem("playlists")}
          widgets={playlists.data.map((playlist, index) => (
            <MediumPlaylistWidget key={index} playlist={playlist} />
          ))}
        />
      )}
      {users.success && users.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl="favorites/users"
          title={instance.getItem("accounts")}
          widgets={users.data.map((user, index) => (
            <MediumAccountWidget key={index} account={user} />
          ))}
        />
      )}
    </>
  );
}
