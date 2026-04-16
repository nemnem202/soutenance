import MobileHeader from "@/components/features/layout/mobile-header";
import SizeAdapter from "@/components/molecules/size-adapter";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";
import type { ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Layout({ children }: { children: ReactNode }) {
  return <SizeAdapter sm={<Mobile>{children}</Mobile>} md={<Desktop>{children}</Desktop>} />;
}

function Desktop({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const queryParams = pageContext.urlParsed.search;
  return (
    <>
      <Headline>{queryParams.search}</Headline>
      {children}
    </>
  );
}

function Mobile({ children }: { children: ReactNode }) {
  const { instance } = useLanguage();
  const pageContext = usePageContext();
  const queryParams = pageContext.urlParsed.search;
  return (
    <>
      <MobileHeader title={`${queryParams.search}`} />
      {children}
    </>
  );
}
