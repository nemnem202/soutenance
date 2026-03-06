import { MediumArtistWidget } from "@/components/artist-widgets";
import Headline from "@/components/headline";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
export default function Page() {
  return (
    <>
      <Headline>Welcome back, Nem !</Headline>
      <MediumWidgetCaroussel
        title="Recently played"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title="More of them"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumArtistWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title="Popular exercices"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />

      <MediumWidgetCaroussel
        title="Discover"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}
