import Headline from "@/components/headline";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  if (is404) {
    return (
      <>
        <Headline>Page Not Found</Headline>
        <p className="paragraph-lg text-muted-foreground">This page could not be found :/</p>
      </>
    );
  }
  return (
    <>
      <Headline>Internal Error</Headline>
      <p className="paragraph-lg text-muted-foreground">Something went wrong.</p>
    </>
  );
}
