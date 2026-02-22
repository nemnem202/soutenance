import { MediumPlaylistWrapper } from "@/components/playlists-widgets";

export default function Page() {
  return (
    <div className="flex flex-col">
      <h1 className="headline mb-6">Your projects</h1>
      <MediumPlaylistWrapper allowToAddANewProject={true} />
    </div>
  );
}
