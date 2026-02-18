import { MediumPlaylistWrapper } from "@/components/playlists-widgets";

export default function Page() {
  return (
    <div className="flex flex-col">
      <h1 className="headline mb-6">Recently played</h1>
      <MediumPlaylistWrapper />
    </div>
  );
}
