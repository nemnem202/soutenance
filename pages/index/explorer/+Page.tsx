import Headline from "@/components/headline";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline> {instance.getItem("explorePageTitle")}</Headline>
      <div className="flex-1 flex justify-center items-center">
        <p className="title-4 text-muted-foreground">upcoming</p>
      </div>
    </>
  );
}
