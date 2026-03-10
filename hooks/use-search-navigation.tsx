import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function useSearchNavigation() {
  const { routeParams, urlPathname } = usePageContext();
  const [activeTab, setActiveTab] = useState(urlPathname.split("/")[3] ?? "");
  const handleNav = (to: string) => {
    setActiveTab(to);
    navigate("/search/" + routeParams.searchParam + "/" + to);
  };
  useEffect(() => {
    setActiveTab(urlPathname.split("/")[3] ?? "");
  }, [urlPathname]);

  return { activeTab, handleNav };
}
