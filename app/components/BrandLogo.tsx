import Image from "next/image";

// Intrinsic sizes of the two crops in /public. Kept here so callers only have to
// pick a rendered width and never have to restate the aspect ratio.
const sources = {
  full: { src: "/leading-law-logo.png", width: 1256, height: 287 },
  wordmark: { src: "/leading-law-wordmark.png", width: 888, height: 153 },
} as const;

export function BrandLogo({
  variant = "full",
  width = 240,
  priority = false,
  className,
}: {
  // "full" is the complete lockup including the tagline and the LAW / ADVISORY /
  // CONSULTANCY column. Below roughly 220px wide the tagline stops being legible,
  // so narrow slots (the sidebar) should use "wordmark" instead.
  variant?: keyof typeof sources;
  width?: number;
  priority?: boolean;
  className?: string;
}) {
  const source = sources[variant];
  const height = Math.round((source.height / source.width) * width);

  return (
    <Image
      className={["brand-logo", className].filter(Boolean).join(" ")}
      src={source.src}
      alt="Leading Law"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
    />
  );
}
