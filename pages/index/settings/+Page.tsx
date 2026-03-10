import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return <div>{instance.getItem("settings")}</div>;
}
