import type { ReactNode } from "react";
import Modal from "../../organisms/modal";
import NewPlaylistForm from "./new-playlist-form";
import { useLanguage } from "@/hooks/use-language";

export default function NewPlaylistModal({
  children,
  isOpen,
  setIsOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { instance } = useLanguage();
  return (
    <>
      {children}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="headline text-center p-4">{instance.getItem("new_playlist")}</h2>
        <NewPlaylistForm axe="y" />
      </Modal>
    </>
  );
}
