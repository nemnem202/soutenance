import Headline from "@/components/headline";
import { MediumPlaylistWidgetCaroussel } from "@/components/playlists-widgets";
export default function Page() {
  return (
    <div className="flex flex-col">
      <Headline>Welcome back, Nem !</Headline>
      <MediumPlaylistWidgetCaroussel title="Recently played" />
      <MediumPlaylistWidgetCaroussel title="Popular exercices" />
      <MediumPlaylistWidgetCaroussel title="Discover" />
    </div>
  );
}
