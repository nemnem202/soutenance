import { FileUploadSection } from "@/components/features/new-game/file-upload-section";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline>{instance.getItem("start_building_your_own_exercise")}</Headline>
      <section className="grid size-full grid-cols-2 grid-rows-2 flex-1 gap-5">
        <FileUploadSection multiple={false} className="col-start-1 col-end-3 row-start-1" />
        <div className="flex size-full border" />
        <div className="flex size-full border" />
      </section>
    </>
  );
}
