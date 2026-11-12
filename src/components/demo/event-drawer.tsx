"use client";

import { useId, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Smartphone,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { EVENT_STATUSES, STATUS_META } from "@/lib/demo/catalog";
import { daysFromToday, formatLongDate, formatShortDate, formatTime } from "@/lib/demo/dates";
import { menuDishes, perPlate, quoteForEvent, taskProgress } from "@/lib/demo/derive";
import type { EventStatus } from "@/lib/demo/types";
import { useDemo, useEvent } from "./store";
import { Avatar, Btn, Drawer, IconBtn, Pill, Progress, Select, StatusBadge, TypeTag } from "./ui";

export function EventDrawer() {
  const { drawerEventId, closeEvent } = useDemo();
  const event = useEvent(drawerEventId);
  return (
    <Drawer open={Boolean(event)} onClose={closeEvent} label={event ? `Event details: ${event.title}` : "Event details"}>
      {event && <EventDetails eventId={event.id} />}
    </Drawer>
  );
}

function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="border-t border-line px-5 py-5 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-mono text-[10.5px] tracking-[0.14em] text-ink-subtle uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 text-ink-subtle">{icon}</span>
      <div className="min-w-0">
        <dt className="text-[11.5px] text-ink-subtle">{label}</dt>
        <dd className="mt-0.5 text-[13px] font-medium text-ink">{children}</dd>
      </div>
    </div>
  );
}

