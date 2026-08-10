import { Flame, Martini, Snowflake, Star, Users } from "lucide-react";
import { markerLabels, type Marker } from "@/content/menu";

/**
 * The ★ / 🌶 / 👥 / ❄ / cocktail markers from the printed cards, as SVG icons.
 *
 * BUILD_PROMPT.md §6 is explicit: render these as icons with a legend, never
 * as literal characters — emoji as UI is a §0 rule 4 violation and they do not
 * render consistently across platforms.
 */
const icons: Record<Marker, typeof Star> = {
  recommended: Star,
  spicy: Flame,
  sharing: Users,
  cold: Snowflake,
  cocktail: Martini,
};

export function MenuMarker({ marker }: { marker: Marker }) {
  const Icon = icons[marker];
  return (
    <Icon
      size={14}
      className="shrink-0 text-accent"
      /* Every marker carries its meaning as a label — an icon alone is not
         accessible, and these change the meaning of the item. */
      aria-label={markerLabels[marker]}
      role="img"
      fill={marker === "recommended" ? "currentColor" : "none"}
    />
  );
}

export function MenuLegend({ markers }: { markers: Marker[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {markers.map((m) => {
        const Icon = icons[m];
        return (
          <li key={m} className="flex items-center gap-2 text-sm text-text-muted">
            <Icon
              size={14}
              className="shrink-0 text-accent"
              aria-hidden
              fill={m === "recommended" ? "currentColor" : "none"}
            />
            {markerLabels[m]}
          </li>
        );
      })}
    </ul>
  );
}
