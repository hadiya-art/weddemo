"use client";

import { useState, type ComponentType } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  CalendarPlus,
  IndianRupee,
  ListChecks,
  MessageSquareHeart,
  Plus,
  ReceiptText,
  Sparkles,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINRCompact } from "@/lib/format";
import { BOOKING_HISTORY, BUSINESS, CURRENT_USER, DEMO_TODAY } from "@/lib/demo/catalog";
import { daysFromToday, formatLongDate, formatShortDate, formatTime, relativeTime, toUTC } from "@/lib/demo/dates";
import { computeKpis, isUpcoming, taskProgress } from "@/lib/demo/derive";
import type { ActivityItem } from "@/lib/demo/types";
import { useDemo } from "../store";
import { Avatar, Btn, Card, CardHeader, Progress, SampleTag, Stars, StatusBadge, TypeTag, ViewHeader } from "../ui";

const ACTIVITY_ICON: Record<ActivityItem["kind"], ComponentType<{ className?: string }>> = {
  status: CalendarCheck2,
  task: ListChecks,
  menu: UtensilsCrossed,
  quote: ReceiptText,
  team: UsersRound,
  feedback: MessageSquareHeart,
  enquiry: CalendarPlus,
  rsvp: Sparkles,
};

export function OverviewView() {
  const { data, navigate, setEnquiryOpen } = useDemo();
  const k = computeKpis(data);

  return (
    <div>
      <ViewHeader
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[11.5px] text-ink-muted ring-1 ring-line">
            <CalendarDays aria-hidden className="size-3.5 text-electric-600" />
            Demo date · <span className="font-medium text-ink">{formatLongDate(DEMO_TODAY)}</span>
          </span>
        }
        title={`Good morning, ${CURRENT_USER.name.split(" ")[0]}`}
        description={`Here's what's moving across ${BUSINESS.name} this week — bookings, kitchen prep, crews and guest sentiment in one view.`}
        actions={
          <>
            <Btn onClick={() => navigate("calendar")}>
              <CalendarDays aria-hidden className="size-3.5" /> Calendar
            </Btn>
            <Btn variant="primary" onClick={() => setEnquiryOpen(true)}>
              <Plus aria-hidden className="size-3.5" /> New enquiry
            </Btn>
          </>
        }
      />

      <section aria-label="Key metrics (sample data)" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi
          icon={CalendarDays}
          label="Upcoming this month"
          value={String(k.upcomingThisMonth)}
          sub={`${k.nextSevenDays} in the next 7 days`}
          onClick={() => navigate("calendar")}
        />
        <Kpi
          icon={CalendarCheck2}
          label="Confirmed bookings"
          value={String(k.confirmed)}
          sub={`${formatINRCompact(k.confirmedValue)} booked value`}
          onClick={() => navigate("events")}
        />
        <Kpi
          icon={CalendarPlus}
          label="Open enquiries"
          value={String(k.enquiries)}
          sub={`+ ${k.tentative} tentative`}
          onClick={() => navigate("events")}
        />
        <Kpi
          icon={IndianRupee}
          label="Pipeline value"
          value={formatINRCompact(k.pipelineValue)}
          sub={`Across ${k.pipelineCount} open deals, incl. tax`}
          onClick={() => navigate("quotation")}
          accent
        />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <BookingsChart />
        <TaskSummary />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <UpcomingEvents />
        <div className="flex flex-col gap-4">
          <FeedbackSummary avg={k.avgRating} count={k.ratingsCount} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  onClick,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-xl border p-4 text-left transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-px sm:p-5",
        accent
          ? "on-dark border-transparent bg-midnight text-white shadow-[0_12px_32px_-16px_rgb(11_16_32/0.55)] hover:shadow-[0_16px_36px_-14px_rgb(11_16_32/0.6)]"
          : "border-line bg-white shadow-[0_1px_2px_rgb(11_16_32/0.04)] hover:border-line-strong hover:shadow-[0_8px_24px_-14px_rgb(11_16_32/0.2)]",
      )}
    >
      {accent && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-[radial-gradient(circle,rgb(56_107_255/0.45),transparent_65%)] blur-xl"
        />
      )}
      <span className="relative flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-lg",
            accent ? "bg-white/10 text-electric-300" : "bg-electric/[0.07] text-electric-600",
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <SampleTag className={accent ? "bg-white/[0.08] text-haze-muted" : undefined} />
      </span>
      <span className={cn("relative mt-4 text-[12.5px]", accent ? "text-haze-muted" : "text-ink-muted")}>{label}</span>
      <span className="relative mt-1 text-[26px] leading-none font-semibold tracking-[-0.03em] tabular-nums sm:text-[30px]">{value}</span>
      <span className={cn("relative mt-2 flex items-center gap-1 truncate text-[12px]", accent ? "text-haze-subtle" : "text-ink-subtle")}>
        {sub}
        <ArrowRight aria-hidden className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </button>
  );
}

function BookingsChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...BOOKING_HISTORY.map((b) => b.bookings));
  const ceiling = Math.ceil(max / 5) * 5;
  const tickStep = ceiling / 5 >= 3 ? 10 : 5;
  const total = BOOKING_HISTORY.reduce((s, b) => s + b.bookings, 0);
  const ticks = Array.from({ length: Math.floor(ceiling / tickStep) + 1 }, (_, i) => i * tickStep).reverse();
  const peak = BOOKING_HISTORY.reduce((a, b) => (b.bookings > a.bookings ? b : a));
  const lastIndex = BOOKING_HISTORY.length - 1;

  return (
    <Card className="xl:col-span-2" aria-labelledby="chart-title">
      <CardHeader
        id="chart-title"
        title="Confirmed bookings by month"
        description="Last 12 months · wedding season peaks Nov–Feb"
        action={<SampleTag />}
      />
      <div className="flex items-baseline gap-3 px-5">
        <span className="text-[28px] font-semibold tracking-[-0.03em] text-ink tabular-nums">{total}</span>
        <span className="text-[12.5px] text-ink-subtle">
          bookings · peak {peak.label} ({peak.bookings})
        </span>
      </div>
      <div className="relative px-5 pt-4 pb-5">
        <div className="relative h-[180px] pl-7">
          {ticks.map((t) => (
            <div
              key={t}
              aria-hidden
              className="absolute right-0 left-7 flex items-center"
              style={{ bottom: `${(t / ceiling) * 100}%` }}
            >
              <span className="absolute -left-7 w-5 -translate-y-1/2 text-right font-mono text-[10px] text-ink-subtle tabular-nums">
                {t}
              </span>
              <span className={cn("h-px w-full", t === 0 ? "bg-line-strong" : "border-t border-dashed border-line")} />
            </div>
          ))}
          <ul className="absolute inset-0 left-7 flex items-end gap-[2px] sm:gap-1.5" aria-label="Bookings per month">
            {BOOKING_HISTORY.map((b, i) => {
              const h = (b.bookings / ceiling) * 100;
              const active = hover === i;
              const current = i === lastIndex;
              return (
                <li
                  key={b.month}
                  tabIndex={0}
                  aria-label={`${b.label} ${b.month.slice(0, 4)}: ${b.bookings} bookings${current ? " (month to date)" : ""}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="group relative flex h-full flex-1 cursor-default items-end justify-center rounded-md focus-visible:outline-offset-1"
                >
                  <span
                    className={cn(
                      "block w-full max-w-[34px] rounded-t-[4px] transition-[background-color,height] duration-500 ease-[var(--ease-out-expo)]",
                      current
                        ? "bg-electric-600"
                        : active
                          ? "bg-electric/70"
                          : "bg-electric/[0.28]",
                      current && "bg-[repeating-linear-gradient(135deg,var(--color-electric-600)_0_6px,var(--color-electric)_6px_8px)]",
                    )}
                    style={{ height: `${h}%` }}
                  />
                  {active && (
                    <span className="pointer-events-none absolute bottom-[calc(var(--h)+8px)] left-1/2 z-10 -translate-x-1/2 rounded-md bg-midnight px-2 py-1 text-[11px] whitespace-nowrap text-white shadow-lg" style={{ ["--h" as string]: `${h}%` }}>
                      <span className="font-semibold tabular-nums">{b.bookings}</span> bookings · {b.label}
                      {current ? " (MTD)" : ""}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div aria-hidden className="mt-2 flex gap-[2px] pl-7 sm:gap-1.5">
          {BOOKING_HISTORY.map((b, i) => (
            <span
              key={b.month}
              className={cn(
                "flex-1 text-center font-mono text-[10px]",
                i === lastIndex ? "font-semibold text-ink" : "text-ink-subtle",
                i % 2 === 1 && i !== lastIndex && "max-sm:invisible",
              )}
            >
              {b.label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-ink-subtle">Striped bar = current month to date.</p>
      </div>
    </Card>
  );
}

function TaskSummary() {
  const { data, navigate } = useDemo();
  const todo = data.tasks.filter((t) => t.status === "todo").length;
  const doing = data.tasks.filter((t) => t.status === "doing").length;
  const done = data.tasks.filter((t) => t.status === "done").length;
  const total = data.tasks.length || 1;
  const dueSoon = data.tasks
    .filter((t) => t.status !== "done" && daysFromToday(t.due) <= 4)
    .sort((a, b) => toUTC(a.due) - toUTC(b.due))
    .slice(0, 4);

  return (
    <Card aria-labelledby="tasks-title" className="flex flex-col">
      <CardHeader
        id="tasks-title"
        title="Task progress"
        description={`${done} of ${data.tasks.length} tasks complete`}
        action={
          <Btn size="xs" variant="ghost" onClick={() => navigate("team")}>
            Board <ArrowRight aria-hidden className="size-3" />
          </Btn>
        }
      />
      <div className="px-5">
        <div className="flex h-2 gap-[2px] overflow-hidden rounded-full" role="img" aria-label={`${done} done, ${doing} in progress, ${todo} to do`}>
          <span className="bg-success" style={{ width: `${(done / total) * 100}%` }} />
          <span className="bg-electric" style={{ width: `${(doing / total) * 100}%` }} />
          <span className="bg-ink/10" style={{ width: `${(todo / total) * 100}%` }} />
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
          {[
            { label: "Done", value: done, dot: "bg-success" },
            { label: "In progress", value: doing, dot: "bg-electric" },
            { label: "To do", value: todo, dot: "bg-ink/20" },
          ].map((s) => (
            <div key={s.label}>
              <dt className="flex items-center gap-1.5 text-ink-subtle">
                <span aria-hidden className={cn("size-2 rounded-full", s.dot)} />
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[18px] font-semibold text-ink tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-4 flex-1 border-t border-line px-5 pt-3 pb-4">
        <p className="mb-2 text-[12px] font-medium text-ink-muted">Due in the next few days</p>
        {dueSoon.length === 0 ? (
          <p className="text-[12.5px] text-ink-subtle">Nothing urgent. Nice.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {dueSoon.map((t) => {
              const who = data.staff.find((s) => s.id === t.assigneeId);
              const d = daysFromToday(t.due);
              return (
                <li key={t.id} className="flex items-center gap-2.5">
                  {who ? <Avatar name={who.name} tint={who.tint} size="xs" /> : <span className="size-5" />}
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-2">{t.title}</span>
                  <span className={cn("shrink-0 font-mono text-[10.5px]", d < 0 ? "text-danger" : d === 0 ? "text-warning" : "text-ink-subtle")}>
                    {d < 0 ? "Overdue" : d === 0 ? "Today" : formatShortDate(t.due)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}

function UpcomingEvents() {
  const { data, openEvent, navigate } = useDemo();
  const upcoming = data.events
    .filter(isUpcoming)
    .sort((a, b) => toUTC(a.date) - toUTC(b.date))
    .slice(0, 8);
  return (
    <Card className="xl:col-span-2" aria-labelledby="upcoming-title">
      <CardHeader
        id="upcoming-title"
        title="Upcoming events"
        description="Next on the run-sheet"
        action={
          <Btn size="xs" variant="ghost" onClick={() => navigate("events")}>
            All events <ArrowRight aria-hidden className="size-3" />
          </Btn>
        }
      />
      <ul className="px-2 pb-2">
        {upcoming.map((e) => {
          const p = taskProgress(data.tasks, e.id);
          const d = daysFromToday(e.date);
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => openEvent(e.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-mist sm:gap-4"
              >
                <span className="flex w-11 shrink-0 flex-col items-center rounded-lg bg-mist py-1.5 ring-1 ring-line/80 ring-inset">
                  <span className="font-mono text-[9.5px] tracking-wider text-ink-subtle uppercase">{formatShortDate(e.date).split(" ")[1]}</span>
                  <span className="text-[16px] leading-tight font-semibold text-ink tabular-nums">{e.date.slice(8)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{e.title}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink-subtle">
                    <TypeTag type={e.type} className="text-[12px]" />
                    <span className="truncate">
                      {formatTime(e.startTime)} · {e.venue}
                    </span>
                  </span>
                </span>
                <span className="hidden w-28 shrink-0 md:block">
                  <span className="mb-1 flex justify-between text-[11px] text-ink-subtle">
                    <span>Prep</span>
                    <span className="tabular-nums">{p.total ? `${p.done}/${p.total}` : "—"}</span>
                  </span>
                  <Progress value={p.pct} tone="success" label={`${e.title} preparation`} />
                </span>
                <span className="hidden w-16 shrink-0 text-right text-[12px] text-ink-muted tabular-nums sm:block">
                  {e.guests.toLocaleString("en-IN")} pax
                </span>
                <span className="flex w-[92px] shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={e.status} />
                  <span className="font-mono text-[10.5px] text-ink-subtle">{d === 0 ? "Today" : d === 1 ? "Tomorrow" : `in ${d}d`}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function FeedbackSummary({ avg, count }: { avg: number; count: number }) {
  const { data, navigate } = useDemo();
  const latest = data.feedback[0];
  return (
    <Card aria-labelledby="fb-title">
      <CardHeader
        id="fb-title"
        title="Guest feedback"
        action={
          <Btn size="xs" variant="ghost" onClick={() => navigate("feedback")}>
            Review <ArrowRight aria-hidden className="size-3" />
          </Btn>
        }
      />
      <div className="flex items-center gap-4 px-5 pb-4">
        <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">{avg.toFixed(1)}</span>
        <span>
          <Stars value={avg} />
          <span className="mt-1 block text-[12px] text-ink-subtle">{count} reviews · sample data</span>
        </span>
      </div>
      {latest && (
        <blockquote className="mx-5 mb-5 rounded-lg bg-mist px-3.5 py-3 text-[12.5px] leading-relaxed text-ink-2 ring-1 ring-line/70 ring-inset">
          <span className="accent-serif text-[15px] text-ink">“</span>
          {latest.comment}
          <footer className="mt-1.5 text-[11.5px] text-ink-subtle">— {latest.guest}</footer>
        </blockquote>
      )}
    </Card>
  );
}

function RecentActivity() {
  const { data } = useDemo();
  return (
    <Card aria-labelledby="act-title" className="flex-1">
      <CardHeader id="act-title" title="Recent activity" description="Updates from your team and clients" />
      <ol className="relative px-5 pb-5">
        {data.activity.slice(0, 6).map((a, i, arr) => {
          const Icon = ACTIVITY_ICON[a.kind];
          return (
            <li key={a.id} className="relative flex gap-3 pb-3.5 last:pb-0">
              {i < arr.length - 1 && <span aria-hidden className="absolute top-7 bottom-0 left-[13px] w-px bg-line" />}
              <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-line">
                <Icon className="size-3.5 text-ink-subtle" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[12.5px] leading-snug text-ink-2">{a.text}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-ink-subtle">{relativeTime(a.at)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
