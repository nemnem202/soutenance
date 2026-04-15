import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import { SearchExercisesList } from "@/components/features/playlist/playlist-items";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import type { Data } from "../+data";

export default function Page() {
  const { routeParams } = usePageContext();
  const { instance } = useLanguage();
  const { exercises, playlists, users } = useData<Data>();

  const sections = [
    {
      id: "exercises",
      hasData: exercises.success && exercises.data.length > 0,
      topScore:
        exercises.success && exercises.data.length > 0 ? (exercises.data[0].score ?? 0) : -1,
      render: () => (
        <SearchExercisesList
          key="exercises"
          seeAllUrl={`/search/${routeParams.searchParam}/exercises`}
          exercises={exercises.success ? exercises.data.slice(0, 5) : []}
        />
      ),
    },
    {
      id: "users",
      hasData: users.success && users.data.length > 0,
      topScore: users.success ? (users.data[0]?.score ?? 0) : -1,
      render: () => (
        <MediumWidgetCarousel
          key="users"
          title={instance.getItem("users")}
          seeAllUrl={`/search/${routeParams.searchParam}/users`}
          widgets={
            users.success
              ? users.data.map((user, index) => <MediumAccountWidget key={index} account={user} />)
              : []
          }
        />
      ),
    },
    {
      id: "playlists",
      hasData: playlists.success && playlists.data.length > 0,
      topScore: playlists.success ? (playlists.data[0]?.score ?? 0) : -1,
      render: () => (
        <MediumWidgetCarousel
          key="playlists"
          title="Playlists"
          seeAllUrl={`/search/${routeParams.searchParam}/playlists`}
          widgets={
            playlists.success
              ? playlists.data.map((playlist, index) => (
                  <MediumPlaylistWidget key={index} playlist={playlist} />
                ))
              : []
          }
        />
      ),
    },
  ];
  const sortedSections = sections.filter((s) => s.hasData).sort((a, b) => b.topScore - a.topScore);

  if (
    (exercises.success &&
      exercises.data.length <= 0 &&
      playlists.success &&
      playlists.data.length <= 0 &&
      users.success &&
      users.data.length <= 0) ||
    (!exercises.success && !playlists.success && !users.success)
  )
    return <h1 className="title-1">{instance.getItem("this_page_cound_not_be_found")}</h1>;

  return <>{sortedSections.map((section) => section.render())}</>;
}
