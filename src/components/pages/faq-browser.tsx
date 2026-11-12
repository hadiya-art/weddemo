"use client";

import { useState } from "react";
import type { Faq } from "@/content/faq";
import { cn } from "@/lib/cn";
import { FaqAccordion } from "./faq-accordion";

type Category = Faq["category"];

/** Category filter chips + grouped accordions for the FAQ page. */
export function FaqBrowser({ items, categories }: { items: Faq[]; categories: Category[] }) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const visible = filter === "All" ? categories : [filter];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p id="faq-filter-label" className="eyebrow text-ink-subtle">
          Filter by topic
        </p>
        <div
          role="group"
          aria-labelledby="faq-filter-label"
          className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-stretch"
        >
          {(["All", ...categories] as const).map((c) => {
            const active = filter === c;
            const count = c === "All" ? items.length : items.filter((f) => f.category === c).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-full px-4 py-2 text-[0.9rem] ring-1 ring-inset transition-colors duration-200 lg:rounded-xl lg:py-2.5",
                  active
                    ? "bg-midnight text-white ring-midnight"
                    : "bg-white text-ink-2 ring-line-strong hover:ring-ink/25",
                )}
              >
                {c}
                <span className={cn("font-mono text-[0.68rem] tabular-nums", active ? "text-electric-300" : "text-ink-subtle")}>
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="sr-only">
          {filter === "All" ? `Showing all ${items.length} questions` : `Showing ${filter} questions`}
        </p>
      </div>

      <div className="space-y-14">
        {visible.map((cat) => (
          <section key={cat} aria-labelledby={`faq-cat-${slug(cat)}`}>
            <h2 id={`faq-cat-${slug(cat)}`} className="flex items-baseline gap-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-ink">
              {cat}
            </h2>
            <FaqAccordion items={items.filter((f) => f.category === cat)} className="mt-4" />
          </section>
        ))}
      </div>
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
