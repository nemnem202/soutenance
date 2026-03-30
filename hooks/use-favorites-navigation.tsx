import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function useFavoritesNavigation() {
  const { urlPathname } = usePageContext();
  const [activeTab, setActiveTab] = useState(urlPathname.split("/")[2] ?? "");
  const handleNav = (to: string) => {
    setActiveTab(to);
    navigate(`/favorites/${to}`);
  };
  useEffect(() => {
    setActiveTab(urlPathname.split("/")[2] ?? "");
  }, [urlPathname]);

  return { activeTab, handleNav };
}
