import { MediumPlaylistWidgetCaroussel } from "@/components/playlists-widgets";
export default function Page() {
  return (
    <div className="flex flex-col">
      <MediumPlaylistWidgetCaroussel title="Recently played" />
      <MediumPlaylistWidgetCaroussel title="Popular exercices" />
      <MediumPlaylistWidgetCaroussel title="Discover" />
    </div>
  );
}
