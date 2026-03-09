import { MediumAccountWidget } from "@/components/account-widgets";
import { SearchExercicesList } from "@/components/playlist-items";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";

export default function Page() {
  return (
    <>
      <SearchExercicesList />
      <MediumWidgetCaroussel
        title="Users"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title="Playlists"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}
