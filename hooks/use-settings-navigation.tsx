import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";

export default function useSettingsNavigation() {
  const { urlPathname } = usePageContext();
  const [activeTab, setActiveTab] = useState(urlPathname.split("/")[2] ?? "");
  const handleNav = (to: string) => {
    setActiveTab(to);
    navigate(`/settings/${to}`);
  };
  useEffect(() => {
    setActiveTab(urlPathname.split("/")[2] ?? "");
  }, [urlPathname]);

  return { activeTab, handleNav };
}
