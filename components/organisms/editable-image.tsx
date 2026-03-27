import { Pen, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "../ui/slider";
import useEditImage from "@/hooks/use-edit-image";
import Modal from "./modal";
import { useLanguage } from "@/hooks/use-language";
import useScreen from "@/hooks/use-screen";
import PlaceholderImage from "@/assets/images/placeholder.webp";

export interface EditableImageProps {
  onImageChange: (src: string) => void;
  src?: string;
  canBeEdited?: boolean;
  alt: string;
}

export default function EditableImage({ onImageChange, src, alt, canBeEdited = true }: EditableImageProps) {
  const editImage = useEditImage({ onImageChange, src, alt });

  const { hovered, setHovered, imageSource, changeImage, open, setOpen, inputRef, handleImageChange } = editImage;

  return (
    <>
      <div
        className="size-full relative z-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {canBeEdited && (
          <Button
            className={`absolute top-0 right-0 m-1 rounded-full z-2 ${!hovered && "hidden"}`}
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              if (imageSource) {
                setOpen(true);
              } else {
                changeImage();
              }
            }}
          >
            <Pen />
          </Button>
        )}

        <button
          className={`cursor-pointer absolute inset-0 bg-popover transition opacity-40 z-1 flex items-center justify-center ${!hovered && "!opacity-0"}`}
          onClick={(e) => {
            e.preventDefault();
            changeImage();
          }}
        >
          <Upload size={50} />
        </button>

        <img className="size-full object-cover z-0" src={imageSource ?? PlaceholderImage} alt={alt} loading="lazy" />
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="md" title="Edit image">
        <EditImageModalContent {...editImage} />
      </Modal>
      <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleImageChange} />
    </>
  );
}

type EditableImageModalProps = ReturnType<typeof useEditImage>;

function EditImageModalContent(props: EditableImageModalProps) {
  const { avatarEditorRef, avatarZoom, setAvatarZoom, changeImage, handleEditorEditsSave, handleWheel, imageSource } =
    props;

  const { instance } = useLanguage();
  const isMobile = useScreen() === "sm";

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleEditorEditsSave();
  };
  return (
    <div className="flex flex-col gap-2 w-fit items-center">
      <div className="overflow-hidden rounded-md w-fit" onWheel={handleWheel}>
        <AvatarEditor
          image={imageSource}
          borderRadius={0}
          border={0}
          scale={avatarZoom}
          width={isMobile ? 250 : 400}
          height={isMobile ? 250 : 400}
          ref={avatarEditorRef}
        />
      </div>
      <div className="flex gap-2 w-full">
        <Button
          className="rounded-full w-10 h-10 !aspect-square border-none"
          variant={"outline"}
          size={"icon"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setAvatarZoom((prev) => Math.max(1, (prev /= 1.1)));
          }}
        >
          <ZoomOut />
        </Button>
        <Slider
          min={1}
          max={5}
          step={0.1}
          value={[avatarZoom]}
          onValueChange={(v) => setAvatarZoom(v[0])}
          color="secondary"
        />
        <Button
          className="rounded-full w-10 h-10 !aspect-square border-none"
          variant={"outline"}
          size={"icon"}
          onClick={() => setAvatarZoom((prev) => (prev *= 1.1))}
        >
          <ZoomIn />
        </Button>
      </div>
      <div className="flex w-full justify-end gap-2">
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            changeImage();
          }}
        >
          <Upload />
        </Button>
        <Button className="title-3 w-fit" onClick={handleSave}>
          {instance.getItem("save")}
        </Button>
      </div>
    </div>
  );
}
