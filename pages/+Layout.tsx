import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { Toaster } from "@/components/ui/sonner";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";

export default function Layout({ children }: { children: ReactNode }) {
  // useEffect(() => {
  //   onMidiFile().then((response) => {
  //     logger.info("Response", response);

  //     if (response.success && response.data) {
  //       const uint8Array = new Uint8Array(Object.values(response.data));
  //       const blob = new Blob([uint8Array], { type: "audio/midi" });

  //       const url = window.URL.createObjectURL(blob);

  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = "track.mid";

  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //       window.URL.revokeObjectURL(url);

  //       logger.success("Fichier MIDI téléchargé !");
  //     }
  //   });
  // }, []);
  return (
    <ScreenSizeProvider>
      <LanguagesProvider>
        <SessionProvider>
          <Toaster />
          <TooltipProvider>{children}</TooltipProvider>
        </SessionProvider>
      </LanguagesProvider>
    </ScreenSizeProvider>
  );
}
