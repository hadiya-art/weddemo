/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL BRAND CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  EVENTOS is a fictional demonstration brand created for a client concept.
 *  Replace the values in this file (and in src/content/*) once the client
 *  confirms their real name, contact details and positioning.
 *
 *  Anything marked `placeholder: true` is intentionally NOT real and is shown
 *  with a visible "To be confirmed" tag across the site.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "EVENTOS",
  wordmark: "EVENTOS",
  descriptor: "Event Business OS",
  tagline: "Run every event. From one smarter workspace.",
  description:
    "A concept workspace for caterers, decorators, wedding planners and event organisers — bookings, menus, quotations, teams and guest experience in one place.",
  /** Shown site-wide. Keep true until the client approves a public launch. */
  isConceptDemo: true,
  conceptLabel: "Concept Demo",
  conceptNotice:
    "EVENTOS is a fictional concept brand built to demonstrate design and product direction. Features, data and names shown are illustrative only.",
  /** Used for metadata. Update when a real domain is confirmed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eventos-concept.vercel.app",
  locale: "en_IN",
  copyrightYear: 2026,
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Live Demo", href: "/demo" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const ctas = {
  primary: { label: "Book a Demo", href: "/book-demo" },
  secondary: { label: "Explore Demo", href: "/demo" },
} as const;

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Solutions", href: "/solutions" },
      { label: "Admin Dashboard", href: "/solutions#admin" },
      { label: "Staff Dashboard", href: "/solutions#staff" },
      { label: "Manager App", href: "/solutions#manager" },
      { label: "Customer App", href: "/solutions#customer" },
    ],
  },
  {
    title: "Experience",
    items: [
      { label: "Interactive Demo", href: "/demo" },
      { label: "Book a Demo", href: "/book-demo" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Concept Disclaimer", href: "/disclaimer" },
    ],
  },
];

/**
 * Contact placeholders. These are deliberately not real.
 * Replace `value` and set `placeholder: false` once confirmed by the client.
 */
export const contact = {
  email: { label: "Email", value: "hello@[your-domain].com", placeholder: true },
  phone: { label: "Phone", value: "+91 [00000 00000]", placeholder: true },
  whatsapp: { label: "WhatsApp", value: "+91 [00000 00000]", placeholder: true },
  address: {
    label: "Office",
    value: "[Street address], [City], [State] [PIN]",
    placeholder: true,
  },
  hours: { label: "Support hours", value: "[Mon–Sat, 10:00–19:00 IST]", placeholder: true },
} as const;

export const industries = [
  "Catering",
  "Decor & Design",
  "Wedding Planning",
  "Event Management",
  "Venue & Banquet",
  "Other",
] as const;

export const modules = [
  { id: "admin", label: "Admin Dashboard" },
  { id: "staff", label: "Staff Dashboard" },
  { id: "manager", label: "Manager App" },
  { id: "customer", label: "Customer App" },
  { id: "all", label: "The complete workspace" },
] as const;

export type ModuleId = (typeof modules)[number]["id"];
