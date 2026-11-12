"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarRange, ChefHat, Flower2, HeartHandshake, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

type Audience = {
  id: string;
  label: string;
  icon: LucideIcon;
  headline: string;
  body: string;
  jobs: string[];
  flow: string[];
  modules: { label: string; href: string }[];
};

const audiences: Audience[] = [
  {
    id: "caterers",
    label: "Caterers",
    icon: ChefHat,
    headline: "From tasting table to the last plate served.",
    body: "Build menus once, cost them per plate, scale quantities with the headcount and keep the kitchen, service staff and client looking at the same numbers.",
    jobs: ["Menu builder with per-plate costing", "Guest-count driven quotations", "Service staff rosters per event"],
    flow: ["Tasting", "Menu", "Quantities", "Quotation", "Service"],
    modules: [
      { label: "Admin Dashboard", href: "/solutions#admin" },
      { label: "Customer App", href: "/solutions#customer" },
    ],
  },
  {
    id: "decorators",
    label: "Decorators",
    icon: Flower2,
    headline: "Every mandap, stage and centrepiece — on schedule.",
    body: "Package your décor offerings, plan site visits, assign install crews and vendors, and track every setup and teardown across venues.",
    jobs: ["Décor packages inside quotations", "Crew and vendor assignments", "Setup checklists per venue"],
    flow: ["Brief", "Package", "Site visit", "Install", "Teardown"],
    modules: [
      { label: "Staff Dashboard", href: "/solutions#staff" },
      { label: "Manager App", href: "/solutions#manager" },
    ],
  },
  {
    id: "planners",
    label: "Wedding planners",
    icon: HeartHandshake,
    headline: "Multi-day weddings, without the multi-app chaos.",
    body: "Hold every function, vendor, guest touchpoint and family conversation in one timeline — and give hosts a beautiful view of their celebration.",
    jobs: ["Multi-function event timelines", "Vendor coordination in one view", "Digital invitations and RSVPs"],
    flow: ["Enquiry", "Vendors", "Timeline", "Guests", "Day-of"],
    modules: [
      { label: "Admin Dashboard", href: "/solutions#admin" },
      { label: "Customer App", href: "/solutions#customer" },
    ],
  },
  {
    id: "organisers",
    label: "Event organisers",
    icon: CalendarRange,
    headline: "Corporate offsites to concerts, run like clockwork.",
    body: "Turn briefs into budgets, budgets into tasks, and tasks into a live run-of-show your on-ground leads can follow from their phones.",
    jobs: ["Brief-to-budget workflows", "Live run-of-show for leads", "Post-event feedback reports"],
    flow: ["Brief", "Budget", "Vendors", "Run-of-show", "Report"],
    modules: [
      { label: "Manager App", href: "/solutions#manager" },
      { label: "Staff Dashboard", href: "/solutions#staff" },
    ],
  },
];

export function Audiences() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const a = audiences[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = audiences.length - 1;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next >= 0) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section aria-labelledby="audiences-title" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div aria-hidden className="grid-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Who we serve"
          index="02"
          title={
            <span id="audiences-title">
              Built around the people who make <span className="accent-serif">celebrations</span> happen.
            </span>
          }
          description="Four kinds of event businesses, four very different days — one shared operating layer underneath."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div
            role="tablist"
            aria-label="Industries"
            aria-orientation="vertical"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-thin sm:mx-0 sm:px-0 lg:col-span-4 lg:flex-col lg:overflow-visible"
          >
            {audiences.map((item, i) => {
              const selected = i === active;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 lg:px-5 lg:py-5",
                    selected ? "text-ink" : "text-ink-muted hover:bg-mist hover:text-ink",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId={reduce ? undefined : "audience-active"}
                      className="absolute inset-0 -z-0 rounded-2xl bg-mist ring-1 ring-line"
                      transition={{ type: "spring", stiffness: 400, damping: 36 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex size-10 items-center justify-center rounded-xl transition-colors",
                      selected ? "bg-midnight text-white" : "bg-white text-ink-muted ring-1 ring-line",
                    )}
                  >
                    <Icon className="size-[1.15rem]" aria-hidden strokeWidth={1.6} />
                  </span>
                  <span className="relative">
                    <span className="block text-[0.98rem] font-medium tracking-[-0.01em]">{item.label}</span>
                    <span className="mt-0.5 hidden font-mono text-[0.68rem] tracking-wider text-ink-subtle uppercase lg:block">
                      {item.flow.length} stage workflow
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${a.id}`}
            tabIndex={0}
            className="on-dark relative overflow-hidden rounded-[1.75rem] bg-midnight p-7 text-white shadow-[var(--shadow-float)] sm:p-10 lg:col-span-8"
          >
            <div aria-hidden className="pointer-events-none absolute -top-1/2 -right-1/4 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(56,107,255,0.25),transparent)]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={a.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <p className="eyebrow text-electric-300">For {a.label.toLowerCase()}</p>
                <h3 className="mt-4 max-w-xl text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-[2rem]">
                  {a.headline}
                </h3>
                <p className="mt-4 max-w-xl leading-relaxed text-haze-muted">{a.body}</p>

                {/* Signature workflow */}
                <div className="mt-9">
                  <p className="eyebrow text-haze-subtle">Signature workflow</p>
                  <ol className="mt-4 flex flex-wrap items-center gap-y-3">
                    {a.flow.map((step, i) => (
                      <li key={step} className="flex items-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3.5 py-1.5 text-sm text-white ring-1 ring-inset ring-white/10">
                          <span className="font-mono text-[0.68rem] text-electric-300">{String(i + 1).padStart(2, "0")}</span>
                          {step}
                        </span>
                        {i < a.flow.length - 1 && (
                          <span aria-hidden className="mx-1.5 h-px w-4 bg-gradient-to-r from-white/30 to-white/5 sm:w-6" />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-9 grid gap-8 border-t border-white/10 pt-7 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow text-haze-subtle">What it handles</p>
                    <ul className="mt-4 space-y-2.5">
                      {a.jobs.map((j) => (
                        <li key={j} className="flex gap-3 text-[0.95rem] text-haze">
                          <span aria-hidden className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-electric" />
                          {j}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-haze-subtle">Modules you’d use most</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {a.modules.map((m) => (
                        <li key={m.label}>
                          <Link
                            href={m.href}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-electric-300/90"
                          >
                            {m.label}
                            <span aria-hidden>→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
