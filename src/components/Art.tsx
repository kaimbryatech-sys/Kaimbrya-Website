import * as inlineArt from "@/art/generated";

export type InlineArtName = keyof typeof inlineArt;

/** Small illustrations inlined as markup, so their labels use the page's own font. */
export function Art({ name, className }: { name: InlineArtName; className?: string }) {
  return <div className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: inlineArt[name] }} />;
}

export type SceneName = "hero-scene" | "audience-gated" | "audience-strata" | "audience-managers" | "audience-developers" | "welcome";

/**
 * Decorative brand scenes as separate, cacheable SVG files (public/art). Lazy by default,
 * cropped to their box with object-fit; `alt` stays empty because they are decorative.
 */
export function Scene({ name, className, priority = false, position }: { name: SceneName; className?: string; priority?: boolean; position?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <img
        src={`/art/${name}.svg`}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position }}
      />
    </div>
  );
}
