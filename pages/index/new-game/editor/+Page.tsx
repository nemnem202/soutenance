import Headline from "@/components/ui/headline";
import { GameView } from "@/pages/game/@id/+Page";

export default function Page() {
  return (
    <div>
      <Headline>Custom your exercise</Headline>
      <main className="flex-1 min-w-0 flex flex-col items-center p-4 max-w-screen min-h-0">
        <GameView toggleSidebar={() => {}} />
      </main>
    </div>
  );
}
