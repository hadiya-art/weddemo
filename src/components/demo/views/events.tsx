"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDownUp, Plus, Search, SearchX } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { EVENT_STATUSES, EVENT_TYPE_META, EVENT_TYPES, STATUS_META } from "@/lib/demo/catalog";
import { formatMediumDate, formatTime, formatWeekday, toUTC } from "@/lib/demo/dates";
import { eventValue } from "@/lib/demo/derive";
import type { EventStatus, EventType, StaffMember } from "@/lib/demo/types";
import { useDemo } from "../store";
import { AvatarStack, Btn, Card, EmptyState, Select, StatusBadge, Tabs, TypeTag, ViewHeader } from "../ui";

type SortKey = "date-asc" | "date-desc" | "value-desc" | "value-asc";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "date-asc", label: "Date — soonest first" },
  { id: "date-desc", label: "Date — latest first" },
  { id: "value-desc", label: "Value — highest first" },
  { id: "value-asc", label: "Value — lowest first" },
];

export function EventsView() {
  const { data, openEvent, setEnquiryOpen } = useDemo();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EventStatus | "all">("all");
  const [type, setType] = useState<EventType | "all">("all");
  const [sort, setSort] = useState<SortKey>("date-asc");
  const searchId = useId();
  const typeId = useId();
  const sortId = useId();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withValue = data.events.map((e) => ({ event: e, value: eventValue(e) }));
    return withValue
      .filter(({ event: e }) => (status === "all" ? true : e.status === status))
      .filter(({ event: e }) => (type === "all" ? true : e.type === type))
      .filter(({ event: e }) =>
        q ? [e.title, e.client.name, e.venue, e.city, e.id].some((f) => f.toLowerCase().includes(q)) : true,
      )
      .sort((a, b) => {
        switch (sort) {
          case "date-asc":
            return toUTC(a.event.date) - toUTC(b.event.date) || a.event.startTime.localeCompare(b.event.startTime);
          case "date-desc":
            return toUTC(b.event.date) - toUTC(a.event.date) || b.event.startTime.localeCompare(a.event.startTime);
          case "value-desc":
            return b.value - a.value;
          case "value-asc":
            return a.value - b.value;
        }
      });
  }, [data.events, query, status, type, sort]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.events.length };
    for (const s of EVENT_STATUSES) counts[s] = data.events.filter((e) => e.status === s).length;
    return counts;
  }, [data.events]);

  const filtersActive = query.trim() !== "" || status !== "all" || type !== "all";
  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setType("all");
  };
  const staffFor = (ids: string[]) => ids.map((id) => data.staff.find((s) => s.id === id)).filter((s): s is StaffMember => Boolean(s));
  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  return (
    <div>
      <ViewHeader
        title="Events & bookings"
        description="Every enquiry, tentative hold and confirmed booking in one list. Values include the illustrative tax rate."
        actions={
          <Btn variant="primary" onClick={() => setEnquiryOpen(true)}>
            <Plus aria-hidden className="size-3.5" /> New enquiry
          </Btn>
        }
      />

      <Card as="div">
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:p-4">
          <Tabs
            label="Filter by status"
            value={status}
            onChange={setStatus}
            tabs={[
              { id: "all" as const, label: "All", count: statusCounts.all },
              ...EVENT_STATUSES.map((s) => ({ id: s, label: STATUS_META[s].label, count: statusCounts[s] })),
            ]}
            className="self-start"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor={searchId} className="sr-only">
                Search events
              </label>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-subtle" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search client, event or venue…"
                className="h-9 w-full rounded-lg border border-line bg-white pr-3 pl-8.5 text-[13px] text-ink placeholder:text-ink-subtle/80 hover:border-line-strong focus:border-electric focus:shadow-[0_0_0_3px_rgb(56_107_255/0.15)] focus-visible:outline-none sm:max-w-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <label htmlFor={typeId} className="sr-only">
                Event type
              </label>
              <Select id={typeId} value={type} onChange={(e) => setType(e.target.value as EventType | "all")} className="sm:w-44">
                <option value="all">All event types</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {EVENT_TYPE_META[t].label}
                  </option>
                ))}
              </Select>
              <label htmlFor={sortId} className="sr-only">
                Sort events
              </label>
              <Select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="sm:w-52">
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {rows.length} event{rows.length === 1 ? "" : "s"} shown
        </p>

        {rows.length === 0 ? (
          <EmptyState
            icon={<SearchX className="size-4" />}
            title="No events match these filters"
            body="Try a different search term, or clear the filters to see every booking."
            action={
              <Btn variant="secondary" onClick={clearFilters}>
                Clear filters
              </Btn>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="scrollbar-thin hidden overflow-x-auto md:block">
              <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
                <caption className="sr-only">Events and bookings. Activate an event name to open its details.</caption>
                <thead>
                  <tr className="border-b border-line bg-mist/60 text-[11px] tracking-[0.06em] text-ink-subtle uppercase">
                    <th scope="col" className="py-2.5 pr-3 pl-5 font-medium">Event</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      <button
                        type="button"
                        onClick={() => setSort(sort === "date-asc" ? "date-desc" : "date-asc")}
                        className="inline-flex items-center gap-1 uppercase hover:text-ink"
                        aria-label={`Sort by date ${sort === "date-asc" ? "latest first" : "soonest first"}`}
                      >
                        Date <ArrowDownUp aria-hidden className={cn("size-3", sort.startsWith("date") && "text-electric-600")} />
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Type</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Venue</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Guests</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      <button
                        type="button"
                        onClick={() => setSort(sort === "value-desc" ? "value-asc" : "value-desc")}
                        className="inline-flex items-center gap-1 uppercase hover:text-ink"
                        aria-label={`Sort by value ${sort === "value-desc" ? "lowest first" : "highest first"}`}
                      >
                        Value <ArrowDownUp aria-hidden className={cn("size-3", sort.startsWith("value") && "text-electric-600")} />
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
                    <th scope="col" className="py-2.5 pr-5 pl-3 font-medium">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ event: e, value }) => (
                    <tr
                      key={e.id}
                      onClick={() => openEvent(e.id)}
                      className={cn(
                        "group cursor-pointer border-b border-line/80 transition-colors last:border-b-0 hover:bg-mist/70",
                        e.status === "cancelled" && "text-ink-subtle",
                      )}
                    >
                      <td className="py-3 pr-3 pl-5">
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            openEvent(e.id);
                          }}
                          className="block max-w-[260px] text-left"
                        >
                          <span className="block truncate font-medium text-ink group-hover:text-electric-600">{e.title}</span>
                          <span className="block truncate text-[12px] text-ink-subtle">
                            {e.client.name} · <span className="font-mono text-[11px]">{e.id}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="block text-ink-2 tabular-nums">{formatMediumDate(e.date)}</span>
                        <span className="block text-[12px] text-ink-subtle">
                          {formatWeekday(e.date).slice(0, 3)} · {formatTime(e.startTime)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <TypeTag type={e.type} />
                      </td>
                      <td className="max-w-[200px] px-3 py-3">
                        <span className="block truncate text-ink-2">{e.venue}</span>
                        <span className="block text-[12px] text-ink-subtle">{e.city}</span>
                      </td>
                      <td className="px-3 py-3 text-right text-ink-2 tabular-nums">{e.guests.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-3 text-right font-medium text-ink tabular-nums">{formatINR(value)}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="py-3 pr-5 pl-3">
                        <AvatarStack people={staffFor(e.staffIds)} max={3} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="flex flex-col gap-2 p-3 md:hidden">
              {rows.map(({ event: e, value }) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => openEvent(e.id)}
                    className="w-full rounded-xl border border-line bg-white p-3.5 text-left transition-colors active:bg-mist"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-ink">{e.title}</span>
                        <span className="block truncate text-[12px] text-ink-subtle">{e.client.name}</span>
                      </span>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-muted">
                      <TypeTag type={e.type} className="text-[12px]" />
                      <span className="tabular-nums">{formatMediumDate(e.date)}</span>
                      <span className="tabular-nums">{e.guests.toLocaleString("en-IN")} guests</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                      <span className="truncate text-[12px] text-ink-subtle">
                        {e.venue}, {e.city}
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold text-ink tabular-nums">{formatINR(value)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3 text-[12px] text-ink-subtle">
              <span>
                Showing <span className="font-medium text-ink-2 tabular-nums">{rows.length}</span> of {data.events.length} events
                {filtersActive && (
                  <>
                    {" · "}
                    <button type="button" onClick={clearFilters} className="font-medium text-electric-600 hover:underline">
                      Clear filters
                    </button>
                  </>
                )}
              </span>
              <span>
                Total shown <span className="font-semibold text-ink tabular-nums">{formatINR(totalValue)}</span>
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
