"use client";

import { useId, useState, type ComponentType } from "react";
import {
  ArrowRight,
  CalendarHeart,
  Clock,
  ListOrdered,
  MapPin,
  MessageSquareHeart,
  RefreshCw,
  Smartphone,
  Star,
  UtensilsCrossed,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DISH_CATEGORIES, EVENT_TYPE_META } from "@/lib/demo/catalog";
import { addMinutesToTime, formatLongDate, formatShortDate, formatTime, formatWeekday } from "@/lib/demo/dates";
import { menuDishes } from "@/lib/demo/derive";
import type { DemoEvent, EventType, RsvpResponse } from "@/lib/demo/types";
import { useDemo } from "../store";
import { Btn, Card, DietMark, Stars, StarInput, ViewHeader } from "../ui";
import { EventPicker, useFocusEvent } from "./menu";

type PhoneTab = "invite" | "schedule" | "menu" | "rsvp" | "feedback";

const PHONE_TABS: { id: PhoneTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "invite", label: "Invite", icon: CalendarHeart },
  { id: "schedule", label: "Schedule", icon: ListOrdered },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "rsvp", label: "RSVP", icon: UsersRound },
  { id: "feedback", label: "Feedback", icon: MessageSquareHeart },
];

const SCHEDULES: Record<EventType, { label: string; offset: number; note: string }[]> = {
  wedding: [
    { label: "Baraat arrives", offset: 0, note: "North gate · dhol & dance" },
    { label: "Varmala", offset: 75, note: "Main stage" },
    { label: "Dinner opens", offset: 105, note: "Garden buffet & live counters" },
    { label: "Pheras", offset: 240, note: "Mandap by the lawns" },
  ],
  sangeet: [
    { label: "Welcome drinks", offset: 0, note: "Courtyard" },
    { label: "Family performances", offset: 60, note: "Main stage" },
    { label: "Dinner", offset: 150, note: "Live counters open" },
    { label: "DJ & dance floor", offset: 180, note: "Till late" },
  ],
  reception: [
    { label: "Guests arrive", offset: 0, note: "Welcome mocktails" },
    { label: "Couple's entry", offset: 45, note: "Grand staircase" },
    { label: "Dinner served", offset: 75, note: "Ballroom & terrace" },
    { label: "Farewell", offset: 210, note: "Return favours at exit" },
  ],
  corporate: [
    { label: "Registration", offset: 0, note: "Lobby desk" },
    { label: "Welcome address", offset: 30, note: "Main hall" },
    { label: "Networking & dinner", offset: 90, note: "Terrace" },
    { label: "Close", offset: 195, note: "Shuttles at the porch" },
  ],
  birthday: [
    { label: "Welcome", offset: 0, note: "Games corner opens" },
    { label: "Cake cutting", offset: 60, note: "Centre stage" },
    { label: "Food is served", offset: 75, note: "Buffet & live counter" },
    { label: "Goodbyes & favours", offset: 180, note: "Exit lobby" },
  ],
};

function inviteLine(type: EventType): string {
  switch (type) {
    case "wedding":
      return "request the pleasure of your company as they begin forever";
    case "reception":
      return "invite you to an evening of celebration";
    case "sangeet":
      return "invite you to an evening of music, colour and dance";
    case "corporate":
      return "cordially invites you to";
    case "birthday":
      return "would love for you to join the celebrations";
  }
}

