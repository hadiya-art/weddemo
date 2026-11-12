"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Leaf, Plus, Search, SearchX, Trash2, UtensilsCrossed, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { DISH_BY_ID, DISH_CATEGORIES, DISHES, GUESTS_MAX, GUESTS_MIN } from "@/lib/demo/catalog";
import { formatMediumDate } from "@/lib/demo/dates";
import { perPlate } from "@/lib/demo/derive";
import type { DemoEvent, Dish, DishCategory } from "@/lib/demo/types";
import { useDemo } from "../store";
import { Btn, Card, DietMark, EmptyState, IconBtn, Select, Stepper, Switch, Tabs, ViewHeader } from "../ui";

export function EventPicker({ label = "Event", className }: { label?: string; className?: string }) {
  const { data, dispatch } = useDemo();
  const id = useId();
  const options = [...data.events]
    .filter((e) => e.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[12px] font-medium text-ink-muted">
        {label}
      </label>
      <Select
        id={id}
        value={data.focusEventId}
        onChange={(e) => dispatch({ type: "focusEvent", eventId: e.target.value })}
        className="w-full"
      >
        {options.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title} · {formatMediumDate(e.date)}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function useFocusEvent(): DemoEvent {
  const { data } = useDemo();
  return data.events.find((e) => e.id === data.focusEventId) ?? data.events[0];
}

export function MenuView() {
  const { dispatch, navigate } = useDemo();
  const event = useFocusEvent();
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [category, setCategory] = useState<DishCategory | "all">("all");
  const searchId = useId();
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISHES.filter((d) => (vegOnly ? d.diet !== "nonveg" : true))
      .filter((d) => (category === "all" ? true : d.category === category))
      .filter((d) => (q ? `${d.name} ${d.note}`.toLowerCase().includes(q) : true));
  }, [query, vegOnly, category]);

  const plate = perPlate(event);
  const subtotal = plate * event.guests;
  const selected = event.menu.map((id) => DISH_BY_ID[id]).filter((d): d is Dish => Boolean(d));
  const toggle = (dishId: string) => dispatch({ type: "toggleDish", eventId: event.id, dishId });

  return (
    <div>
      <ViewHeader
        title="Menu builder"
        description="Compose a catering menu from the dish catalogue. Per-plate pricing and the catering subtotal update instantly — and flow straight into the quotation and the guest app."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card as="div" className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-line p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <label htmlFor={searchId} className="sr-only">
                  Search dishes
                </label>
                <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-subtle" />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 44 dishes — try “paneer” or “biryani”"
                  className="h-9 w-full rounded-lg border border-line bg-white pr-3 pl-8.5 text-[13px] text-ink placeholder:text-ink-subtle/80 hover:border-line-strong focus:border-electric focus:shadow-[0_0_0_3px_rgb(56_107_255/0.15)] focus-visible:outline-none"
                />
              </div>
              <div className="rounded-lg border border-line px-3 py-1.5 sm:w-auto">
                <Switch
                  checked={vegOnly}
                  onChange={setVegOnly}
                  label={
                    <span className="inline-flex items-center gap-1.5">
                      <Leaf aria-hidden className="size-3.5 text-[#138A4B]" /> Veg only
                    </span>
                  }
                />
              </div>
            </div>
            <Tabs
              label="Dish category"
              size="sm"
              value={category}
              onChange={setCategory}
              tabs={[{ id: "all" as const, label: "All" }, ...DISH_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]}
              className="self-start"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<SearchX className="size-4" />}
              title="No dishes found"
              body="Try another search or switch off the veg-only filter."
              action={
                <Btn
                  onClick={() => {
                    setQuery("");
                    setVegOnly(false);
                    setCategory("all");
                  }}
                >
                  Clear filters
                </Btn>
              }
            />
          ) : (
            <div className="divide-y divide-line">
              {DISH_CATEGORIES.map((cat) => {
                const dishes = filtered.filter((d) => d.category === cat.id);
                if (dishes.length === 0) return null;
                const count = dishes.filter((d) => event.menu.includes(d.id)).length;
                return (
                  <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="px-2 py-3 sm:px-3">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <h2 id={`cat-${cat.id}`} className="font-mono text-[10.5px] tracking-[0.14em] text-ink-subtle uppercase">
                        {cat.label}
                      </h2>
                      {count > 0 && <span className="text-[11.5px] text-electric-600">{count} in menu</span>}
                    </div>
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {dishes.map((d) => {
                        const inMenu = event.menu.includes(d.id);
                        return (
                          <li key={d.id}>
                            <div
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                                inMenu ? "bg-electric/[0.045] ring-1 ring-electric/20 ring-inset" : "hover:bg-mist",
                              )}
                            >
                              <DietMark diet={d.diet} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-medium text-ink">{d.name}</p>
                                <p className="truncate text-[11.5px] text-ink-subtle">{d.note}</p>
                              </div>
                              <span className="shrink-0 text-right text-[12.5px] font-medium text-ink-2 tabular-nums">
                                {formatINR(d.price)}
                                <span className="block text-[10.5px] font-normal text-ink-subtle">/ plate</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => toggle(d.id)}
                                aria-pressed={inMenu}
                                aria-label={inMenu ? `Remove ${d.name} from menu` : `Add ${d.name} to menu`}
                                className={cn(
                                  "inline-flex h-7 w-[74px] shrink-0 items-center justify-center gap-1 rounded-md text-[12px] font-medium transition-colors",
                                  inMenu
                                    ? "bg-electric-600 text-white hover:bg-danger"
                                    : "bg-white text-ink-2 ring-1 ring-line-strong ring-inset hover:bg-mist hover:text-ink",
                                )}
                              >
                                {inMenu ? (
                                  <>
                                    <Check aria-hidden className="size-3.5" /> Added
                                  </>
                                ) : (
                                  <>
                                    <Plus aria-hidden className="size-3.5" /> Add
                                  </>
                                )}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </Card>

        <aside aria-label="Current menu" id="menu-summary" className="min-w-0 lg:sticky lg:top-0 lg:self-start">
          <Card as="div" className="overflow-hidden">
            <div className="border-b border-line bg-gradient-to-b from-mist/80 to-white p-4">
              <EventPicker label="Menu for event" />
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-ink-muted">Guests</p>
                  <p className="text-[11px] text-ink-subtle">
                    {GUESTS_MIN}–{GUESTS_MAX.toLocaleString("en-IN")}
                  </p>
                </div>
                <Stepper
                  label="Guest count"
                  value={event.guests}
                  min={GUESTS_MIN}
                  max={GUESTS_MAX}
                  step={10}
                  onChange={(n) => dispatch({ type: "setGuests", eventId: event.id, guests: n })}
                />
              </div>
            </div>

            <div className="scrollbar-thin max-h-[42vh] overflow-y-auto px-4 py-3 lg:max-h-[calc(100dvh-26rem)]">
              {selected.length === 0 ? (
                <EmptyState
                  className="py-8"
                  icon={<UtensilsCrossed className="size-4" />}
                  title="No dishes yet"
                  body="Add dishes from the catalogue to start this menu."
                />
              ) : (
                DISH_CATEGORIES.map((cat) => {
                  const items = selected.filter((d) => d.category === cat.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat.id} className="mb-3 last:mb-0">
                      <p className="mb-1 text-[11.5px] font-medium text-ink-subtle">{cat.label}</p>
                      <ul>
                        <AnimatePresence initial={false}>
                          {items.map((d) => (
                            <motion.li
                              key={d.id}
                              layout={!reduce}
                              initial={reduce ? false : { opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="group flex items-center gap-2 py-1">
                                <DietMark diet={d.diet} />
                                <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-2">{d.name}</span>
                                <span className="text-[12px] text-ink-muted tabular-nums">{formatINR(d.price)}</span>
                                <IconBtn label={`Remove ${d.name}`} onClick={() => toggle(d.id)} className="size-6">
                                  <X aria-hidden className="size-3" />
                                </IconBtn>
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    </div>
                  );
                })
              )}
            </div>

            <dl className="space-y-1.5 border-t border-line px-4 py-3.5 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Dishes selected</dt>
                <dd className="font-medium text-ink tabular-nums">{selected.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Per plate</dt>
                <dd className="font-medium text-ink tabular-nums">{formatINR(plate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">× Guests</dt>
                <dd className="font-medium text-ink tabular-nums">{event.guests.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-dashed border-line pt-2.5">
                <dt className="font-medium text-ink">Catering subtotal</dt>
                <dd className="text-[18px] font-semibold tracking-[-0.02em] text-ink tabular-nums" aria-live="polite">
                  {formatINR(subtotal)}
                </dd>
              </div>
              <p className="text-[11px] text-ink-subtle">Before décor, add-ons, discount and tax.</p>
            </dl>
            <div className="flex gap-2 border-t border-line bg-mist/60 p-3">
              <Btn
                size="sm"
                variant="ghost"
                disabled={selected.length === 0}
                onClick={() => dispatch({ type: "clearMenu", eventId: event.id })}
              >
                <Trash2 aria-hidden className="size-3.5" /> Clear
              </Btn>
              <Btn size="sm" variant="primary" className="ml-auto" onClick={() => navigate("quotation")}>
                Build quotation <ArrowRight aria-hidden className="size-3.5" />
              </Btn>
            </div>
          </Card>
        </aside>
      </div>

      {/* Mobile sticky summary */}
      <div className="fixed inset-x-3 bottom-3 z-20 lg:hidden print:hidden">
        <a
          href="#menu-summary"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("menu-summary")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          }}
          className="on-dark flex items-center justify-between gap-3 rounded-xl bg-midnight/95 px-4 py-3 text-white shadow-[var(--shadow-float)] ring-1 ring-white/10 backdrop-blur"
        >
          <span className="min-w-0">
            <span className="block text-[11.5px] text-haze-muted">
              {selected.length} dishes · {formatINR(plate)}/plate
            </span>
            <span className="block text-[15px] font-semibold tabular-nums">{formatINR(subtotal)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-electric-300">
            Review menu <ArrowRight aria-hidden className="size-3.5" />
          </span>
        </a>
      </div>
    </div>
  );
}
