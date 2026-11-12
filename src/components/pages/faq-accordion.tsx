"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Faq } from "@/content/faq";
import { cn } from "@/lib/cn";

/**
 * Accessible FAQ accordion (WAI-ARIA accordion pattern).
 * - Each question is a <button> with aria-expanded / aria-controls inside a heading.
 * - Answers are role="region" labelled by their button; collapsed answers are inert.
 * - ArrowUp / ArrowDown / Home / End move focus between questions.
 * Multiple answers may be open at once.
 */
export function FaqAccordion({
  items,
  tone = "light",
  className,
  defaultOpenId,
  headingLevel = 3,
}: {
  items: Faq[];
  tone?: "light" | "dark";
  className?: string;
  /** Id of an item to open initially. */
  defaultOpenId?: string;
  headingLevel?: 2 | 3 | 4;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpenId ? [defaultOpenId] : []));
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const dark = tone === "dark";
  const Heading = `h${headingLevel}` as "h3";

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    let target: number | null = null;
    if (e.key === "ArrowDown") target = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp") target = index === 0 ? last : index - 1;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = last;
    if (target !== null) {
      e.preventDefault();
      buttons.current[target]?.focus();
    }
  };

  return (
    <div
      className={cn(
        "border-t",
        dark ? "border-white/[0.09]" : "border-ink/[0.09]",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = open.has(item.id);
        const buttonId = `${baseId}-q-${item.id}`;
        const panelId = `${baseId}-a-${item.id}`;
        return (
          <div
            key={item.id}
            className={cn("border-b", dark ? "border-white/[0.09]" : "border-ink/[0.09]")}
          >
            <Heading className="m-0">
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group flex w-full items-start gap-4 py-5 text-left transition-colors sm:gap-6 sm:py-6",
                  dark ? "text-white" : "text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-1 w-6 shrink-0 font-mono text-[0.7rem] tabular-nums transition-colors",
                    isOpen
                      ? dark
                        ? "text-electric-300"
                        : "text-electric-600"
                      : dark
                        ? "text-haze-subtle"
                        : "text-ink-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[1.04rem] leading-snug font-medium tracking-[-0.02em] sm:text-[1.15rem]",
                    !isOpen && (dark ? "group-hover:text-haze" : "group-hover:text-ink-2"),
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full transition-[background-color,box-shadow] duration-300",
                    dark
                      ? isOpen
                        ? "bg-white text-midnight"
                        : "text-white ring-1 ring-inset ring-white/15 group-hover:bg-white/[0.06]"
                      : isOpen
                        ? "bg-midnight text-white"
                        : "text-ink ring-1 ring-inset ring-ink/15 group-hover:bg-ink/[0.04]",
                  )}
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span
                    className={cn(
                      "absolute h-3 w-px bg-current transition-transform duration-300 ease-[var(--ease-out-expo)]",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "max-w-2xl pr-11 pb-6 pl-10 text-[0.98rem] leading-relaxed text-pretty sm:pl-12",
                    dark ? "text-haze-muted" : "text-ink-muted",
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
