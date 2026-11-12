"use client";

import { useId, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CircleDot,
  ListTodo,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DEMO_TODAY } from "@/lib/demo/catalog";
import { daysFromToday, formatMediumDate, formatShortDate, toUTC } from "@/lib/demo/dates";
import { isUpcoming } from "@/lib/demo/derive";
import type { Availability, FollowUp, StaffMember, Task, TaskStatus } from "@/lib/demo/types";
import { useDemo } from "../store";
import { Avatar, Btn, Card, EmptyState, Field, IconBtn, Modal, Pill, Select, StatusBadge, Tabs, TextInput, ViewHeader } from "../ui";

type TeamTab = "board" | "roster" | "mine";

const COLUMNS: { id: TaskStatus; label: string; dot: string }[] = [
  { id: "todo", label: "To do", dot: "bg-ink/25" },
  { id: "doing", label: "In progress", dot: "bg-electric" },
  { id: "done", label: "Done", dot: "bg-success" },
];

const AVAILABILITY: Record<Availability, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-success-soft text-success" },
  "on-event": { label: "On an event", className: "bg-[#EAF0FF] text-electric-600" },
  leave: { label: "On leave", className: "bg-warning-soft text-warning" },
};

export function TeamView() {
  const { data } = useDemo();
  // `#staff` deep links land on the staff-dashboard tab. This view only renders on the client.
  const [tab, setTab] = useState<TeamTab>(() => (window.location.hash === "#staff" ? "mine" : "board"));
  const [addOpen, setAddOpen] = useState(false);
  const openFollowUps = data.followUps.filter((f) => !f.done).length;

  return (
    <div>
      <ViewHeader
        title="Team & tasks"
        description="Crews, chefs and vendors on one board. Assign people to events, move tasks forward and keep client follow-ups from slipping."
        actions={
          <Btn variant="primary" onClick={() => setAddOpen(true)}>
            <Plus aria-hidden className="size-3.5" /> Add task
          </Btn>
        }
      />
      <Tabs
        label="Team sections"
        idPrefix="team"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "board", label: "Task board", count: data.tasks.filter((t) => t.status !== "done").length },
          { id: "roster", label: "Roster", count: data.staff.length },
          { id: "mine", label: "My follow-ups", count: openFollowUps },
        ]}
        className="mb-4"
      />
      <div role="tabpanel" id="team-panel" aria-labelledby={`team-tab-${tab}`}>
        {tab === "board" && <TaskBoard />}
        {tab === "roster" && <Roster />}
        {tab === "mine" && <MyFollowUps />}
      </div>
      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

/* ───────────────────────────── Board ───────────────────────────── */