function EventDetails({ eventId }: { eventId: string }) {
  const { data, dispatch, toast, navigate, closeEvent } = useDemo();
  const event = useEvent(eventId)!;
  const statusId = useId();
  const assignId = useId();
  const notesId = useId();
  const quote = quoteForEvent(event);
  const plate = perPlate(event);
  const dishes = menuDishes(event);
  const tasks = data.tasks.filter((t) => t.eventId === event.id);
  const progress = taskProgress(data.tasks, event.id);
  const assigned = event.staffIds.map((id) => data.staff.find((s) => s.id === id)).filter((s) => s !== undefined);
  const unassigned = data.staff.filter((s) => !event.staffIds.includes(s.id));
  const days = daysFromToday(event.date);
  const when = days === 0 ? "Today" : days === 1 ? "Tomorrow" : days > 0 ? `In ${days} days` : `${-days} days ago`;

  const go = (view: "menu" | "quotation" | "customer" | "team") => {
    closeEvent();
    navigate(view, { eventId: event.id });
  };

  return (
    <>
      <header className="flex items-start gap-3 px-5 pt-5 pb-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-ink-subtle">{event.id}</span>
            <TypeTag type={event.type} className="text-[12px]" />
          </div>
          <h2 className="mt-1.5 text-[19px] leading-tight font-semibold tracking-[-0.02em] text-ink">{event.title}</h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            {event.client.name} · <span className="text-ink-subtle">{when}</span>
          </p>
        </div>
        <IconBtn label="Close event details" onClick={closeEvent}>
          <X aria-hidden className="size-4" />
        </IconBtn>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="flex flex-wrap items-center gap-3 px-5 pb-5 sm:px-6">
          <label htmlFor={statusId} className="text-[12.5px] font-medium text-ink-2">
            Status
          </label>
          <Select
            id={statusId}
            size="sm"
            value={event.status}
            onChange={(e) => {
              const status = e.target.value as EventStatus;
              dispatch({ type: "setStatus", eventId: event.id, status });
              toast(`${event.title} is now ${STATUS_META[status].label}.`);
            }}
            className="w-40"
          >
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </Select>
          <StatusBadge status={event.status} />
        </div>

        <Section title="Details">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Fact icon={<CalendarDays className="size-4" />} label="Date">
              {formatLongDate(event.date)}
            </Fact>
            <Fact icon={<Clock className="size-4" />} label="Time">
              {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </Fact>
            <Fact icon={<MapPin className="size-4" />} label="Venue">
              {event.venue}
              <span className="block text-[12px] font-normal text-ink-subtle">{event.city}</span>
            </Fact>
            <Fact icon={<Users className="size-4" />} label="Guests">
              <span className="tabular-nums">{event.guests.toLocaleString("en-IN")}</span>
            </Fact>
            <Fact icon={<Phone className="size-4" />} label="Client contact (masked)">
              <span className="font-mono text-[12.5px] tabular-nums">{event.client.phone}</span>
            </Fact>
            <Fact icon={<Mail className="size-4" />} label="Email (masked)">
              <span className="font-mono text-[12.5px]">{event.client.email}</span>
            </Fact>
          </dl>
        </Section>

        <Section
          title={`Team · ${assigned.length}`}
          action={
            <Btn size="xs" variant="ghost" onClick={() => go("team")}>
              Team board <ArrowRight aria-hidden className="size-3" />
            </Btn>
          }
        >
          {assigned.length === 0 ? (
            <p className="mb-3 text-[13px] text-ink-subtle">Nobody assigned yet.</p>
          ) : (
            <ul className="mb-3 flex flex-col gap-1">
              {assigned.map((s) => (
                <li key={s.id} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-mist">
                  <Avatar name={s.name} tint={s.tint} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">{s.name}</span>
                    <span className="block truncate text-[11.5px] text-ink-subtle">{s.role}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "unassign", eventId: event.id, staffId: s.id });
                      toast(`${s.name} removed from this event.`, "info");
                    }}
                    className="rounded-md px-2 py-1 text-[12px] text-ink-subtle hover:bg-white hover:text-danger"
                    aria-label={`Unassign ${s.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {unassigned.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor={assignId} className="sr-only">
                Assign a team member or vendor
              </label>
              <Select
                id={assignId}
                size="sm"
                value=""
                onChange={(e) => {
                  const s = data.staff.find((x) => x.id === e.target.value);
                  if (!s) return;
                  dispatch({ type: "assign", eventId: event.id, staffId: s.id });
                  toast(`${s.name} assigned to ${event.title}.`);
                }}
                className="w-full"
              >
                <option value="" disabled>
                  + Assign team member or vendor…
                </option>
                {unassigned.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.role}
                    {s.availability === "leave" ? " (on leave)" : ""}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </Section>

        <Section title="Menu & quotation">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Dishes" value={String(dishes.length)} />
            <Stat label="Per plate" value={formatINR(plate)} />
            <Stat label="Quote total" value={formatINR(quote.total)} />
          </div>
          {dishes.length > 0 && (
            <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-ink-muted">
              {dishes.map((d) => d.name).join(" · ")}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Btn size="sm" onClick={() => go("menu")}>
              <UtensilsCrossed aria-hidden className="size-3.5" /> Edit menu
            </Btn>
            <Btn size="sm" onClick={() => go("quotation")}>
              <ReceiptText aria-hidden className="size-3.5" /> Open quotation
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => go("customer")}>
              <Smartphone aria-hidden className="size-3.5" /> Customer app
            </Btn>
            <Pill className={cn("ml-auto", event.quote.status === "sent" && "bg-success-soft text-[#0B7A50]")}>
              Quote {event.quote.status === "sent" ? "sent" : "draft"}
            </Pill>
          </div>
        </Section>

        <Section title={`Tasks · ${progress.done}/${progress.total}`}>
          {tasks.length === 0 ? (
            <p className="text-[13px] text-ink-subtle">No tasks linked to this event yet. Add one from the team board.</p>
          ) : (
            <>
              <Progress value={progress.pct} tone="success" label="Task completion" className="mb-3" />
              <ul className="flex flex-col">
                {tasks.map((t) => {
                  const who = data.staff.find((s) => s.id === t.assigneeId);
                  const done = t.status === "done";
                  return (
                    <li key={t.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-mist">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => dispatch({ type: "setTaskStatus", taskId: t.id, status: done ? "todo" : "done" })}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-electric",
                            done ? "border-success bg-success text-white" : "border-line-strong bg-white",
                          )}
                        >
                          {done && <Check className="size-3" strokeWidth={3} />}
                        </span>
                        <span className={cn("min-w-0 flex-1 text-[13px]", done ? "text-ink-subtle line-through" : "text-ink")}>
                          {t.title}
                          {t.status === "doing" && <span className="ml-2 text-[11px] text-electric-600 no-underline">In progress</span>}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-ink-subtle">{formatShortDate(t.due)}</span>
                        {who && <Avatar name={who.name} tint={who.tint} size="xs" />}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Section>

        <Section title="Notes">
          <label htmlFor={notesId} className="sr-only">
            Event notes
          </label>
          <textarea
            id={notesId}
            value={event.notes}
            onChange={(e) => dispatch({ type: "setNotes", eventId: event.id, notes: e.target.value })}
            rows={4}
            className="w-full resize-y rounded-lg border border-line bg-mist/50 px-3 py-2.5 text-[13px] leading-relaxed text-ink transition-[border-color,box-shadow,background-color] focus:border-electric focus:bg-white focus:shadow-[0_0_0_3px_rgb(56_107_255/0.15)] focus-visible:outline-none"
          />
          <p className="mt-1.5 text-[11.5px] text-ink-subtle">Saved automatically in this browser.</p>
        </Section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-mist px-3 py-2.5 ring-1 ring-line/70 ring-inset">
      <p className="text-[11px] text-ink-subtle">{label}</p>
      <p className="mt-0.5 text-[14px] font-semibold text-ink tabular-nums">{value}</p>
    </div>
  );
}
