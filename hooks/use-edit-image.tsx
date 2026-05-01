import { useEffect, useRef, useState, type WheelEvent } from "react";
import type AvatarEditor from "react-avatar-editor";
import type { EditableImageProps } from "@/components/organisms/editable-image";
import { logger } from "@/lib/logger";
import { errorToast } from "@/lib/toaster";
import imageCompression from "browser-image-compression";

export default function useEditImage(props: EditableImageProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSource, setImageSource] = useState<string | undefined>(props.src);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [avatarZoom, setAvatarZoom] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const avatarEditorRef = useRef<AvatarEditor>(null);

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      setAvatarZoom((prev) => Math.max(1, prev / 1.1));
    } else {
      setAvatarZoom((prev) => (prev *= 1.1));
    }
  };

  const changeImage = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleImageChange = async () => {
    if (!inputRef.current) return;
    const file = inputRef.current.files?.[0];
    if (!file) return;
    logger.info(`Taille originale : ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const sizeInMegabytes = compressedFile.size / 1024 / 1024;
      if (sizeInMegabytes > 1)
        return logger.error("The image supplied is too large, please choose another one.");
      logger.info(`Taille après conversion WebP : ${sizeInMegabytes.toFixed(2)} MB`);
      setImageFile(compressedFile);
      setImageSource(URL.createObjectURL(compressedFile));
    } catch (error) {
      logger.error("Image compression", error);
      errorToast("An error occured :/", "The image format is incorrect, try another one.");
    }
  };

  const handleEditorEditsSave = () => {
    if (!avatarEditorRef.current) return;

    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob], // ⚠️ tableau obligatoire
          "avatar.webp", // nom du fichier
          { type: "image/webp" } // MIME type
        );

        setImageFile(file);

        setOpen(false);
      },
      "image/webp",
      0.9
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: qsdqsd
  useEffect(() => {
    if (!imageFile) return;
    props.onImageChange(imageFile);
  }, [imageFile]);

  return {
    handleEditorEditsSave,
    handleImageChange,
    handleWheel,
    changeImage,
    imageFile,
    imageSource,
    hovered,
    setHovered,
    open,
    setOpen,
    avatarZoom,
    setAvatarZoom,
    inputRef,
    avatarEditorRef,
  };
}
