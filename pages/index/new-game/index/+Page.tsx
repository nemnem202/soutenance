import NewGameFileUpload from "@/components/features/new-game/new-game-file-upload";
import NewGameLinkInput from "@/components/features/new-game/new-game-link-input";
import Headline from "@/components/ui/headline";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline>{instance.getItem("start_building_your_own_exercise")}</Headline>
      <div className="flex-1 flex flex-col gap-10">
        <section>
          <div className="flex size-full flex-col gap-2">
            <div className="flex items-end gap-1 w-full ">
              <Label
                className={cn("title-2 whitespace-nowrap flex items-end min-h-8")}
                htmlFor="link-input"
              >
                Copy-paste a link
              </Label>
              <Separator className="flex-1" />
            </div>
            <NewGameLinkInput />
          </div>
        </section>

        <section className="flex-1">
          <div className="flex size-full flex-col gap-2">
            <div className="flex items-end gap-1 w-full">
              <Label
                className={cn("title-2 whitespace-nowrap flex items-end min-h-8")}
                htmlFor="file-input"
              >
                ...Or upload a file
              </Label>
              <Separator className="flex-1" />
            </div>
            <NewGameFileUpload />
          </div>
        </section>
      </div>
    </>
  );
}
