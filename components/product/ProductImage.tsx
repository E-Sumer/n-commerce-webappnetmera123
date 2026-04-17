/**
 * ProductImage — deterministic SVG dummy image (data URI).
 *
 * The image is generated in-memory and embedded as a data URL:
 * - no HTTP image requests
 * - no duplicate network fetches
 * - stable visual per product/color/variant
 */

interface Props {
  name: string;
  colorHex: string; // Primary color of the selected variant
  colorName: string;
  imageUrl?: string;
  variant?: number; // 0 | 1 | 2 — controls gradient angle + shape offsets
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "auto" | "high" | "low";
}

// Blend a hex color toward white by `ratio` (0 = original, 1 = pure white)
function blendToWhite(hex: string, ratio: number): string {
  const clean = hex.replace("#", "").padStart(6, "0");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const nr = Math.round(r + (255 - r) * ratio);
  const ng = Math.round(g + (255 - g) * ratio);
  const nb = Math.round(b + (255 - b) * ratio);
  return `rgb(${nr},${ng},${nb})`;
}

// Luminance 0-255 of a hex color
function luminance(hex: string): number {
  const clean = hex.replace("#", "").padStart(6, "0");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const ANGLE_BY_VARIANT = [145, 165, 120];
const CIRCLE_OFFSETS: [string, string][] = [
  ["15%", "10%"],
  ["55%", "5%"],
  ["-5%", "45%"],
];

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const IMAGE_SRC_CACHE = new Map<string, string>();

function makeDummyProductSvg({
  name,
  colorName,
  colorHex,
  variant,
}: {
  name: string;
  colorName: string;
  colorHex: string;
  variant: number;
}): string {
  const lum = luminance(colorHex);
  const blendRatio = lum > 200 ? 0.55 : 0.8;
  const accentRatio = lum > 200 ? 0.15 : 0.45;

  const bgLight = blendToWhite(colorHex, blendRatio);
  const bgDark = blendToWhite(colorHex, blendRatio - 0.2);
  const accent = blendToWhite(colorHex, accentRatio);
  const angle = ANGLE_BY_VARIANT[variant % 3];
  const [cx, cy] = CIRCLE_OFFSETS[variant % 3];

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="${name} ${colorName}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle}, 0.5, 0.5)">
      <stop offset="0%" stop-color="${bgDark}" />
      <stop offset="100%" stop-color="${bgLight}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.75" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)" />
  <circle cx="${cx}" cy="${cy}" r="420" fill="url(#glow)" />
  <circle cx="1030" cy="1030" r="260" fill="${accent}" fill-opacity="0.35" />
  <g font-family="Inter, Arial, sans-serif" fill="${accent}" fill-opacity="0.72">
    <text x="76" y="1080" font-size="38" letter-spacing="6">${name.toUpperCase()}</text>
    <text x="76" y="1130" font-size="28" letter-spacing="5" fill-opacity="0.55">${colorName.toUpperCase()}</text>
  </g>
</svg>`.trim();
}

export default function ProductImage({
  name,
  colorHex,
  colorName,
  imageUrl,
  variant = 0,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
}: Props) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${name} — ${colorName}`}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        draggable={false}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  const cacheKey = `${name}|${colorHex}|${colorName}|${variant}`;
  let src = IMAGE_SRC_CACHE.get(cacheKey);
  if (!src) {
    src = svgDataUri(
      makeDummyProductSvg({
        name,
        colorHex,
        colorName,
        variant,
      })
    );
    IMAGE_SRC_CACHE.set(cacheKey, src);
  }

  return (
    <img
      src={src}
      alt={`${name} — ${colorName}`}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      draggable={false}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