function TaskBoard() {
  const { data, dispatch, toast } = useDemo();
  const [assignee, setAssignee] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);
  const [mobileCol, setMobileCol] = useState<TaskStatus>("todo");
  const assigneeId = useId();
  const eventId = useId();

  const tasks = data.tasks
    .filter((t) => (assignee === "all" ? true : t.assigneeId === assignee))
    .filter((t) => (eventFilter === "all" ? true : eventFilter === "none" ? t.eventId === null : t.eventId === eventFilter))
    .sort((a, b) => (a.priority === b.priority ? toUTC(a.due) - toUTC(b.due) : a.priority === "high" ? -1 : 1));

  const eventsWithTasks = data.events.filter((e) => data.tasks.some((t) => t.eventId === e.id));

  const move = (task: Task, status: TaskStatus) => {
    dispatch({ type: "setTaskStatus", taskId: task.id, status });
    const label = COLUMNS.find((c) => c.id === status)?.label;
    toast(`“${task.title}” moved to ${label}.`, "info");
  };

  const onDrop = (e: DragEvent<HTMLElement>, status: TaskStatus) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/plain");
    const task = data.tasks.find((t) => t.id === id);
    if (task && task.status !== status) move(task, status);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={assigneeId} className="text-[12px] font-medium text-ink-muted">
            Assignee
          </label>
          <Select id={assigneeId} value={assignee} onChange={(e) => setAssignee(e.target.value)} className="sm:w-52">
            <option value="all">Everyone</option>
            {data.staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={eventId} className="text-[12px] font-medium text-ink-muted">
            Event
          </label>
          <Select id={eventId} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="sm:w-72">
            <option value="all">All events</option>
            <option value="none">General (no event)</option>
            {eventsWithTasks.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </Select>
        </div>
        {(assignee !== "all" || eventFilter !== "all") && (
          <Btn
            variant="ghost"
            onClick={() => {
              setAssignee("all");
              setEventFilter("all");
            }}
          >
            Clear filters
          </Btn>
        )}
        <p className="text-[12px] text-ink-subtle sm:ml-auto sm:pb-2">Drag cards between columns, or use the arrow buttons.</p>
      </div>

      <Tabs
        label="Board column"
        size="sm"
        value={mobileCol}
        onChange={setMobileCol}
        tabs={COLUMNS.map((c) => ({ id: c.id, label: c.label, count: tasks.filter((t) => t.status === c.id).length }))}
        className="mb-3 md:hidden"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col, ci) => {
          const list = tasks.filter((t) => t.status === col.id);
          return (
            <section
              key={col.id}
              aria-labelledby={`col-${col.id}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(col.id);
              }}
              onDragLeave={() => setDragOver((d) => (d === col.id ? null : d))}
              onDrop={(e) => onDrop(e, col.id)}
              className={cn(
                mobileCol === col.id ? "flex" : "hidden md:flex",
                "min-h-[200px] flex-col rounded-xl bg-ink/[0.03] p-2 ring-1 ring-line/80 transition-colors ring-inset",
                dragOver === col.id && "bg-electric/[0.05] ring-electric/40",
              )}
            >
              <header className="flex items-center gap-2 px-2 pt-1 pb-2.5">
                <span aria-hidden className={cn("size-2 rounded-full", col.dot)} />
                <h2 id={`col-${col.id}`} className="text-[13px] font-semibold text-ink">
                  {col.label}
                </h2>
                <span className="rounded-md bg-white px-1.5 text-[11px] font-medium text-ink-muted tabular-nums ring-1 ring-line">{list.length}</span>
              </header>
              {list.length === 0 ? (
                <p className="m-1 rounded-lg border border-dashed border-line-strong px-3 py-6 text-center text-[12px] text-ink-subtle">
                  No tasks here
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onPrev={ci > 0 ? () => move(t, COLUMNS[ci - 1].id) : undefined}
                      onNext={ci < COLUMNS.length - 1 ? () => move(t, COLUMNS[ci + 1].id) : undefined}
                      prevLabel={ci > 0 ? COLUMNS[ci - 1].label : undefined}
                      nextLabel={ci < COLUMNS.length - 1 ? COLUMNS[ci + 1].label : undefined}
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  task: Task;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const { data, openEvent } = useDemo();
  const who = data.staff.find((s) => s.id === task.assigneeId);
  const event = data.events.find((e) => e.id === task.eventId);
  const d = daysFromToday(task.due);
  const overdue = task.status !== "done" && d < 0;
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="group cursor-grab rounded-lg border border-line bg-white p-3 shadow-[0_1px_2px_rgb(11_16_32/0.04)] transition-shadow hover:shadow-[0_6px_16px_-10px_rgb(11_16_32/0.3)] active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <p className={cn("min-w-0 flex-1 text-[13px] leading-snug font-medium", task.status === "done" ? "text-ink-subtle line-through" : "text-ink")}>
          {task.title}
        </p>
        {task.priority === "high" && task.status !== "done" && (
          <span className="shrink-0 rounded bg-danger-soft px-1.5 py-px text-[10.5px] font-semibold text-danger">High</span>
        )}
      </div>
      {event ? (
        <button type="button" onClick={() => openEvent(event.id)} className="mt-1.5 block max-w-full truncate text-left text-[11.5px] text-ink-subtle hover:text-electric-600 hover:underline">
          {event.title}
        </button>
      ) : (
        <p className="mt-1.5 text-[11.5px] text-ink-subtle">General</p>
      )}
      <div className="mt-3 flex items-center gap-2">
        {who ? (
          <span className="flex min-w-0 items-center gap-1.5" title={who.name}>
            <Avatar name={who.name} tint={who.tint} size="xs" />
            <span className="truncate text-[11.5px] text-ink-muted">{who.name.split(" ")[0]}</span>
          </span>
        ) : (
          <span className="text-[11.5px] text-ink-subtle">Unassigned</span>
        )}
        <span
          className={cn(
            "ml-auto shrink-0 font-mono text-[10.5px]",
            overdue ? "font-semibold text-danger" : d === 0 && task.status !== "done" ? "text-warning" : "text-ink-subtle",
          )}
        >
          {overdue ? `Overdue · ${formatShortDate(task.due)}` : d === 0 ? "Due today" : formatShortDate(task.due)}
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-line pt-2">
        {onPrev ? (
          <Btn size="xs" variant="ghost" onClick={onPrev} aria-label={`Move “${task.title}” back to ${prevLabel}`}>
            {task.status === "done" ? <RotateCcw aria-hidden className="size-3" /> : <ArrowLeft aria-hidden className="size-3" />}
            {task.status === "done" ? "Reopen" : prevLabel}
          </Btn>
        ) : (
          <span />
        )}
        {onNext && (
          <Btn size="xs" variant="subtle" onClick={onNext} aria-label={`Move “${task.title}” to ${nextLabel}`}>
            {nextLabel === "Done" ? <Check aria-hidden className="size-3" /> : null}
            {nextLabel === "Done" ? "Mark done" : "Start"}
            {nextLabel !== "Done" && <ArrowRight aria-hidden className="size-3" />}
          </Btn>
        )}
      </div>
    </li>
  );
}

/* ───────────────────────────── Roster ───────────────────────────── */

function Roster() {
  const { data } = useDemo();
  const [kind, setKind] = useState<"all" | "team" | "vendor">("all");
  const people = data.staff.filter((s) => (kind === "all" ? true : s.kind === kind));
  return (
    <div>
      <Tabs
        label="Roster filter"
        size="sm"
        value={kind}
        onChange={setKind}
        tabs={[
          { id: "all", label: "Everyone" },
          { id: "team", label: "In-house team" },
          { id: "vendor", label: "Vendors" },
        ]}
        className="mb-4"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {people.map((p) => (
          <PersonCard key={p.id} person={p} />
        ))}
      </ul>
    </div>
  );
}

function PersonCard({ person }: { person: StaffMember }) {
  const { data, dispatch, toast, openEvent } = useDemo();
  const selectId = useId();
  const [pick, setPick] = useState("");
  const assigned = data.events
    .filter((e) => e.staffIds.includes(person.id) && isUpcoming(e))
    .sort((a, b) => toUTC(a.date) - toUTC(b.date));
  const options = data.events
    .filter((e) => isUpcoming(e) && !e.staffIds.includes(person.id))
    .sort((a, b) => toUTC(a.date) - toUTC(b.date));
  const avail = AVAILABILITY[person.availability];
  const openTasks = data.tasks.filter((t) => t.assigneeId === person.id && t.status !== "done").length;

  return (
    <li>
      <Card as="article" className="flex h-full flex-col p-4">
        <div className="flex items-start gap-3">
          <Avatar name={person.name} tint={person.tint} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-ink">{person.name}</p>
            <p className="truncate text-[12.5px] text-ink-muted">{person.role}</p>
            <p className="mt-0.5 font-mono text-[11px] text-ink-subtle">{person.phone}</p>
          </div>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", avail.className)}>{avail.label}</span>
        </div>
        <div className="mt-3 flex gap-2 text-[11.5px] text-ink-subtle">
          <Pill>{person.kind === "vendor" ? "Vendor" : "Team"}</Pill>
          <Pill>
            <CalendarDays aria-hidden className="size-3" /> {assigned.length} upcoming
          </Pill>
          <Pill>
            <ListTodo aria-hidden className="size-3" /> {openTasks} open tasks
          </Pill>
        </div>
        <div className="mt-3 flex-1">
          {assigned.length === 0 ? (
            <p className="text-[12px] text-ink-subtle">No upcoming assignments.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {assigned.map((e) => (
                <li key={e.id} className="flex items-center gap-2 rounded-md bg-mist px-2 py-1.5">
                  <button type="button" onClick={() => openEvent(e.id)} className="min-w-0 flex-1 truncate text-left text-[12.5px] text-ink-2 hover:text-electric-600">
                    {e.title}
                  </button>
                  <span className="shrink-0 font-mono text-[10.5px] text-ink-subtle">{formatShortDate(e.date)}</span>
                  <IconBtn
                    label={`Unassign ${person.name} from ${e.title}`}
                    className="size-6"
                    onClick={() => {
                      dispatch({ type: "unassign", eventId: e.id, staffId: person.id });
                      toast(`${person.name} unassigned from ${e.title}.`, "info");
                    }}
                  >
                    <X aria-hidden className="size-3" />
                  </IconBtn>
                </li>
              ))}
            </ul>
          )}
        </div>
        {options.length > 0 && (
          <form
            className="mt-3 flex gap-2 border-t border-line pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              const ev = data.events.find((x) => x.id === pick);
              if (!ev) return;
              dispatch({ type: "assign", eventId: ev.id, staffId: person.id });
              toast(`${person.name} assigned to ${ev.title}.`);
              setPick("");
            }}
          >
            <label htmlFor={selectId} className="sr-only">
              Assign {person.name} to an event
            </label>
            <Select id={selectId} size="sm" value={pick} onChange={(e) => setPick(e.target.value)} className="min-w-0 flex-1">
              <option value="">Assign to event…</option>
              {options.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} · {formatShortDate(e.date)}
                </option>
              ))}
            </Select>
            <Btn size="sm" type="submit" disabled={!pick}>
              <UserPlus aria-hidden className="size-3.5" /> Assign
            </Btn>
          </form>
        )}
      </Card>
    </li>
  );
}

/* ───────────────────────────── My follow-ups ───────────────────────────── */

const CHANNEL_ICON = { Call: Phone, WhatsApp: MessageCircle, Email: Mail, "Site visit": MapPin } as const;

function MyFollowUps() {
  const { data, dispatch, toast, openEvent } = useDemo();
  const [me, setMe] = useState("rohan");
  const meId = useId();
  const person = data.staff.find((s) => s.id === me);
  const followUps = useMemo(
    () =>
      data.followUps
        .filter((f) => f.staffId === me)
        .sort((a, b) => Number(a.done) - Number(b.done) || toUTC(a.due) - toUTC(b.due)),
    [data.followUps, me],
  );
  const myTasks = data.tasks.filter((t) => t.assigneeId === me && t.status !== "done").sort((a, b) => toUTC(a.due) - toUTC(b.due));
  const myEvents = data.events.filter((e) => e.staffIds.includes(me) && isUpcoming(e)).sort((a, b) => toUTC(a.date) - toUTC(b.date));
  const staffWithFollowUps = data.staff.filter((s) => s.kind === "team");

  const dueLabel = (f: FollowUp) => {
    if (f.done) return { text: "Done", className: "text-success" };
    const d = daysFromToday(f.due);
    if (d < 0) return { text: `Overdue ${-d}d`, className: "text-danger font-semibold" };
    if (d === 0) return { text: "Due today", className: "text-warning font-semibold" };
    return { text: formatShortDate(f.due), className: "text-ink-subtle" };
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={meId} className="text-[12px] font-medium text-ink-muted">
            Viewing as (staff dashboard)
          </label>
          <Select id={meId} value={me} onChange={(e) => setMe(e.target.value)} className="w-64">
            {staffWithFollowUps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.role}
              </option>
            ))}
          </Select>
        </div>
        <p className="pb-2 text-[12px] text-ink-subtle">What {person?.name.split(" ")[0]} sees when they open EVENTOS on {formatMediumDate(DEMO_TODAY)}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" aria-labelledby="fu-title">
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <h2 id="fu-title" className="text-[14px] font-semibold text-ink">
              Client follow-ups
            </h2>
            <span className="text-[12px] text-ink-subtle">{followUps.filter((f) => !f.done).length} open</span>
          </div>
          {followUps.length === 0 ? (
            <EmptyState icon={<CircleDot className="size-4" />} title="No follow-ups" body="Nothing assigned to this person right now." />
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {followUps.map((f) => {
                const event = data.events.find((e) => e.id === f.eventId);
                const Icon = CHANNEL_ICON[f.channel];
                const due = dueLabel(f);
                return (
                  <li key={f.id} className={cn("flex items-start gap-3 px-5 py-3.5", f.done && "bg-mist/50")}>
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-mist text-ink-muted ring-1 ring-line ring-inset">
                      <Icon aria-hidden className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[13px] font-medium", f.done ? "text-ink-subtle line-through" : "text-ink")}>{f.note}</p>
                      {event && (
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-subtle">
                          <button type="button" onClick={() => openEvent(event.id)} className="hover:text-electric-600 hover:underline">
                            {event.client.name} · {event.title}
                          </button>
                          <StatusBadge status={event.status} />
                        </p>
                      )}
                      <p className="mt-1 text-[11.5px] text-ink-subtle">
                        {f.channel} · <span className={due.className}>{due.text}</span>
                      </p>
                    </div>
                    <Btn
                      size="xs"
                      variant={f.done ? "ghost" : "secondary"}
                      onClick={() => {
                        dispatch({ type: "toggleFollowUp", id: f.id });
                        if (!f.done) toast("Follow-up marked done.");
                      }}
                      aria-label={f.done ? `Reopen follow-up: ${f.note}` : `Mark follow-up done: ${f.note}`}
                    >
                      {f.done ? <RotateCcw aria-hidden className="size-3" /> : <Check aria-hidden className="size-3" />}
                      {f.done ? "Reopen" : "Mark done"}
                    </Btn>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card aria-labelledby="my-ev-title">
            <h2 id="my-ev-title" className="px-5 pt-4 pb-2 text-[14px] font-semibold text-ink">
              My upcoming events
            </h2>
            {myEvents.length === 0 ? (
              <p className="px-5 pb-4 text-[12.5px] text-ink-subtle">No upcoming assignments.</p>
            ) : (
              <ul className="px-2 pb-2">
                {myEvents.map((e) => (
                  <li key={e.id}>
                    <button type="button" onClick={() => openEvent(e.id)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-mist">
                      <span className="w-12 shrink-0 font-mono text-[11px] text-ink-subtle">{formatShortDate(e.date)}</span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{e.title}</span>
                      <StatusBadge status={e.status} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card aria-labelledby="my-task-title">
            <h2 id="my-task-title" className="px-5 pt-4 pb-2 text-[14px] font-semibold text-ink">
              My open tasks
            </h2>
            {myTasks.length === 0 ? (
              <p className="px-5 pb-4 text-[12.5px] text-ink-subtle">All clear.</p>
            ) : (
              <ul className="px-2 pb-2">
                {myTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-mist">
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-2">{t.title}</span>
                    <span className={cn("shrink-0 font-mono text-[10.5px]", daysFromToday(t.due) < 0 ? "text-danger" : "text-ink-subtle")}>
                      {formatShortDate(t.due)}
                    </span>
                    <Btn
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        dispatch({ type: "setTaskStatus", taskId: t.id, status: "done" });
                        toast(`“${t.title}” completed.`);
                      }}
                      aria-label={`Mark “${t.title}” done`}
                    >
                      <Check aria-hidden className="size-3" />
                    </Btn>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Add task modal ───────────────────────────── */

function AddTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Add task" description="Tasks appear on the board and in the event's checklist.">
      <AddTaskForm onDone={onClose} />
    </Modal>
  );
}

function AddTaskForm({ onDone }: { onDone: () => void }) {
  const { data, dispatch, toast } = useDemo();
  const uid = useId();
  const [title, setTitle] = useState("");
  const [eventId, setEventId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [due, setDue] = useState(DEMO_TODAY);
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [error, setError] = useState<string | null>(null);
  const events = data.events.filter((e) => e.status !== "cancelled" && e.status !== "completed").sort((a, b) => toUTC(a.date) - toUTC(b.date));

  return (
    <form
      noValidate
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (title.trim().length < 3) {
          setError("Describe the task in at least 3 characters.");
          document.getElementById(`${uid}-title`)?.focus();
          return;
        }
        dispatch({
          type: "addTask",
          task: {
            title: title.trim(),
            eventId: eventId || null,
            assigneeId: assigneeId || null,
            due: /^\d{4}-\d{2}-\d{2}$/.test(due) ? due : DEMO_TODAY,
            priority,
          },
        });
        toast("Task added to the board.");
        onDone();
      }}
    >
      <Field label="Task" htmlFor={`${uid}-title`} error={error ?? undefined} className="sm:col-span-2">
        <TextInput
          id={`${uid}-title`}
          data-autofocus
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error && e.target.value.trim().length >= 3) setError(null);
          }}
          placeholder="e.g. Confirm generator backup with venue"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${uid}-title-error` : undefined}
        />
      </Field>
      <Field label="Event" htmlFor={`${uid}-event`}>
        <Select id={`${uid}-event`} value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full">
          <option value="">General (no event)</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Assignee" htmlFor={`${uid}-assignee`}>
        <Select id={`${uid}-assignee`} value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full">
          <option value="">Unassigned</option>
          {data.staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Due date" htmlFor={`${uid}-due`}>
        <TextInput id={`${uid}-due`} type="date" value={due} min={DEMO_TODAY} onChange={(e) => setDue(e.target.value)} />
      </Field>
      <Field label="Priority" htmlFor={`${uid}-priority`}>
        <Select id={`${uid}-priority`} value={priority} onChange={(e) => setPriority(e.target.value as "normal" | "high")} className="w-full">
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </Select>
      </Field>
      <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
        <Btn onClick={onDone}>Cancel</Btn>
        <Btn type="submit" variant="primary">
          <Plus aria-hidden className="size-3.5" /> Add task
        </Btn>
      </div>
    </form>
  );
}
