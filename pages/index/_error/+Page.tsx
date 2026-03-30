import Headline from "@/components/ui/headline";
import MobileHeader from "@/components/features/layout/mobile-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import { useLanguage } from "@/hooks/use-language";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { is404 } = usePageContext();
  const { instance } = useLanguage();
  if (is404) {
    return (
      <>
        <Headline>{instance.getItem("page_not_found")}</Headline>
        <p className="paragraph-lg text-muted-foreground">
          {instance.getItem("this_page_cound_not_be_found")}
        </p>
      </>
    );
  }
  return (
    <>
      <Headline>{instance.getItem("internal_error")}</Headline>
      <p className="paragraph-lg text-muted-foreground">
        {instance.getItem("something_went_wrong")}
      </p>
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return <MobileHeader title={instance.getItem("page_not_found")} />;
}
