/**
 * The Palma Pool Club mark, recreated as inline SVG.
 *
 * No vector original exists — logo.jpg is 150×150. This is redrawn from that
 * file and from the DJ Byedov poster artwork: a palm silhouette inside a thin
 * circular badge over two wave rules, PALMA in wide-tracked caps beneath, and
 * POOL CLUB in a small tracked label between two rules.
 *
 * Colour comes from `currentColor`, so it inherits the section's mode — brass
 * on cream in day mode, gold on black in night mode. See OPEN_QUESTIONS.md #9.
 */

/** Badge only — palm in a circle. Used in the nav and as a small accent. */
export function PalmMark({ className = "" }: { className?: string }) {
  return (
    /* Tight viewBox around the badge only. The full lockup's 0 0 200 132 box
       leaves ~2/3 of its width empty either side of the circle, so reusing it
       here rendered the mark at a third of its intended size — a 36px-wide
       nav logo came out as an 11px dot. */
    <svg
      viewBox="64 8 72 72"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="44" r="32" strokeWidth="1.6" />

      {/* Fronds, radiating from the crown */}
      <g strokeWidth="2.2" strokeLinecap="round">
        <path d="M100 34 Q 88 26 76 40" />
        <path d="M100 34 Q 112 26 124 40" />
        <path d="M100 34 Q 86 22 78 26" />
        <path d="M100 34 Q 114 22 122 26" />
        <path d="M100 34 Q 94 20 86 17" />
        <path d="M100 34 Q 106 20 114 17" />
      </g>

      {/* Trunk */}
      <path d="M100 34 C 101 44 100 54 97 63" strokeWidth="2.4" strokeLinecap="round" />

      {/* Water */}
      <g strokeWidth="1.6" strokeLinecap="round">
        <path d="M80 68 q 10 -4 20 0 t 20 0" />
        <path d="M84 74 q 8 -3.5 16 0 t 16 0" />
      </g>
    </svg>
  );
}

/** Full lockup — badge, PALMA wordmark, POOL CLUB label. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 132"
      className={className}
      fill="none"
      stroke="currentColor"
      role="img"
      aria-label="Palma Pool Club"
    >
      <circle cx="100" cy="44" r="32" strokeWidth="1.6" />

      <g strokeWidth="2.2" strokeLinecap="round">
        <path d="M100 34 Q 88 26 76 40" />
        <path d="M100 34 Q 112 26 124 40" />
        <path d="M100 34 Q 86 22 78 26" />
        <path d="M100 34 Q 114 22 122 26" />
        <path d="M100 34 Q 94 20 86 17" />
        <path d="M100 34 Q 106 20 114 17" />
      </g>

      <path d="M100 34 C 101 44 100 54 97 63" strokeWidth="2.4" strokeLinecap="round" />

      <g strokeWidth="1.6" strokeLinecap="round">
        <path d="M80 68 q 10 -4 20 0 t 20 0" />
        <path d="M84 74 q 8 -3.5 16 0 t 16 0" />
      </g>

      <text
        x="100"
        y="105"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontFamily="var(--font-source-sans), system-ui, sans-serif"
        fontSize="26"
        fontWeight="300"
        letterSpacing="7"
        /* letter-spacing pushes the string right; nudge back to true centre */
        dx="3.5"
      >
        PALMA
      </text>

      <g strokeWidth="1" opacity="0.8">
        <line x1="34" y1="119" x2="62" y2="119" />
        <line x1="138" y1="119" x2="166" y2="119" />
      </g>

      <text
        x="100"
        y="122"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontFamily="var(--font-source-sans), system-ui, sans-serif"
        fontSize="8"
        fontWeight="500"
        letterSpacing="3.6"
        dx="1.8"
      >
        POOL CLUB
      </text>
    </svg>
  );
}
