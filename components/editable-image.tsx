import { Pen, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "./slider";
import useEditImage from "@/hooks/use-edit-image";
import placeHoldeImage1 from "../assets/images/placeholder.webp";

export interface EditableImagePops {
  onImageChange: (src: string) => void;
  src?: string;
  alt: string;
}

export default function EditableImage(props: EditableImagePops) {
  const {
    avatarEditorRef,
    avatarZoom,
    setAvatarZoom,
    changeImage,
    handleEditorEditsSave,
    handleImageChange,
    handleWheel,
    hovered,
    imageSource,
    inputRef,
    open,
    setHovered,
    setOpen,
  } = useEditImage(props);

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <div
            className="size-full relative z-0"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Button
              className={`absolute top-0 right-0 m-1 rounded-full z-2 ${!hovered && "hidden"}`}
              variant={"ghost"}
              size={"icon"}
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              <Pen />
            </Button>
            <button
              className={`cursor-pointer absolute inset-0 bg-popover transition opacity-40 z-1 flex items-center justify-center ${!hovered && "!opacity-0"} `}
              onClick={(e) => {
                e.preventDefault();
                changeImage();
              }}
            >
              <Upload size={50} />
            </button>
            <img className="size-full object-cover z-0" src={imageSource ?? placeHoldeImage1} alt={props.alt} />
          </div>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-2 w-fit">
          <div className="overflow-hidden rounded-md w-fit" onWheel={handleWheel}>
            <AvatarEditor
              image={imageSource}
              borderRadius={0}
              border={0}
              scale={avatarZoom}
              width={400}
              height={400}
              ref={avatarEditorRef}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="rounded-full w-10 h-10 !aspect-square border-none"
              variant={"outline"}
              size={"icon"}
              onClick={() => setAvatarZoom((prev) => Math.max(1, (prev /= 1.1)))}
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
                changeImage();
              }}
            >
              <Upload />
            </Button>
            <Button className="title-3 w-fit" onClick={handleEditorEditsSave}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleImageChange} />
    </>
  );
}
