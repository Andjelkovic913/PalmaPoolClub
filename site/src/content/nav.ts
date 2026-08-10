/** Primary navigation. Route order matches PRD.md §5. */
export const navLinks = [
  { href: "/", label: "Početna" },
  { href: "/pricing", label: "Cenovnik" },
  { href: "/menu", label: "Meni" },
  { href: "/events", label: "Događaji" },
  { href: "/gallery", label: "Galerija" },
  { href: "/faq", label: "Česta pitanja" },
  { href: "/location", label: "Lokacija" },
] as const;

export const bookingCta = { href: "/book", label: "Rezerviši" } as const;
