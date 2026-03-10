import { MediumAccountWidget } from "@/components/account-widgets";
import Headline from "@/components/headline";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
export default function Page() {
  const { session } = useSession();
  const { instance } = useLanguage();
  return (
    <>
      {session ? (
        <Headline>
          {instance.getItem("")} {session.username}
        </Headline>
      ) : (
        <Headline>Welcome on music sandbox</Headline>
      )}
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
