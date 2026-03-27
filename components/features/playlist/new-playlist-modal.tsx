import { ReactNode, useState } from "react";
import Modal from "../../organisms/modal";
import NewPlaylistForm from "./new-playlist-form";
import { useLanguage } from "@/hooks/use-language";
import { TooltipProvider } from "../../molecules/tooltip";

export default function NewPlaylistModal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { instance } = useLanguage();
  return (
    <>
      <button className="all-unset" onClick={() => setIsOpen((prev) => !prev)}>
        {children}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <TooltipProvider>
          <h2 className="headline text-center p-4">{instance.getItem("new_playlist")}</h2>
          <NewPlaylistForm axe="y" />
        </TooltipProvider>
      </Modal>
    </>
  );
}
