import { screens, type ScreenName } from "@/content/screens.generated";

/** 1×1 transparent GIF: lets a <source> opt a viewport out of downloading an image. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

type ScreenProps = {
  name: ScreenName;
  alt: string;
  /** The `sizes` attribute: how wide the image is drawn at each breakpoint. */
  sizes: string;
  /** Above-the-fold images load immediately with high priority; everything else is lazy. */
  priority?: boolean;
  /** Skip the download below this width (the image is hidden there by CSS). */
  hideBelow?: number;
  className?: string;
};

/**
 * A real app screen as a responsive <picture>: AVIF with a WebP fallback at several
 * widths, with intrinsic width/height so the browser reserves space (no layout shift).
 */
export function Screen({ name, alt, sizes, priority = false, hideBelow, className }: ScreenProps) {
  const meta = screens[name];
  const srcset = (ext: string) => meta.widths.map((w) => `/screens/${name}-${w}.${ext} ${w}w`).join(", ");
  const fallback = meta.widths.find((w) => w >= 960) ?? meta.widths[meta.widths.length - 1];
  return (
    <picture>
      {hideBelow ? <source media={`(max-width: ${hideBelow - 1}px)`} srcSet={BLANK} /> : null}
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`/screens/${name}-${fallback}.webp`}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={`screen-img ${className ?? ""}`}
      />
    </picture>
  );
}
