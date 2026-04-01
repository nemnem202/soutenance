import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import MobileHeader from "@/components/features/layout/mobile-header";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import Headline from "@/components/ui/headline";
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
      <MediumWidgetCarousel
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("moreOfThem")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumAccountWidget key={index} />
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("popularExercises")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
        ))}
      />

      <MediumWidgetCarousel
        title={instance.getItem("discover")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
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
      <MediumWidgetCarousel
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("moreOfThem")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumAccountWidget key={index} />
        ))}
      />
      <MediumWidgetCarousel
        title={instance.getItem("popularExercises")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
        ))}
      />

      <MediumWidgetCarousel
        title={instance.getItem("discover")}
        widgets={Array.from({ length: 20 }).map((_, index) => (
          <MediumPlaylistWidget key={index} />
        ))}
      />
    </>
  );
}
