import type { EditableImageProps } from "@/components/organisms/editable-image";
import { useEffect, useRef, useState, type WheelEvent } from "react";
import type AvatarEditor from "react-avatar-editor";

export default function useEditImage(props: EditableImageProps) {
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

  const handleImageChange = () => {
    if (!inputRef.current) return;
    const file = inputRef.current.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImageSource(imageUrl);
  };

  const handleEditorEditsSave = () => {
    if (!avatarEditorRef.current) return;

    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    const dataUrl = canvas.toDataURL("image/png");

    setImageSource(dataUrl);

    setOpen(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: qsdqsd
  useEffect(() => {
    if (!imageSource) return;
    props.onImageChange(imageSource);
  }, [imageSource]);

  return {
    handleEditorEditsSave,
    handleImageChange,
    handleWheel,
    changeImage,
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
