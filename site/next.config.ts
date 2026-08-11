import type { NextConfig } from "next";

/**
 * A deployment is only opened to search engines when `SITE_IS_PRODUCTION=true`
 * is set on it. Preview deployments, the link being shown to friends, and any
 * local build are all closed.
 */
const isPublic = process.env.SITE_IS_PRODUCTION === "true";

const nextConfig: NextConfig = {
  /**
   * The dev-mode route indicator floats over the bottom-left of every page,
   * which lands on top of the footer in review screenshots. Compile and
   * runtime errors are still surfaced with this off.
   */
  devIndicators: false,

  async headers() {
    /**
     * `X-Robots-Tag` on EVERY response of a non-production deployment.
     *
     * `src/app/robots.ts` already disallows crawling, but robots.txt is a
     * request, not a rule: a URL that someone shares or links to can still be
     * indexed — Google's own docs say a disallowed page may appear in results
     * without its content. This header is the instruction Google actually
     * obeys, and it cannot be bypassed by an inbound link.
     *
     * The failure it prevents: a preview being indexed before launch, so the
     * venue's own name returns a half-finished site with test bookings in it,
     * and the real domain later competes with a `.vercel.app` for its own brand.
     *
     * Flip it by setting SITE_IS_PRODUCTION=true on the production deployment
     * only — never on a preview.
     */
    if (isPublic) return [];

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
    ];
  },
};

export default nextConfig;
