import Image, { type ImageProps } from "next/image";
import { u } from "@/lib/unsplash";
import { cn } from "@/lib/cn";

type Props = Omit<ImageProps, "src" | "alt"> & {
  id: string;
  alt: string;
  crop?: string; // aspect ratio for imgix crop, e.g. "4:3"
  "data-preview-field-path"?: string;
};

/**
 * Photo through next/image + our CDN loader (see lib/image-loader.ts). `id` is an Unsplash id or any
 * image URL. If the dealer clears the image in the Fivora editor, an empty placeholder keeps the
 * editable target on the page (next/image cannot render an empty src).
 */
export function Photo({ id, alt, crop, quality = 70, ...rest }: Props) {
  if (!id) {
    return (
      <span
        role="img"
        aria-label={alt || undefined}
        className={cn(rest.fill ? "absolute inset-0" : "block", "bg-media", rest.className)}
        {...{ "data-preview-field-path": rest["data-preview-field-path"] }}
      />
    );
  }
  return <Image src={u(id, crop ? { fit: "crop", ar: crop } : {})} alt={alt} quality={quality} {...rest} />;
}
