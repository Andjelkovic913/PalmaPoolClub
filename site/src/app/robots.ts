import type { MetadataRoute } from "next";

/**
 * Crawler policy.
 *
 * **Closed by default.** A deployment is only opened to search engines when
 * `SITE_IS_PRODUCTION=true` is set on it. Everything else — Vercel preview
 * URLs, the staging link a colleague is reviewing, a local build — is
 * disallowed outright.
 *
 * The failure this prevents is expensive and slow to undo: a `*.vercel.app`
 * preview getting indexed before launch, so the venue's own name returns a
 * half-finished site with `<Todo>` markers and seeded test bookings, and the
 * real domain later competes with it for its own brand.
 *
 * `/admin` and `/rezervacija/*` are disallowed in every environment, including
 * production. Both already send `noindex` in their metadata; this is the
 * second lock, so a crawler that ignores one still has the other.
 *
 * Phase 8 extends this with the sitemap and JSON-LD. Until then the safe
 * default is: nobody crawls anything.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.SITE_IS_PRODUCTION === "true";
  const base = process.env.NEXT_PUBLIC_SITE_URL;

  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Owner-only surfaces. Never indexable, in any environment.
        disallow: ["/admin", "/rezervacija/"],
      },
    ],
    ...(base ? { host: base, sitemap: `${base}/sitemap.xml` } : {}),
  };
}