export function CustomerView() {
  const { data, navigate } = useDemo();
  const event = useFocusEvent();
  const dishes = menuDishes(event);
  const rsvp = data.rsvps[event.id];
  const eventFeedback = data.feedback.filter((f) => f.eventId === event.id);
  const avg = eventFeedback.length ? eventFeedback.reduce((s, f) => s + f.rating, 0) / eventFeedback.length : 0;

  return (
    <div>
      <ViewHeader
        title="Customer app"
        description="The host & guest experience, generated from your workspace. Change the menu or event details and the app updates — no re-designing invitations."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px_minmax(0,0.8fr)]">
        <div className="flex flex-col gap-4">
          <Card as="div" className="p-4">
            <EventPicker label="Preview the app for" />
            <p className="mt-3 text-[12px] leading-relaxed text-ink-subtle">
              Guests open a private link — no download needed. Everything inside the phone is interactive.
            </p>
          </Card>
          <Card aria-labelledby="sync-title">
            <h2 id="sync-title" className="px-5 pt-4 pb-1 text-[14px] font-semibold text-ink">
              Live from your workspace
            </h2>
            <p className="px-5 text-[12px] text-ink-subtle">These panels read the same data as the guest app.</p>
            <ul className="mt-2 divide-y divide-line">
              <SyncRow
                icon={UtensilsCrossed}
                title={`${dishes.length} dishes on the digital menu`}
                body="Mirrors the menu builder for this event."
                action={
                  <Btn size="xs" variant="ghost" onClick={() => navigate("menu")}>
                    Edit menu <ArrowRight aria-hidden className="size-3" />
                  </Btn>
                }
              />
              <SyncRow
                icon={UsersRound}
                title={rsvp ? `Your test RSVP: ${rsvpWord(rsvp.response)} · party of ${rsvp.party}` : "No RSVP from this device yet"}
                body={`${event.guests.toLocaleString("en-IN")} invited guests on the list.`}
              />
              <SyncRow
                icon={MessageSquareHeart}
                title={eventFeedback.length ? `${eventFeedback.length} feedback entries` : "No feedback yet for this event"}
                body={eventFeedback.length ? <Stars value={avg} size="xs" /> : "Submit a review from the phone's Feedback tab."}
                action={
                  <Btn size="xs" variant="ghost" onClick={() => navigate("feedback")}>
                    Review <ArrowRight aria-hidden className="size-3" />
                  </Btn>
                }
              />
            </ul>
          </Card>
        </div>

        <div className="flex justify-center lg:row-span-2 xl:row-span-1">
          <Phone key={event.id} event={event} />
        </div>

        <Card as="div" className="hidden self-start p-5 xl:block">
          <p className="font-mono text-[10.5px] tracking-[0.14em] text-ink-subtle uppercase">Why it matters</p>
          <ul className="mt-3 space-y-3 text-[12.5px] leading-relaxed text-ink-muted">
            <li className="flex gap-2.5">
              <Smartphone aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-600" />
              Hosts get a polished, on-brand invitation without a designer.
            </li>
            <li className="flex gap-2.5">
              <RefreshCw aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-600" />
              Menu, timings and venue stay in sync with operations.
            </li>
            <li className="flex gap-2.5">
              <Star aria-hidden className="mt-0.5 size-4 shrink-0 text-electric-600" />
              Feedback lands in the manager view the moment it&apos;s sent.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function rsvpWord(r: RsvpResponse) {
  return r === "yes" ? "attending" : r === "maybe" ? "maybe" : "declined";
}

function SyncRow({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 px-5 py-3">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-electric/[0.07] text-electric-600">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-ink">{title}</p>
        <div className="mt-0.5 text-[12px] text-ink-subtle">{body}</div>
      </div>
      {action}
    </li>
  );
}

/* ───────────────────────────── Phone ───────────────────────────── */

function Phone({ event }: { event: DemoEvent }) {
  const [tab, setTab] = useState<PhoneTab>("invite");
  const tabsId = useId();

  return (
    <div className="relative w-full max-w-[360px]">
      {/* Side buttons */}
      <span aria-hidden className="absolute top-28 -left-[3px] h-8 w-[3px] rounded-l bg-[#1c2236]" />
      <span aria-hidden className="absolute top-40 -left-[3px] h-14 w-[3px] rounded-l bg-[#1c2236]" />
      <span aria-hidden className="absolute top-36 -right-[3px] h-20 w-[3px] rounded-r bg-[#1c2236]" />
      <div className="rounded-[52px] bg-gradient-to-b from-[#20263a] to-[#0b0f1c] p-[11px] shadow-[0_0_0_1px_rgb(255_255_255/0.06)_inset,0_40px_80px_-30px_rgb(11_16_32/0.55),0_12px_30px_-12px_rgb(11_16_32/0.35)]">
        <div
          className="relative flex h-[min(720px,78dvh)] min-h-[600px] flex-col overflow-hidden rounded-[42px] bg-[#FBF8F3] text-[#2A2118]"
          role="region"
          aria-label={`Guest app preview for ${event.title}`}
        >
          {/* Status bar */}
          <div aria-hidden className="relative z-10 flex h-11 shrink-0 items-center justify-between px-7 pt-1 text-[12px] font-semibold">
            <span className="tabular-nums">9:41</span>
            <span className="absolute top-2.5 left-1/2 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1.5">
              <span className="flex items-end gap-[2px]">
                {[4, 6, 8, 10].map((h) => (
                  <span key={h} className="w-[3px] rounded-sm bg-current" style={{ height: h }} />
                ))}
              </span>
              <span className="relative h-[11px] w-[22px] rounded-[3px] border border-current/60 p-[1px]">
                <span className="block h-full w-[75%] rounded-[1.5px] bg-current" />
              </span>
            </span>
          </div>

          <div
            id={`${tabsId}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-${tab}`}
            className="scrollbar-thin relative min-h-0 flex-1 overflow-y-auto"
          >
            {tab === "invite" && <InviteScreen event={event} onRsvp={() => setTab("rsvp")} onSchedule={() => setTab("schedule")} />}
            {tab === "schedule" && <ScheduleScreen event={event} />}
            {tab === "menu" && <MenuScreen event={event} />}
            {tab === "rsvp" && <RsvpScreen event={event} />}
            {tab === "feedback" && <FeedbackScreen event={event} />}
          </div>

          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Guest app sections"
            className="flex shrink-0 items-stretch justify-around border-t border-[#2A2118]/10 bg-[#FBF8F3]/95 px-2 pt-1.5 pb-5 backdrop-blur"
            onKeyDown={(e) => {
              const idx = PHONE_TABS.findIndex((t) => t.id === tab);
              let next = idx;
              if (e.key === "ArrowRight") next = (idx + 1) % PHONE_TABS.length;
              else if (e.key === "ArrowLeft") next = (idx - 1 + PHONE_TABS.length) % PHONE_TABS.length;
              else return;
              e.preventDefault();
              setTab(PHONE_TABS[next].id);
              (e.currentTarget.querySelectorAll('[role="tab"]')[next] as HTMLElement | undefined)?.focus();
            }}
          >
            {PHONE_TABS.map((t) => {
              const active = t.id === tab;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  id={`${tabsId}-${t.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${tabsId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 text-[10px] font-medium transition-colors",
                    active ? "text-[#7A2E3A]" : "text-[#6B5E50] hover:text-[#2A2118]",
                  )}
                >
                  <Icon className={cn("size-[18px]", active && "stroke-[2.2]")} />
                  {t.label}
                </button>
              );
            })}
          </div>
          <span aria-hidden className="absolute bottom-1.5 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-[#2A2118]/80" />
        </div>
      </div>
    </div>
  );
}

function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={cn("h-5 w-28", className)} aria-hidden fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 12h44M76 12h44" strokeLinecap="round" />
      <path d="M60 3c3 4 3 14 0 18-3-4-3-14 0-18Z" />
      <path d="M60 12c4-4 9-5 12-4-2 3-7 5-12 4ZM60 12c-4-4-9-5-12-4 2 3 7 5 12 4Z" />
      <circle cx="49" cy="12" r="1.2" fill="currentColor" />
      <circle cx="71" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function InviteScreen({ event, onRsvp, onSchedule }: { event: DemoEvent; onRsvp: () => void; onSchedule: () => void }) {
  const corporate = event.type === "corporate";
  return (
    <div className="relative px-6 pt-4 pb-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,rgb(224_138_30/0.18),transparent_70%)]"
      />
      <div className="relative rounded-[28px] border border-[#B98B3E]/35 px-5 pt-8 pb-7">
        <span aria-hidden className="absolute inset-1.5 rounded-[23px] border border-[#B98B3E]/20" />
        <Ornament className="mx-auto text-[#8A6420]" />
        <p className="mt-4 font-mono text-[9.5px] tracking-[0.28em] text-[#6B5E50] uppercase">
          {corporate ? "You are invited" : "Together with their families"}
        </p>
        <h2 className="mt-4 font-serif text-[40px] leading-[1.02] text-[#7A2E3A]">
          {event.hosts.split(" & ").map((part, i, arr) => (
            <span key={part} className="block">
              {part}
              {i < arr.length - 1 && <span className="block font-serif text-[24px] text-[#8A6420] italic">&amp;</span>}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-4 max-w-[220px] text-[12.5px] leading-relaxed text-[#5A4D40]">{inviteLine(event.type)}</p>
        <p className="mt-1 font-serif text-[20px] text-[#2A2118] italic">
          {corporate ? event.title.replace(event.hosts, "").trim() || EVENT_TYPE_META[event.type].label : `the ${EVENT_TYPE_META[event.type].short}`}
        </p>
        <div className="mx-auto mt-6 flex max-w-[240px] items-center justify-center gap-4 border-y border-[#B98B3E]/30 py-3">
          <span className="text-[11px] tracking-[0.2em] text-[#6B5E50] uppercase">{formatWeekday(event.date).slice(0, 3)}</span>
          <span className="font-serif text-[34px] leading-none text-[#2A2118]">{Number(event.date.slice(8))}</span>
          <span className="text-left text-[11px] leading-tight tracking-[0.12em] text-[#6B5E50] uppercase">
            {formatShortDate(event.date).split(" ")[1]}
            <br />
            {event.date.slice(0, 4)}
          </span>
        </div>
        <p className="mt-3 text-[12.5px] text-[#5A4D40]">from {formatTime(event.startTime)}</p>
        <p className="mt-1 text-[13px] font-semibold text-[#2A2118]">{event.venue}</p>
        <p className="text-[12px] text-[#6B5E50]">{event.city}</p>
      </div>
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onRsvp} className="h-11 flex-1 rounded-full bg-[#7A2E3A] text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgb(122_46_58/0.7)] transition-colors hover:bg-[#6A2532]">
          RSVP
        </button>
        <button type="button" onClick={onSchedule} className="h-11 flex-1 rounded-full border border-[#2A2118]/20 text-[13px] font-semibold text-[#2A2118] transition-colors hover:bg-[#2A2118]/[0.04]">
          View schedule
        </button>
      </div>
    </div>
  );
}

function ScreenTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="px-6 pt-3 pb-4">
      <p className="font-mono text-[9.5px] tracking-[0.24em] text-[#6B5E50] uppercase">{kicker}</p>
      <h2 className="mt-1 font-serif text-[28px] leading-tight text-[#2A2118]">{title}</h2>
    </div>
  );
}

function ScheduleScreen({ event }: { event: DemoEvent }) {
  const items = SCHEDULES[event.type];
  return (
    <div className="pb-8">
      <ScreenTitle kicker={formatLongDate(event.date)} title="The day's flow" />
      <ol className="relative mx-6 border-l border-dashed border-[#B98B3E]/50 pl-5">
        {items.map((it) => (
          <li key={it.label} className="relative pb-5 last:pb-0">
            <span aria-hidden className="absolute top-1 -left-[25px] size-2.5 rounded-full border-2 border-[#FBF8F3] bg-[#7A2E3A] ring-1 ring-[#7A2E3A]/30" />
            <p className="font-mono text-[11px] text-[#7A2E3A] tabular-nums">{formatTime(addMinutesToTime(event.startTime, it.offset))}</p>
            <p className="text-[14px] font-semibold text-[#2A2118]">{it.label}</p>
            <p className="text-[12px] text-[#6B5E50]">{it.note}</p>
          </li>
        ))}
      </ol>
      <div className="mx-6 mt-6 overflow-hidden rounded-2xl border border-[#2A2118]/10 bg-white">
        <MapPlaceholder />
        <div className="flex items-start gap-2.5 p-3.5">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-[#7A2E3A]" />
          <div>
            <p className="text-[13px] font-semibold text-[#2A2118]">{event.venue}</p>
            <p className="text-[12px] text-[#6B5E50]">{event.city} · Valet at main gate</p>
            <p className="mt-1 flex items-center gap-1 text-[11.5px] text-[#6B5E50]">
              <Clock aria-hidden className="size-3" /> Gates open {formatTime(addMinutesToTime(event.startTime, -30))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Stylised map drawn with CSS only — no external map service. */
function MapPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Illustrative map of the venue surroundings"
      className="relative h-32 overflow-hidden bg-[#EFEAE0]"
      style={{
        backgroundImage:
          "linear-gradient(rgb(42 33 24 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(42 33 24 / 0.05) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <span aria-hidden className="absolute -top-10 -left-6 h-28 w-40 rounded-full bg-[#CFE3D0]" />
      <span aria-hidden className="absolute -right-10 bottom-[-30px] h-24 w-48 rotate-[-12deg] rounded-[50%] bg-[#C9DDF0]" />
      <span aria-hidden className="absolute top-[58%] -left-4 h-2.5 w-[120%] -rotate-6 bg-white shadow-[0_0_0_1px_rgb(42_33_24/0.06)]" />
      <span aria-hidden className="absolute top-0 left-[38%] h-full w-2 rotate-[14deg] bg-white shadow-[0_0_0_1px_rgb(42_33_24/0.06)]" />
      <span aria-hidden className="absolute top-[20%] left-[64%] h-2 w-24 rotate-[32deg] bg-white/90" />
      <span aria-hidden className="absolute top-[30%] left-[44%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="flex size-8 items-center justify-center rounded-full bg-[#7A2E3A] shadow-[0_6px_14px_-4px_rgb(122_46_58/0.7)] ring-4 ring-white">
          <MapPin className="size-4 text-white" />
        </span>
      </span>
    </div>
  );
}

function MenuScreen({ event }: { event: DemoEvent }) {
  const dishes = menuDishes(event);
  return (
    <div className="pb-8">
      <ScreenTitle kicker={`${dishes.length} dishes · curated by the caterer`} title="Tonight's menu" />
      {dishes.length === 0 ? (
        <div className="mx-6 rounded-2xl border border-dashed border-[#B98B3E]/50 px-5 py-10 text-center">
          <UtensilsCrossed aria-hidden className="mx-auto size-6 text-[#8A6420]" />
          <p className="mt-3 font-serif text-[20px] text-[#2A2118]">Being finalised</p>
          <p className="mt-1 text-[12px] text-[#6B5E50]">The menu will appear here as soon as the caterer adds dishes.</p>
        </div>
      ) : (
        <div className="space-y-5 px-6">
          {DISH_CATEGORIES.map((cat) => {
            const items = dishes.filter((d) => d.category === cat.id);
            if (items.length === 0) return null;
            return (
              <section key={cat.id}>
                <h3 className="flex items-center gap-3 font-mono text-[9.5px] tracking-[0.24em] text-[#7A2E3A] uppercase">
                  {cat.label}
                  <span aria-hidden className="h-px flex-1 bg-[#B98B3E]/35" />
                </h3>
                <ul className="mt-2 space-y-2">
                  {items.map((d) => (
                    <li key={d.id} className="flex items-start gap-2.5">
                      <DietMark diet={d.diet} className="mt-[3px]" />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#2A2118]">{d.name}</p>
                        <p className="text-[11.5px] text-[#6B5E50]">{d.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <p className="pt-2 text-center text-[11px] text-[#6B5E50]">Please inform the host of any allergies.</p>
        </div>
      )}
    </div>
  );
}

function RsvpScreen({ event }: { event: DemoEvent }) {
  const { data, dispatch, toast } = useDemo();
  const saved = data.rsvps[event.id];
  const [response, setResponse] = useState<RsvpResponse | null>(saved?.response ?? null);
  const [party, setParty] = useState(saved?.party ?? 2);
  const options: { id: RsvpResponse; label: string }[] = [
    { id: "yes", label: "Joyfully accept" },
    { id: "maybe", label: "Maybe" },
    { id: "no", label: "Regretfully decline" },
  ];
  return (
    <div className="px-6 pb-8">
      <ScreenTitle kicker={`Kindly reply by ${formatLongDate(event.date).replace(/^\w+, /, "")}`} title="Will you join us?" />
      <div className="-mt-1 flex flex-col gap-2" role="radiogroup" aria-label="Your response">
        {options.map((o) => {
          const active = response === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setResponse(o.id)}
              className={cn(
                "flex h-12 items-center justify-between rounded-2xl border px-4 text-left text-[14px] font-semibold transition-colors",
                active ? "border-[#7A2E3A] bg-[#7A2E3A] text-white" : "border-[#2A2118]/15 bg-white text-[#2A2118] hover:border-[#2A2118]/30",
              )}
            >
              {o.label}
              <span
                aria-hidden
                className={cn("size-4 rounded-full border-2", active ? "border-white bg-white shadow-[inset_0_0_0_3px_#7A2E3A]" : "border-[#2A2118]/25")}
              />
            </button>
          );
        })}
      </div>
      {response && response !== "no" && (
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-[#2A2118]/10">
          <span className="text-[13px] font-medium text-[#2A2118]">Guests in your party</span>
          <span className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Fewer guests"
              disabled={party <= 1}
              onClick={() => setParty((p) => Math.max(1, p - 1))}
              className="flex size-8 items-center justify-center rounded-full border border-[#2A2118]/15 text-[16px] text-[#2A2118] disabled:opacity-40"
            >
              −
            </button>
            <span className="w-5 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">
              {party}
            </span>
            <button
              type="button"
              aria-label="More guests"
              disabled={party >= 8}
              onClick={() => setParty((p) => Math.min(8, p + 1))}
              className="flex size-8 items-center justify-center rounded-full border border-[#2A2118]/15 text-[16px] text-[#2A2118] disabled:opacity-40"
            >
              +
            </button>
          </span>
        </div>
      )}
      <button
        type="button"
        disabled={!response}
        onClick={() => {
          if (!response) return;
          const finalParty = response === "no" ? 1 : party;
          dispatch({ type: "setRsvp", eventId: event.id, rsvp: { response, party: finalParty } });
          toast("RSVP saved in this demo browser — the host was not actually notified.");
        }}
        className="mt-5 h-12 w-full rounded-full bg-[#2A2118] text-[14px] font-semibold text-white transition-colors hover:bg-black disabled:opacity-40"
      >
        {saved ? "Update RSVP" : "Send RSVP"}
      </button>
      {saved && (
        <p className="mt-3 text-center text-[12px] text-[#5A4D40]" role="status">
          Saved: {rsvpWord(saved.response)}
          {saved.response !== "no" ? ` · party of ${saved.party}` : ""}
        </p>
      )}
    </div>
  );
}

function FeedbackScreen({ event }: { event: DemoEvent }) {
  const { dispatch, toast } = useDemo();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const uid = useId();

  if (done) {
    return (
      <div className="flex flex-col items-center px-8 pt-16 pb-8 text-center">
        <Ornament className="text-[#8A6420]" />
        <p className="mt-4 font-serif text-[30px] leading-tight text-[#7A2E3A]">Thank you</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#5A4D40]">
          Your note has been shared with the {event.type === "corporate" ? "organisers" : "hosts"} and the catering team.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setRating(0);
            setName("");
            setComment("");
          }}
          className="mt-6 h-11 rounded-full border border-[#2A2118]/20 px-6 text-[13px] font-semibold text-[#2A2118] hover:bg-[#2A2118]/[0.04]"
        >
          Leave another
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="px-6 pb-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (rating === 0) return setError("Please choose a star rating.");
        if (name.trim().length < 2) return setError("Please add your name.");
        setError(null);
        dispatch({
          type: "addFeedback",
          eventId: event.id,
          guest: name.trim(),
          rating,
          comment: comment.trim() || "No comment left.",
        });
        toast("Feedback added to Guest feedback — stored in this browser only.");
        setDone(true);
      }}
    >
      <ScreenTitle kicker={event.title} title="How was it?" />
      <div className="-mt-1 rounded-2xl bg-white p-4 ring-1 ring-[#2A2118]/10">
        <StarInput value={rating} onChange={setRating} name={`${uid}-rating`} label="Your rating" />
        <div className="mt-4">
          <label htmlFor={`${uid}-name`} className="text-[12px] font-medium text-[#5A4D40]">
            Your name
          </label>
          <input
            id={`${uid}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ritu S."
            className="mt-1 h-10 w-full rounded-xl border border-[#2A2118]/15 bg-[#FBF8F3] px-3 text-[13px] text-[#2A2118] placeholder:text-[#6B5E50]/70 focus:border-[#7A2E3A] focus:shadow-[0_0_0_3px_rgb(122_46_58/0.15)] focus-visible:outline-none"
          />
        </div>
        <div className="mt-3">
          <label htmlFor={`${uid}-comment`} className="text-[12px] font-medium text-[#5A4D40]">
            Anything you&apos;d like to share?
          </label>
          <textarea
            id={`${uid}-comment`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="The food, the décor, the service…"
            className="mt-1 w-full resize-none rounded-xl border border-[#2A2118]/15 bg-[#FBF8F3] px-3 py-2 text-[13px] text-[#2A2118] placeholder:text-[#6B5E50]/70 focus:border-[#7A2E3A] focus:shadow-[0_0_0_3px_rgb(122_46_58/0.15)] focus-visible:outline-none"
          />
        </div>
        {error && (
          <p className="mt-2 text-[12px] font-medium text-[#A4372B]" role="alert">
            {error}
          </p>
        )}
      </div>
      <button type="submit" className="mt-4 h-12 w-full rounded-full bg-[#7A2E3A] text-[14px] font-semibold text-white transition-colors hover:bg-[#6A2532]">
        Send feedback
      </button>
    </form>
  );
}
