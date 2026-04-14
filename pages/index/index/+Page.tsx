import MobileHeader from "@/components/features/layout/mobile-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import { MediumAccountWidget } from "@/components/features/auth/account-widgets";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { session } = useSession();
  const { instance } = useLanguage();
  const { popular, discover, recommendedUsers } = useData<Data>();

  useEffect(() => logger.info("Popular", popular), [popular]);
  return (
    <>
      {session ? (
        <Headline>
          {instance.getItem("homepageSessionTitle")} {session.username}
        </Headline>
      ) : (
        <Headline>{instance.getItem("homepageDefaultTitle")}</Headline>
      )}
      {/* <MediumWidgetCarousel
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      /> */}
      {popular.success && (
        <MediumWidgetCarousel
          title={instance.getItem("popularExercises")}
          widgets={popular.data.map((data, index) => (
            <MediumPlaylistWidget key={index} playlist={data} />
          ))}
        />
      )}

      {discover.success && (
        <MediumWidgetCarousel
          title={instance.getItem("discover")}
          widgets={discover.data.map((data, index) => (
            <MediumPlaylistWidget key={index} playlist={data} />
          ))}
        />
      )}

      {recommendedUsers.success && (
        <MediumWidgetCarousel
          title={instance.getItem("others_liked_them_too")}
          widgets={recommendedUsers.data.map((account, index) => (
            <MediumAccountWidget key={index} account={account} />
          ))}
        />
      )}

      {/* <MediumWidgetCarousel
          title={instance.getItem("moreOfThem")}
          widgets={recommendedUsers.data.map((account, index) => (
            <MediumAccountWidget key={index} account={account} />
          ))}
        /> */}
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("homepage")} />
      {/* <MediumWidgetCarousel
        title={instance.getItem("recentlyPlayed")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      />
      <MediumWidgetCarousel
        title={instance.getItem("moreOfThem")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumAccountWidget key={index} />)}
      />
      <MediumWidgetCarousel
        title={instance.getItem("popularExercises")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      />

      <MediumWidgetCarousel
        title={instance.getItem("discover")}
        widgets={Array.from({ length: 20 }).map((_, index) => <MediumPlaylistWidget key={index} />)}
      /> */}
    </>
  );
}
