"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, CornerDownLeft, Search, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { EVENT_TYPE_META } from "@/lib/demo/catalog";
import { formatMediumDate } from "@/lib/demo/dates";
import { useDemo } from "./store";
import { IconBtn, PopoverPanel, StatusBadge, useDismiss } from "./ui";

type Result =
  | { kind: "event"; id: string; eventId: string; title: string; sub: string }
  | { kind: "client"; id: string; eventId: string; title: string; sub: string };

export function GlobalSearch() {
  const { data, openEvent } = useDemo();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const close = () => {
    setOpen(false);
    setMobileOpen(false);
  };
  useDismiss(open || mobileOpen, [wrapRef], close);

  // Keyboard shortcut: "/" or Ctrl/⌘ + K focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        if (document.querySelector('[aria-modal="true"]')) return;
        e.preventDefault();
        setMobileOpen(true);
        setOpen(true);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const events = data.events
      .filter((e) =>
        [e.title, e.client.name, e.venue, e.city, e.id, EVENT_TYPE_META[e.type].label].some((f) => f.toLowerCase().includes(q)),
      )
      .slice(0, 6)
      .map<Result>((e) => ({
        kind: "event",
        id: `ev-${e.id}`,
        eventId: e.id,
        title: e.title,
        sub: `${formatMediumDate(e.date)} · ${e.venue}, ${e.city}`,
      }));
    const seen = new Set<string>();
    const clients = data.events
      .filter((e) => e.client.name.toLowerCase().includes(q))
      .filter((e) => (seen.has(e.client.name) ? false : (seen.add(e.client.name), true)))
      .slice(0, 3)
      .map<Result>((e) => {
        const count = data.events.filter((x) => x.client.name === e.client.name).length;
        return {
          kind: "client",
          id: `cl-${e.id}`,
          eventId: e.id,
          title: e.client.name,
          sub: `Client · ${count} event${count === 1 ? "" : "s"} · ${e.client.phone}`,
        };
      });
    return [...events, ...clients];
  }, [data.events, query]);

  const choose = (r: Result) => {
    openEvent(r.eventId);
    setQuery("");
    close();
  };

  const activeIndex = Math.min(active, Math.max(0, results.length - 1));
  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <IconBtn
        label="Search events and clients"
        className="md:hidden"
        onClick={() => {
          setMobileOpen(true);
          setOpen(true);
          window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
      >
        <Search aria-hidden className="size-[18px]" />
      </IconBtn>
      <div
        className={cn(
          "items-center",
          mobileOpen
            ? "fixed inset-x-0 top-9 z-40 flex h-14 gap-2 border-b border-line bg-white px-3 md:static md:h-auto md:border-0 md:p-0"
            : "hidden md:flex",
        )}
      >
        {mobileOpen && (
          <IconBtn label="Close search" className="md:hidden" onClick={close}>
            <ArrowLeft aria-hidden className="size-4" />
          </IconBtn>
        )}
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-subtle" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={showPanel && results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined}
            aria-label="Search events and clients"
            placeholder="Search events, clients…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(results.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter" && results[activeIndex]) {
                e.preventDefault();
                choose(results[activeIndex]);
              } else if (e.key === "Escape") {
                setQuery("");
                close();
              }
            }}
            className="h-8 w-full rounded-lg border border-line bg-mist/70 pr-10 pl-8 text-[13px] text-ink transition-[border-color,box-shadow,background-color] placeholder:text-ink-subtle hover:border-line-strong focus:border-electric focus:bg-white focus:shadow-[0_0_0_3px_rgb(56_107_255/0.15)] focus-visible:outline-none md:w-56 lg:w-64 [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border border-line bg-white px-1.5 font-mono text-[10px] text-ink-subtle md:block">
            /
          </kbd>
        </div>
      </div>
      <PopoverPanel
        open={showPanel}
        label="Search results"
        className={cn("w-[min(92vw,380px)] overflow-hidden p-1.5", mobileOpen ? "fixed top-[6.25rem] right-3 left-3 w-auto md:absolute md:top-[calc(100%+8px)] md:left-auto md:w-[380px]" : "")}
      >
        {results.length === 0 ? (
          <p className="px-3 py-6 text-center text-[13px] text-ink-subtle">No events or clients match “{query.trim()}”.</p>
        ) : (
          <ul id={listId} role="listbox" aria-label="Events and clients" className="max-h-[60vh] overflow-y-auto">
            {results.map((r, i) => {
              const event = data.events.find((e) => e.id === r.eventId);
              const isActive = i === activeIndex;
              return (
                <li
                  key={r.id}
                  id={`${listId}-${r.id}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(r)}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2", isActive && "bg-mist")}
                >
                  {r.kind === "event" && event ? (
                    <span aria-hidden className={cn("size-2 shrink-0 rounded-[3px]", EVENT_TYPE_META[event.type].dot)} />
                  ) : (
                    <UserRound aria-hidden className="size-3.5 shrink-0 text-ink-subtle" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">{r.title}</span>
                    <span className="block truncate text-[11.5px] text-ink-subtle">{r.sub}</span>
                  </span>
                  {r.kind === "event" && event && <StatusBadge status={event.status} className="hidden sm:inline-flex" />}
                  {isActive && <CornerDownLeft aria-hidden className="size-3.5 shrink-0 text-ink-subtle" />}
                </li>
              );
            })}
          </ul>
        )}
      </PopoverPanel>
    </div>
  );
}
