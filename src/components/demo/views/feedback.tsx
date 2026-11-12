"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCheck, CircleCheck, MessageSquareReply, MessageSquareText, Undo2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatMediumDate, formatShortDate, relativeTime, toUTC } from "@/lib/demo/dates";
import { isUpcoming, taskProgress } from "@/lib/demo/derive";
import type { Feedback } from "@/lib/demo/types";
import { NOTIFICATION_ICON, useOpenNotification } from "../notifications";
import { useDemo } from "../store";
import { Btn, Card, CardHeader, EmptyState, Pill, Progress, SampleTag, Select, Stars, Switch, ViewHeader } from "../ui";

export function FeedbackView() {
  const { data } = useDemo();
  const [eventFilter, setEventFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [unreviewedOnly, setUnreviewedOnly] = useState(false);
  const filterId = useId();

  const scoped = data.feedback.filter((f) => (eventFilter === "all" ? true : f.eventId === eventFilter));
  const list = scoped
    .filter((f) => (ratingFilter ? f.rating === ratingFilter : true))
    .filter((f) => (unreviewedOnly ? !f.reviewed : true))
    .sort((a, b) => toUTC(b.date) - toUTC(a.date));
  const avg = scoped.length ? scoped.reduce((s, f) => s + f.rating, 0) / scoped.length : 0;
  const dist = [5, 4, 3, 2, 1].map((r) => ({ r, n: scoped.filter((f) => f.rating === r).length }));
  const maxN = Math.max(1, ...dist.map((d) => d.n));
  const eventsWithFeedback = data.events.filter((e) => data.feedback.some((f) => f.eventId === e.id));
  const unreviewed = scoped.filter((f) => !f.reviewed).length;

  return (
    <div>
      <ViewHeader
        title="Guest feedback"
        description="The manager's pulse on every event: ratings as they arrive, what needs a response, and how prep is tracking for what's next."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-2">
          <Card aria-labelledby="rating-title">
            <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[200px_minmax(0,1fr)]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="rating-title" className="text-[13px] font-medium text-ink-muted">
                    Average rating
                  </h2>
                  <SampleTag />
                </div>
                <p className="mt-2 text-[44px] leading-none font-semibold tracking-[-0.04em] text-ink tabular-nums">{avg.toFixed(1)}</p>
                <Stars value={avg} size="md" className="mt-2" />
                <p className="mt-2 text-[12px] text-ink-subtle">
                  {scoped.length} reviews · {unreviewed} awaiting review
                </p>
              </div>
              <div>
                <p className="mb-2 text-[12px] text-ink-subtle">Rating distribution — select a row to filter</p>
                <ul className="flex flex-col gap-1">
                  {dist.map(({ r, n }) => {
                    const active = ratingFilter === r;
                    return (
                      <li key={r}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setRatingFilter(active ? null : r)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-2 py-1 transition-colors",
                            active ? "bg-electric/[0.07]" : "hover:bg-mist",
                          )}
                        >
                          <span className="w-8 text-left text-[12px] font-medium text-ink-2 tabular-nums">{r} ★</span>
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                            <span
                              className={cn("block h-full rounded-full transition-[width] duration-500", active ? "bg-electric-600" : "bg-[#F2A20C]")}
                              style={{ width: `${(n / maxN) * 100}%` }}
                            />
                          </span>
                          <span className="w-6 text-right text-[12px] text-ink-muted tabular-nums">{n}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Card>

          <Card as="div">
            <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
              <label htmlFor={filterId} className="sr-only">
                Filter feedback by event
              </label>
              <Select id={filterId} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="sm:w-80">
                <option value="all">All events</option>
                {eventsWithFeedback.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </Select>
              <div className="sm:ml-auto">
                <Switch checked={unreviewedOnly} onChange={setUnreviewedOnly} label="Awaiting review only" />
              </div>
            </div>
            {list.length === 0 ? (
              <EmptyState
                icon={<MessageSquareText className="size-4" />}
                title="No feedback matches"
                body="Adjust the filters, or collect a review from the Customer app's Feedback tab."
                action={
                  <Btn
                    onClick={() => {
                      setEventFilter("all");
                      setRatingFilter(null);
                      setUnreviewedOnly(false);
                    }}
                  >
                    Clear filters
                  </Btn>
                }
              />
            ) : (
              <ul className="divide-y divide-line">
                {list.map((f) => (
                  <FeedbackItem key={f.id} entry={f} />
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <ProgressTracker />
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
}

function FeedbackItem({ entry }: { entry: Feedback }) {
  const { data, dispatch, toast, openEvent } = useDemo();
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState(entry.reply);
  const replyId = useId();
  const event = data.events.find((e) => e.id === entry.eventId);

  return (
    <li className={cn("px-5 py-4", !entry.reviewed && "bg-[linear-gradient(90deg,rgb(56_107_255/0.04),transparent_40%)]")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Stars value={entry.rating} />
        <span className="text-[13px] font-semibold text-ink">{entry.guest}</span>
        <Pill>{entry.source}</Pill>
        <span className="ml-auto font-mono text-[11px] text-ink-subtle">{formatMediumDate(entry.date)}</span>
      </div>
      {event && (
        <button type="button" onClick={() => openEvent(event.id)} className="mt-1 text-[12px] text-ink-subtle hover:text-electric-600 hover:underline">
          {event.title}
        </button>
      )}
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{entry.comment}</p>

      {entry.reply && !replying && (
        <div className="mt-3 rounded-lg bg-mist px-3 py-2 text-[12.5px] text-ink-muted ring-1 ring-line/70 ring-inset">
          <span className="font-medium text-ink-2">Internal note: </span>
          {entry.reply}
        </div>
      )}

      {replying && (
        <form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "setReply", id: entry.id, reply: draft.trim() });
            setReplying(false);
            toast("Note saved and feedback marked reviewed.");
          }}
        >
          <label htmlFor={replyId} className="text-[12px] font-medium text-ink-muted">
            Reply / internal note
          </label>
          <textarea
            id={replyId}
            autoFocus
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Thanked the guest; shared with Chef Vikram."
            className="mt-1 w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink focus:border-electric focus:shadow-[0_0_0_3px_rgb(56_107_255/0.15)] focus-visible:outline-none"
          />
          <div className="mt-2 flex gap-2">
            <Btn size="sm" type="submit" variant="primary" disabled={!draft.trim()}>
              Save note
            </Btn>
            <Btn
              size="sm"
              variant="ghost"
              onClick={() => {
                setReplying(false);
                setDraft(entry.reply);
              }}
            >
              Cancel
            </Btn>
          </div>
        </form>
      )}

      {!replying && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {entry.reviewed ? (
            <>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-success">
                <CircleCheck aria-hidden className="size-3.5" /> Reviewed
              </span>
              <Btn size="xs" variant="ghost" onClick={() => dispatch({ type: "setReviewed", id: entry.id, reviewed: false })}>
                <Undo2 aria-hidden className="size-3" /> Mark unreviewed
              </Btn>
            </>
          ) : (
            <Btn
              size="xs"
              onClick={() => {
                dispatch({ type: "setReviewed", id: entry.id, reviewed: true });
                toast("Feedback marked as reviewed.");
              }}
            >
              <CheckCheck aria-hidden className="size-3" /> Mark reviewed
            </Btn>
          )}
          <Btn size="xs" variant="ghost" onClick={() => setReplying(true)}>
            <MessageSquareReply aria-hidden className="size-3" /> {entry.reply ? "Edit note" : "Reply"}
          </Btn>
        </div>
      )}
    </li>
  );
}

function ProgressTracker() {
  const { data, openEvent } = useDemo();
  const events = data.events
    .filter(isUpcoming)
    .sort((a, b) => toUTC(a.date) - toUTC(b.date))
    .slice(0, 6);
  return (
    <Card aria-labelledby="tracker-title">
      <CardHeader id="tracker-title" title="Event progress" description="Checklist completion for what's next" />
      <ul className="px-2 pb-3">
        {events.map((e) => {
          const p = taskProgress(data.tasks, e.id);
          return (
            <li key={e.id}>
              <button type="button" onClick={() => openEvent(e.id)} className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-mist">
                <span className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-[12.5px] font-medium text-ink">{e.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-ink-subtle">{formatShortDate(e.date)}</span>
                </span>
                <span className="mt-2 flex items-center gap-3">
                  <Progress value={p.pct} tone={p.pct === 100 ? "success" : "electric"} label={`${e.title} checklist`} />
                  <span className="w-16 shrink-0 text-right text-[11.5px] text-ink-muted tabular-nums">
                    {p.total ? `${p.pct}% · ${p.done}/${p.total}` : "No tasks"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function NotificationsPanel() {
  const { data, dispatch } = useDemo();
  const openNotification = useOpenNotification();
  const unread = data.notifications.filter((n) => !n.read).length;
  return (
    <Card aria-labelledby="notif-title">
      <CardHeader
        id="notif-title"
        title="Notifications"
        description={unread ? `${unread} unread` : "All caught up"}
        action={
          <Btn size="xs" variant="ghost" disabled={!unread} onClick={() => dispatch({ type: "markAllRead" })}>
            <CheckCheck aria-hidden className="size-3" /> Mark all read
          </Btn>
        }
      />
      <ul className="px-2 pb-2">
        {data.notifications.slice(0, 6).map((n) => {
          const meta = NOTIFICATION_ICON[n.kind];
          const Icon = meta.icon;
          return (
            <li key={n.id}>
              <button type="button" onClick={() => openNotification(n)} className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-mist">
                <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg", meta.tone)}>
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-[12.5px]", n.read ? "text-ink-2" : "font-semibold text-ink")}>
                    {n.title}
                    {!n.read && <span className="sr-only"> (unread)</span>}
                  </span>
                  <span className="block truncate text-[11.5px] text-ink-subtle">{n.body}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-mono text-[10.5px] text-ink-subtle">{relativeTime(n.at)}</span>
                  {!n.read && <span aria-hidden className="size-1.5 rounded-full bg-electric" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="flex items-center gap-1 border-t border-line px-5 py-2.5 text-[11.5px] text-ink-subtle">
        Selecting a notification opens the related view <ArrowRight aria-hidden className="size-3" />
      </p>
    </Card>
  );
}
