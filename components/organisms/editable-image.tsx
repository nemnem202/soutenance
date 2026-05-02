import { Upload } from "lucide-react";
import PlaceholderImage from "@/assets/images/placeholder.webp";
import useEditImage from "@/hooks/use-edit-image";
import Image from "../ui/image";
import { Spinner } from "../ui/spinner";

export interface EditableImageProps {
  onImageChange: (image: File) => void;
  src?: string;
  alt?: string;
}

export default function EditableImage({ onImageChange, src, alt }: EditableImageProps) {
  const editImage = useEditImage({ onImageChange, src, alt });

  const { imageSource, changeImage, inputRef, handleImageChange, isLoading } = editImage;

  if (isLoading)
    return (
      <div className="size-full flex justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="size-full relative z-0 group/image">
        <button
          type="button"
          className={`cursor-pointer absolute inset-0 bg-popover transition z-1 flex items-center justify-center opacity-0 group-hover/image:opacity-40`}
          onClick={(e) => {
            e.preventDefault();
            changeImage();
          }}
        >
          <Upload size={50} />
        </button>

        <Image
          className="size-full object-cover z-0"
          src={imageSource ?? PlaceholderImage}
          alt={alt ?? ""}
          loading="lazy"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleImageChange}
      />
    </>
  );
}
