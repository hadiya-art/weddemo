"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CalendarX2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { DEMO_TODAY, EVENT_TYPE_META, EVENT_TYPES } from "@/lib/demo/catalog";
import { addDays, formatLongDate, formatMonthYear, formatTime, formatWeekday, isoMonth, monthGrid, monthOf } from "@/lib/demo/dates";
import type { DemoEvent } from "@/lib/demo/types";
import { useDemo } from "../store";
import { Btn, Card, EmptyState, IconBtn, StatusBadge, TypeTag, ViewHeader } from "../ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView() {
  const { data, openEvent, setEnquiryOpen } = useDemo();
  const [cursor, setCursor] = useState(() => monthOf(DEMO_TODAY));
  const [selected, setSelected] = useState(DEMO_TODAY);
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  const days = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor]);
  const monthKey = isoMonth(cursor.year, cursor.month);
  const byDate = useMemo(() => {
    const map = new Map<string, DemoEvent[]>();
    for (const e of [...data.events].sort((a, b) => a.startTime.localeCompare(b.startTime))) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [data.events]);
  const monthEvents = data.events
    .filter((e) => e.date.startsWith(monthKey))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${selected}"]`)?.focus();
  }, [selected, cursor]);

  const shiftMonth = (delta: number) => {
    const m = cursor.month + delta;
    const next = { year: cursor.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    setCursor(next);
    setSelected(`${isoMonth(next.year, next.month)}-01`);
  };

  const goToday = () => {
    setCursor(monthOf(DEMO_TODAY));
    setSelected(DEMO_TODAY);
  };

  const selectDay = (iso: string, focus = false) => {
    setSelected(iso);
    const m = monthOf(iso);
    if (m.year !== cursor.year || m.month !== cursor.month) setCursor(m);
    pendingFocus.current = focus;
  };

  const onDayKey = (e: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      selectDay(addDays(iso, map[e.key]), true);
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      shiftMonth(e.key === "PageUp" ? -1 : 1);
    }
  };

  const selectedEvents = byDate.get(selected) ?? [];

  return (
    <div>
      <ViewHeader
        title="Calendar"
        description="Every booking across the season, colour-coded by event type. Click any event to open its run-sheet."
        actions={
          <Btn variant="primary" onClick={() => setEnquiryOpen(true)}>
            <Plus aria-hidden className="size-3.5" /> New enquiry
          </Btn>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card as="div" className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1">
              <h2 className="mr-2 min-w-[150px] text-[16px] font-semibold tracking-[-0.015em] text-ink" aria-live="polite">
                {formatMonthYear(cursor.year, cursor.month)}
              </h2>
              <IconBtn label="Previous month" onClick={() => shiftMonth(-1)}>
                <ChevronLeft aria-hidden className="size-4" />
              </IconBtn>
              <IconBtn label="Next month" onClick={() => shiftMonth(1)}>
                <ChevronRight aria-hidden className="size-4" />
              </IconBtn>
              <Btn size="sm" onClick={goToday} className="ml-1">
                Today
              </Btn>
            </div>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Event type legend">
              {EVENT_TYPES.map((t) => (
                <li key={t}>
                  <TypeTag type={t} className="text-[11.5px]" />
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop month grid */}
          <div ref={gridRef} className="hidden md:block">
            <div className="grid grid-cols-7 border-b border-line bg-mist/60" aria-hidden>
              {WEEKDAYS.map((d) => (
                <div key={d} className="px-3 py-2 font-mono text-[10.5px] tracking-[0.12em] text-ink-subtle uppercase">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7" role="grid" aria-label={`${formatMonthYear(cursor.year, cursor.month)} events`}>
              {Array.from({ length: 6 }, (_, w) => (
                <div role="row" key={w} className="contents">
                  {days.slice(w * 7, w * 7 + 7).map((iso, i) => {
                    const inMonth = iso.startsWith(monthKey);
                    const isToday = iso === DEMO_TODAY;
                    const isSelected = iso === selected;
                    const events = byDate.get(iso) ?? [];
                    const shown = events.slice(0, 2);
                    const weekend = i >= 5;
                    return (
                      <div
                        role="gridcell"
                        key={iso}
                        aria-selected={isSelected}
                        className={cn(
                          "relative min-h-[118px] border-r border-b border-line p-1.5 transition-colors [&:nth-child(7)]:border-r-0",
                          !inMonth && "bg-mist/50",
                          weekend && inMonth && "bg-[#FBFCFE]",
                          isSelected && "bg-electric/[0.035] shadow-[inset_0_0_0_1.5px_rgb(56_107_255/0.45)]",
                        )}
                      >
                        <button
                          type="button"
                          data-day={iso}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => selectDay(iso)}
                          onKeyDown={(e) => onDayKey(e, iso)}
                          aria-label={`${formatLongDate(iso)}${events.length ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ", no events"}${isToday ? ", demo today" : ""}`}
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full text-[12px] font-medium tabular-nums transition-colors",
                            isToday
                              ? "bg-electric-600 text-white shadow-[0_2px_8px_-2px_rgb(47_94_240/0.6)]"
                              : inMonth
                                ? "text-ink-2 hover:bg-ink/[0.06]"
                                : "font-normal text-ink-subtle hover:bg-ink/[0.05]",
                          )}
                        >
                          {Number(iso.slice(8))}
                        </button>
                        <div className="mt-1 flex flex-col gap-1">
                          {shown.map((e) => (
                            <EventChip key={e.id} event={e} onOpen={() => openEvent(e.id)} />
                          ))}
                          {events.length > 2 && (
                            <button
                              type="button"
                              onClick={() => selectDay(iso)}
                              className="rounded px-1.5 text-left text-[11px] font-medium text-ink-muted hover:text-electric-600"
                            >
                              +{events.length - 2} more
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile agenda */}
          <div className="md:hidden">
            {monthEvents.length === 0 ? (
              <EmptyState icon={<CalendarX2 className="size-4" />} title="No events this month" body="Use the arrows to browse other months." />
            ) : (
              <ol className="divide-y divide-line">
                {groupByDate(monthEvents).map(([iso, events]) => (
                  <li key={iso} className="flex gap-3 px-4 py-3">
                    <div className={cn("w-11 shrink-0 pt-0.5 text-center", iso === DEMO_TODAY && "text-electric-600")}>
                      <p className="font-mono text-[10px] tracking-wider text-ink-subtle uppercase">{formatWeekday(iso).slice(0, 3)}</p>
                      <p className="text-[19px] leading-tight font-semibold tabular-nums">{Number(iso.slice(8))}</p>
                    </div>
                    <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
                      {events.map((e) => (
                        <li key={e.id}>
                          <button
                            type="button"
                            onClick={() => openEvent(e.id)}
                            className={cn(
                              "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                              EVENT_TYPE_META[e.type].chip,
                              e.status === "cancelled" && "bg-[#F1F3F7] text-ink-subtle",
                            )}
                          >
                            <span aria-hidden className={cn("mt-1 h-8 w-[3px] shrink-0 rounded-full", EVENT_TYPE_META[e.type].bar)} />
                            <span className="min-w-0 flex-1">
                              <span className={cn("block truncate text-[13px] font-semibold", e.status === "cancelled" && "line-through")}>{e.title}</span>
                              <span className="block truncate text-[12px]">
                                {formatTime(e.startTime)} · {e.venue}
                              </span>
                            </span>
                            <StatusBadge status={e.status} className="bg-white/70" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>

        <Card aria-labelledby="day-title" className="hidden self-start md:block">
          <div className="border-b border-line px-5 py-4">
            <p className="font-mono text-[10.5px] tracking-[0.14em] text-ink-subtle uppercase">
              {selected === DEMO_TODAY ? "Demo today" : formatWeekday(selected)}
            </p>
            <h2 id="day-title" className="mt-1 text-[15px] font-semibold text-ink">
              {formatLongDate(selected)}
            </h2>
          </div>
          {selectedEvents.length === 0 ? (
            <EmptyState
              icon={<CalendarX2 className="size-4" />}
              title="Nothing booked"
              body="A free date — perfect for a tasting or site visit."
              action={
                <Btn size="sm" variant="primary" onClick={() => setEnquiryOpen(true)}>
                  <Plus aria-hidden className="size-3.5" /> New enquiry
                </Btn>
              }
            />
          ) : (
            <ul className="flex flex-col gap-2 p-3">
              {selectedEvents.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => openEvent(e.id)}
                    className="w-full rounded-lg border border-line p-3 text-left transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[0_6px_18px_-12px_rgb(11_16_32/0.3)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <TypeTag type={e.type} className="text-[11.5px]" />
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-2 text-[13.5px] font-semibold text-ink">{e.title}</p>
                    <p className="mt-0.5 text-[12px] text-ink-subtle">
                      {formatTime(e.startTime)} – {formatTime(e.endTime)}
                    </p>
                    <p className="text-[12px] text-ink-subtle">
                      {e.venue}, {e.city} · {e.guests.toLocaleString("en-IN")} guests
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="border-t border-line px-5 py-3 text-[11.5px] text-ink-subtle">
            Tip: focus a date and use arrow keys to move between days, Page Up/Down for months.
          </p>
        </Card>
      </div>
    </div>
  );
}

function EventChip({ event, onOpen }: { event: DemoEvent; onOpen: () => void }) {
  const meta = EVENT_TYPE_META[event.type];
  const cancelled = event.status === "cancelled";
  return (
    <button
      type="button"
      onClick={onOpen}
      title={`${event.title} · ${formatTime(event.startTime)}`}
      className={cn(
        "group flex w-full min-w-0 items-stretch gap-1.5 rounded-md py-1 pr-1.5 pl-1 text-left text-[11.5px] leading-tight font-medium transition-colors",
        meta.chip,
        cancelled && "bg-[#F1F3F7] text-ink-subtle hover:bg-[#E9ECF2]",
      )}
    >
      <span aria-hidden className={cn("w-[3px] shrink-0 rounded-full", meta.bar)} />
      <span className="min-w-0 flex-1">
        <span className={cn("line-clamp-2 break-words", cancelled && "line-through")}>{event.title}</span>
        <span className="mt-0.5 block text-[10.5px] font-normal tabular-nums">{formatTime(event.startTime)}</span>
      </span>
      <span className="sr-only">
        , {meta.label}, {event.status}, {formatTime(event.startTime)}
      </span>
    </button>
  );
}

function groupByDate(events: DemoEvent[]): [string, DemoEvent[]][] {
  const map = new Map<string, DemoEvent[]>();
  for (const e of events) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return [...map.entries()];
}
