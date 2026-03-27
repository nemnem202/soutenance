import Headline from "@/components/ui/headline";
import MobileHeader from "@/components/features/layout/mobile-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
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

function Mobile() {
  const { instance } = useLanguage();

  return (
    <>
      <MobileHeader title={instance.getItem("explorePageTitle")} />
      <div className="flex-1 flex justify-center items-center">
        <p className="title-4 text-muted-foreground">upcoming</p>
      </div>
    </>
  );
}
