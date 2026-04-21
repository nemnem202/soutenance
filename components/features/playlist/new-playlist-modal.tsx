import type { ReactNode } from "react";
import { useLanguage } from "@/hooks/use-language";
import Modal from "../../organisms/modal";
import NewPlaylistForm from "./new-playlist-form";
import SizeAdapter from "@/components/molecules/size-adapter";
import { CloseButton } from "@/components/ui/custom-buttons";

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
        <SizeAdapter
          sm={
            <div className="flex justify-between items-center">
              <div />
              <h2 className="headline text-center p-4">{instance.getItem("new_playlist")}</h2>
              <CloseButton onClick={() => setIsOpen(false)} className="text-foreground" />
            </div>
          }
          md={<h2 className="headline text-center p-4">{instance.getItem("new_playlist")}</h2>}
        />
        <NewPlaylistForm axe="y" onSubmit={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
