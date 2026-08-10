import Image from "next/image";
import { images, type ImageSlotId } from "@/content/images";
import { ImageSlot } from "./ImageSlot";

/**
 * The only way a photograph gets onto this site.
 *
 * Reads the typed manifest, so components never touch a raw path and alt text
 * can never be forgotten. Falls back to <ImageSlot> when no file exists.
 */
export function Photo({
  id,
  sizes,
  priority = false,
  className = "",
  fill = false,
}: {
  id: ImageSlotId;
  /** Required whenever `fill` is used or the image is responsive. */
  sizes?: string;
  /** Only the Home hero should set this. */
  priority?: boolean;
  className?: string;
  fill?: boolean;
}) {
  const entry = images[id];

  if (!entry.src) return <ImageSlot id={id} className={className} fill={fill} />;

  if (fill) {
    return (
      <Image
        src={entry.src}
        alt={entry.alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        /* Focal point from the manifest — without it a uniform tile keeps the
           centre of the frame, which on a tall photo is rarely the subject. */
        style={{ objectPosition: entry.focal }}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <Image
      src={entry.src}
      alt={entry.alt}
      width={entry.width}
      height={entry.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
