import { MediumAccountWidget } from "@/components/account-widgets";
import Headline from "@/components/headline";
import MobileHeader from "@/components/mobile/header";
import { MediumPlaylistWidget } from "@/components/playlists-widgets";
import SizeAdapter from "@/components/size-adapter";
import { MediumWidgetCaroussel } from "@/components/widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { session } = useSession();
  const { instance } = useLanguage();
  return (
    <>
      {session ? (
        <Headline>
          {instance.getItem("homepageSessionTitle")} {session.username}
        </Headline>
      ) : (
        <Headline>{instance.getItem("homepageDefaultTitle")}</Headline>
      )}
      <MediumWidgetCaroussel
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title={instance.getItem("moreOfThem")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumAccountWidget />
        ))}
      />
      <MediumWidgetCaroussel
        title={instance.getItem("popularExercices")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />

      <MediumWidgetCaroussel
        title={instance.getItem("discover")}
        widgets={Array.from({ length: 20 }).map(() => (
          <MediumPlaylistWidget />
        ))}
      />
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("homepage")} />
    </>
  );
}
