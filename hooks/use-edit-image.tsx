import { useEffect, useRef, useState, type WheelEvent } from "react";
import type { EditableImageProps } from "@/components/organisms/editable-image";
import { logger } from "@/lib/logger";
import { errorToast } from "@/lib/toaster";
import imageCompression from "browser-image-compression";

export default function useEditImage(props: EditableImageProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSource, setImageSource] = useState<string | undefined>(props.src);
  const [open, setOpen] = useState(false);
  const [avatarZoom, setAvatarZoom] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: qsdqsd
  useEffect(() => {
    if (!imageFile) return;
    props.onImageChange(imageFile);
  }, [imageFile]);

  return {
    handleImageChange,
    handleWheel,
    changeImage,
    imageFile,
    imageSource,
    open,
    setOpen,
    avatarZoom,
    setAvatarZoom,
    inputRef,
    isLoading,
  };
}
