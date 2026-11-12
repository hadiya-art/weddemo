/**
 * FAQ content. Answers describe the CONCEPT honestly — no claims about a real,
 * shipped product, pricing, integrations or customers.
 */
export type Faq = { id: string; q: string; a: string; category: "Product" | "Demo" | "Getting started" };

export const faqs: Faq[] = [
  {
    id: "what-is",
    category: "Product",
    q: "What is EVENTOS?",
    a: "EVENTOS is a concept for an event business workspace — one place for enquiries, bookings, menus, quotations, team assignments and guest experience. This site is a design and product demonstration, and EVENTOS is a placeholder brand name.",
  },
  {
    id: "who-for",
    category: "Product",
    q: "Who is it designed for?",
    a: "The concept is shaped around caterers, decorators, wedding planners and event organisers — teams that juggle many events, vendors and client conversations at the same time.",
  },
  {
    id: "modules",
    category: "Product",
    q: "What are the four modules?",
    a: "An Admin Dashboard for owners, a Staff Dashboard for coordinators and sales, a Manager App for on-ground event leads, and a Customer App for hosts and guests. Each is an illustrative module you can explore in the interactive demo.",
  },
  {
    id: "demo-real",
    category: "Demo",
    q: "Is the interactive demo connected to real data?",
    a: "No. Every client, event, dish, price and message in the demo is fictional sample data stored only in your browser. Actions like assigning staff or changing a task status work inside the demo, but nothing is sent to or saved on any server.",
  },
  {
    id: "quote-math",
    category: "Demo",
    q: "Are the quotation figures accurate?",
    a: "The calculator performs real arithmetic on sample prices — per-plate costs, guest counts, add-ons, discounts and an illustrative tax rate. Prices and the tax rate are placeholders and should be configured with real business rules before any production use.",
  },
  {
    id: "reset",
    category: "Demo",
    q: "Can I reset the demo?",
    a: "Yes. Use “Reset sample data” inside the demo to restore the original fictional events, menus and tasks at any time.",
  },
  {
    id: "mobile",
    category: "Product",
    q: "Does it work on phones and tablets?",
    a: "The concept is designed responsively. The Manager and Customer modules are imagined as mobile-first experiences, while the Admin and Staff dashboards adapt from large desktops down to tablets and phones.",
  },
  {
    id: "customise",
    category: "Getting started",
    q: "Can the workspace be tailored to a specific business?",
    a: "That is the intent of this concept. Branding, modules, menu categories, pricing rules and workflows would be defined together with the business during a discovery phase.",
  },
  {
    id: "book",
    category: "Getting started",
    q: "What happens when I book a demo?",
    a: "On this concept site the booking form validates your details but does not send them anywhere — it is a simulated flow. In a live version, it would route enquiries to the team’s inbox or CRM.",
  },
  {
    id: "pricing",
    category: "Getting started",
    q: "How much does it cost?",
    a: "Pricing has not been defined for this concept. Any plans, tiers or commercial terms would be confirmed directly by the business.",
  },
];

/** Subset shown on the homepage. */
export const homeFaqIds = ["what-is", "who-for", "demo-real", "quote-math", "customise", "book"] as const;
