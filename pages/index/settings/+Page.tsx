import MobileHeader from "@/components/mobile/header";
import SizeAdapter from "@/components/size-adapter";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { instance } = useLanguage();
  return <div>{instance.getItem("settings")}</div>;
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("settings")} />
    </>
  );
}
