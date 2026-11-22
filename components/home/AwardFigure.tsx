import { getImageProps, type StaticImageData } from "next/image";
import { AWARD } from "@/lib/company";
import { cn } from "@/lib/utils";
import avif320 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-320.avif";
import avif480 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-480.avif";
import avif640 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-640.avif";
import avif960 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-960.avif";
import webp320 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-320.webp";
import webp480 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-480.webp";
import webp640 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-640.webp";
import webp960 from "@/public/images/awards/2026-best-mortgage-lender-suffolk-960.webp";

// next.config sets images.unoptimized, so Next never resizes. These widths were generated
// once from the 1254px PNG in the same folder; the browser picks one file from `sizes`.
const AVIF = [avif320, avif480, avif640, avif960];
const WEBP = [webp320, webp480, webp640, webp960];

/** Rendered width: a 152px thumbnail beside the caption on phones, 340px on desktop. */
const SIZES = "(min-width: 1024px) 340px, 152px";

function srcSet(images: StaticImageData[]): string {
  return images.map((image) => `${image.src} ${image.width}w`).join(", ");
}

/**
 * The 2026 BusinessRate award plaque. Rendered once: the hero grid moves it under the h1 on
 * phones and into the right column on desktop, so no breakpoint downloads a second copy.
 */
export function AwardFigure({ className }: { className?: string }) {
  const {
    props: { srcSet: _unused, ...img },
  } = getImageProps({ src: webp640, alt: AWARD.alt, sizes: SIZES, loading: "eager" });

  const caption = AWARD.sourceUrl ? (
    <a
      href={AWARD.sourceUrl}
      target="_blank"
      rel="noopener"
      className="underline-offset-4 hover:text-white hover:underline"
    >
      {AWARD.caption}
    </a>
  ) : (
    AWARD.caption
  );

  return (
    <figure
      className={cn(
        "flex items-center gap-4 lg:flex-col lg:items-center lg:gap-4 lg:text-center",
        className,
      )}
    >
      <picture className="block w-[152px] shrink-0 lg:w-full lg:max-w-[340px]">
        <source type="image/avif" srcSet={srcSet(AVIF)} sizes={SIZES} />
        <source type="image/webp" srcSet={srcSet(WEBP)} sizes={SIZES} />
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props come from getImageProps */}
        <img
          {...img}
          className="h-auto w-full rounded-board border border-brand-500/25 shadow-lift"
        />
      </picture>
      <figcaption className="text-xs font-semibold leading-snug text-brand-200/85 sm:text-sm lg:max-w-[340px]">
        {caption}
      </figcaption>
    </figure>
  );
}
