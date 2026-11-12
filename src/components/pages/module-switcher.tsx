"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { id: string; index: string; label: string };

/**
 * Sticky in-page navigation between module sections. Plain anchor links (so it
 * works without JS); the active state follows scroll position.
 */
export function ModuleSwitcher({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active pill visible on narrow screens where the list scrolls.
  useEffect(() => {
    if (!active || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    const list = listRef.current;
    const left = el.offsetLeft - (list.clientWidth - el.clientWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Modules" className="pointer-events-none sticky top-[4.75rem] z-30 flex justify-center px-3 sm:top-[5.25rem]">
      <ul
        ref={listRef}
        className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/85 p-1 shadow-[0_0_0_1px_rgb(11_16_32/0.07),0_12px_32px_-14px_rgb(11_16_32/0.3)] backdrop-blur-xl [scrollbar-width:none]"
      >
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} data-id={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.86rem] whitespace-nowrap transition-colors duration-300",
                  isActive ? "bg-midnight text-white" : "text-ink-muted hover:bg-ink/[0.04] hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn("font-mono text-[0.66rem]", isActive ? "text-electric-300" : "text-ink-subtle")}
                >
                  {item.index}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
