import Image, { type ImageProps } from "next/image";
import { u } from "@/lib/unsplash";

type Props = Omit<ImageProps, "src" | "alt"> & {
  id: string;
  alt: string;
  crop?: string; // aspect ratio for imgix crop, e.g. "4:3"
};

/** Unsplash photo through next/image + our CDN loader (see lib/image-loader.ts). */
export function Photo({ id, alt, crop, quality = 70, ...rest }: Props) {
  return (
    <Image
      src={u(id, crop ? { fit: "crop", ar: crop } : {})}
      alt={alt}
      quality={quality}
      {...rest}
    />
  );
}
