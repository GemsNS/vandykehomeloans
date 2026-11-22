import { cn } from "@/lib/utils";

/**
 * The universal (HUD, public-domain) Equal Housing logo: a house outline with an equals sign
 * inside, captioned "EQUAL HOUSING LENDER". Drawn in currentColor so it reads on both the dark
 * footer and light pages; size it with a height class (h-16 or larger keeps the caption readable).
 */
export function EqualHousingLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 104"
      role="img"
      aria-label="Equal Housing Lender"
      className={cn("shrink-0", className)}
      fill="currentColor"
    >
      {/* House + equals sign, scaled down so the caption stays legible at small sizes. */}
      <g transform="translate(10 2) scale(0.8)">
        {/* House outline: outer silhouette minus the interior (even-odd). */}
        <path fillRule="evenodd" d="M50 4 4 40h10v44h72V40h10L50 4Zm0 13L26 36v38h48V36L50 17Z" />
        {/* Equals sign */}
        <rect x="35" y="44" width="30" height="7" />
        <rect x="35" y="58" width="30" height="7" />
      </g>
      <text
        x="50"
        y="86"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        textLength="98"
        lengthAdjust="spacingAndGlyphs"
      >
        EQUAL HOUSING
      </text>
      <text
        x="50"
        y="102"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        textLength="62"
        lengthAdjust="spacingAndGlyphs"
      >
        LENDER
      </text>
    </svg>
  );
}
