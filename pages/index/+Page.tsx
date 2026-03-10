import { MediumAccountWidget } from "@/components/account-widgets";
import Headline from "@/components/headline";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import useSession from "@/hooks/use-session";
export default function Page() {
  const { session } = useSession();
  return (
    <>
      {session ? <Headline>Welcome back, {session.username}</Headline> : <Headline>Welcome on music sandbox</Headline>}
      <MediumWidgetCaroussel
        title="Recently played"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title="More of them"
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
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
