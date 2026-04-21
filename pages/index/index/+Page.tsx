import { useData } from "vike-react/useData";
import { MediumAccountWidget } from "@/components/features/auth/account-widgets";
import MobileHeader from "@/components/features/layout/mobile-header";
import { MediumPlaylistWidget } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import { MediumWidgetCarousel } from "@/components/organisms/widget-carousel";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { Data } from "./+data";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { session } = useSession();
  const { instance } = useLanguage();
  const { popular, discover, recommendedUsers } = useData<Data>();
  return (
    <>
      {session ? (
        <Headline>
          {instance.getItem("homepageSessionTitle")} {session.username}
        </Headline>
      ) : (
        <Headline>{instance.getItem("homepageDefaultTitle")}</Headline>
      )}
      {popular.success && popular.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl={{
            query: "popular",
            type: "playlist",
          }}
          title={instance.getItem("popularPlaylists")}
          widgets={popular.data.map((data, index) => (
            <MediumPlaylistWidget key={index} playlist={data} />
          ))}
        />
      )}

      {discover.success && discover.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl={{
            query: "discover",
            type: "playlist",
          }}
          title={instance.getItem("discover")}
          widgets={discover.data.map((data, index) => (
            <MediumPlaylistWidget key={index} playlist={data} />
          ))}
        />
      )}

      {recommendedUsers.success && recommendedUsers.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl={{
            query: "popular",
            type: "account",
          }}
          title={instance.getItem("others_liked_them_too")}
          widgets={recommendedUsers.data.map((account, index) => (
            <MediumAccountWidget key={index} account={account} />
          ))}
        />
      )}
    </>
  );
}

function Mobile() {
  const { popular, discover, recommendedUsers } = useData<Data>();
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("homepage")} />
      {popular.success && popular.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl={{
            query: "popular",
            type: "playlist",
          }}
          title={instance.getItem("popularPlaylists")}
          widgets={popular.data.map((data, index) => (
            <MediumPlaylistWidget key={index} playlist={data} />
          ))}
        />
      )}

      {discover.success && discover.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl={{
            query: "discover",
            type: "playlist",
          }}
          title={instance.getItem("discover")}
          widgets={discover.data.map((data, index) => (
            <MediumPlaylistWidget key={index} playlist={data} />
          ))}
        />
      )}

      {recommendedUsers.success && recommendedUsers.data.length > 0 && (
        <MediumWidgetCarousel
          seeAllUrl={{
            query: "popular",
            type: "account",
          }}
          title={instance.getItem("others_liked_them_too")}
          widgets={recommendedUsers.data.map((account, index) => (
            <MediumAccountWidget key={index} account={account} />
          ))}
        />
      )}
    </>
  );
}
