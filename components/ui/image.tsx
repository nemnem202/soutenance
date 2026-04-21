import { DEFAULT_RESOLUTIONS } from "@/config/image";
import { generateImageVariations } from "@/lib/utils";
import type { ImgHTMLAttributes } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  src: string;
  resolutions?: [number, number][];
}

export default function Image({
  alt,
  src,
  resolutions = DEFAULT_RESOLUTIONS,
  sizes,
  width,
  ...props
}: ImageProps) {
  const variations = generateImageVariations(src, resolutions);

  const srcSetString = variations
    .map((url, index) => {
      const [w] = resolutions[index];
      return `${url} ${w}w`;
    })
    .join(", ");

  const resolvedSizes = sizes ?? (width ? `${width}px` : "100vw");

  return (
    <img src={src} alt={alt} srcSet={srcSetString} sizes={resolvedSizes} width={width} {...props} />
  );
}
