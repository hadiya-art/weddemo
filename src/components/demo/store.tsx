"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEMO_NOW, DEMO_TODAY, GUESTS_MAX, GUESTS_MIN, STATUS_META } from "@/lib/demo/catalog";
import { createSeed } from "@/lib/demo/seed";
import type {
  ActivityItem,
  DemoData,
  DemoEvent,
  DemoNotification,
  EventStatus,
  EventType,
  QuoteConfig,
  Rsvp,
  Task,
  TaskStatus,
  ViewId,
} from "@/lib/demo/types";

export const STORAGE_KEY = "eventos-demo-v1";

/* ───────────────────────────── Reducer ───────────────────────────── */

export type NewEnquiry = {
  clientName: string;
  type: EventType;
  date: string;
  guests: number;
  venue: string;
  city: string;
};

export type NewTask = Omit<Task, "id" | "status"> & { status?: TaskStatus };

export type Action =
  | { type: "hydrate"; data: DemoData | null }
  | { type: "reset" }
  | { type: "setStatus"; eventId: string; status: EventStatus }
  | { type: "addEnquiry"; enquiry: NewEnquiry }
  | { type: "setNotes"; eventId: string; notes: string }
  | { type: "setGuests"; eventId: string; guests: number }
  | { type: "toggleDish"; eventId: string; dishId: string }
  | { type: "clearMenu"; eventId: string }
  | { type: "setQuote"; eventId: string; patch: Partial<Omit<QuoteConfig, "status" | "addOns">> }
  | { type: "toggleAddOn"; eventId: string; addOnId: string }
  | { type: "markQuoteSent"; eventId: string }
  | { type: "assign"; eventId: string; staffId: string }
  | { type: "unassign"; eventId: string; staffId: string }
  | { type: "addTask"; task: NewTask }
  | { type: "setTaskStatus"; taskId: string; status: TaskStatus }
  | { type: "toggleFollowUp"; id: string }
  | { type: "addFeedback"; eventId: string; guest: string; rating: number; comment: string }
  | { type: "setReviewed"; id: string; reviewed: boolean }
  | { type: "setReply"; id: string; reply: string }
  | { type: "markRead"; id: string }
  | { type: "markAllRead" }
  | { type: "setRsvp"; eventId: string; rsvp: Rsvp }
  | { type: "focusEvent"; eventId: string };

interface StoreState {
  data: DemoData;
  hydrated: boolean;
}

function clampGuests(n: number): number {
  if (!Number.isFinite(n)) return GUESTS_MIN;
  return Math.min(GUESTS_MAX, Math.max(GUESTS_MIN, Math.round(n)));
}

function mapEvent(data: DemoData, id: string, fn: (e: DemoEvent) => DemoEvent): DemoEvent[] {
  return data.events.map((e) => (e.id === id ? fn(e) : e));
}

function log(data: DemoData, text: string, kind: ActivityItem["kind"]): Pick<DemoData, "activity" | "seq"> {
  const seq = data.seq + 1;
  return { seq, activity: [{ id: `A-${seq}`, text, at: DEMO_NOW, kind }, ...data.activity].slice(0, 40) };
}

function notify(
  data: DemoData,
  n: Omit<DemoNotification, "id" | "at" | "read">,
): Pick<DemoData, "notifications" | "seq"> {
  const seq = data.seq + 1;
  return { seq, notifications: [{ ...n, id: `N-${seq}`, at: DEMO_NOW, read: false }, ...data.notifications] };
}

function titleOf(data: DemoData, eventId: string | null): string {
  return data.events.find((e) => e.id === eventId)?.title ?? "an event";
}
function staffName(data: DemoData, staffId: string | null): string {
  return data.staff.find((s) => s.id === staffId)?.name ?? "Someone";
}

/** Id the next enquiry will receive — lets the UI open it right after dispatching. */
export function nextEventId(data: DemoData): string {
  let n = 1051 + Math.max(0, data.seq - 100);
  while (data.events.some((e) => e.id === `EV-${n}`)) n += 1;
  return `EV-${n}`;
}

export function dataReducer(data: DemoData, action: Action): DemoData {
  switch (action.type) {
    case "hydrate":
    case "reset":
      return data; // handled by the outer reducer
    case "setStatus": {
      const event = data.events.find((e) => e.id === action.eventId);
      if (!event || event.status === action.status) return data;
      const next = { ...data, events: mapEvent(data, action.eventId, (e) => ({ ...e, status: action.status })) };
      return {
        ...next,
        ...log(next, `${event.title} moved to ${STATUS_META[action.status].label}`, "status"),
      };
    }
    case "addEnquiry": {
      const { enquiry } = action;
      const seq = data.seq + 1;
      const id = nextEventId(data);
      const event: DemoEvent = {
        id,
        title: `${enquiry.clientName} — ${
          { wedding: "Wedding", reception: "Reception", sangeet: "Sangeet", corporate: "Corporate event", birthday: "Birthday" }[
            enquiry.type
          ]
        }`,
        client: { name: enquiry.clientName, phone: "+91 9XXXX X0000", email: "new•••@example.com" },
        hosts: enquiry.clientName,
        type: enquiry.type,
        status: "enquiry",
        date: enquiry.date,
        startTime: "19:00",
        endTime: "23:00",
        venue: enquiry.venue,
        city: enquiry.city || "Pune",
        guests: clampGuests(enquiry.guests),
        staffIds: [],
        menu: [],
        quote: { decorTier: "none", addOns: [], staffCount: Math.max(2, Math.round(enquiry.guests / 20)), discountPct: 0, taxPct: 18, status: "draft" },
        notes: "Created from the New enquiry form in this demo.",
      };
      const next = { ...data, seq, events: [...data.events, event] };
      const withLog = { ...next, ...log(next, `New enquiry added: ${event.title}`, "enquiry") };
      return {
        ...withLog,
        ...notify(withLog, {
          kind: "enquiry",
          title: "New enquiry added",
          body: `${enquiry.clientName} · ${clampGuests(enquiry.guests)} guests`,
          view: "events",
          eventId: id,
        }),
      };
    }
    case "setNotes":
      return { ...data, events: mapEvent(data, action.eventId, (e) => ({ ...e, notes: action.notes })) };
    case "setGuests":
      return {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({ ...e, guests: clampGuests(action.guests) })),
      };
    case "toggleDish": {
      const event = data.events.find((e) => e.id === action.eventId);
      if (!event) return data;
      const has = event.menu.includes(action.dishId);
      return {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({
          ...e,
          menu: has ? e.menu.filter((d) => d !== action.dishId) : [...e.menu, action.dishId],
        })),
      };
    }
    case "clearMenu":
      return { ...data, events: mapEvent(data, action.eventId, (e) => ({ ...e, menu: [] })) };
    case "setQuote":
      return {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({
          ...e,
          quote: { ...e.quote, ...action.patch, status: "draft" },
        })),
      };
    case "toggleAddOn":
      return {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({
          ...e,
          quote: {
            ...e.quote,
            status: "draft",
            addOns: e.quote.addOns.includes(action.addOnId)
              ? e.quote.addOns.filter((a) => a !== action.addOnId)
              : [...e.quote.addOns, action.addOnId],
          },
        })),
      };
    case "markQuoteSent": {
      const next = {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({ ...e, quote: { ...e.quote, status: "sent" as const } })),
      };
      return { ...next, ...log(next, `Quotation marked as sent for ${titleOf(data, action.eventId)}`, "quote") };
    }
    case "assign": {
      const event = data.events.find((e) => e.id === action.eventId);
      if (!event || event.staffIds.includes(action.staffId)) return data;
      const next = {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({ ...e, staffIds: [...e.staffIds, action.staffId] })),
      };
      return { ...next, ...log(next, `${staffName(data, action.staffId)} assigned to ${event.title}`, "team") };
    }
    case "unassign": {
      const event = data.events.find((e) => e.id === action.eventId);
      if (!event) return data;
      const next = {
        ...data,
        events: mapEvent(data, action.eventId, (e) => ({
          ...e,
          staffIds: e.staffIds.filter((s) => s !== action.staffId),
        })),
      };
      return { ...next, ...log(next, `${staffName(data, action.staffId)} removed from ${event.title}`, "team") };
    }
    case "addTask": {
      const seq = data.seq + 1;
      const task: Task = { ...action.task, status: action.task.status ?? "todo", id: `T-${seq}` };
      const next = { ...data, seq, tasks: [task, ...data.tasks] };
      return { ...next, ...log(next, `Task added: “${task.title}”`, "task") };
    }
    case "setTaskStatus": {
      const task = data.tasks.find((t) => t.id === action.taskId);
      if (!task || task.status === action.status) return data;
      const next = {
        ...data,
        tasks: data.tasks.map((t) => (t.id === action.taskId ? { ...t, status: action.status } : t)),
      };
      const label = { todo: "reopened", doing: "started", done: "completed" }[action.status];
      return { ...next, ...log(next, `${staffName(data, task.assigneeId)} ${label} “${task.title}”`, "task") };
    }
    case "toggleFollowUp":
      return {
        ...data,
        followUps: data.followUps.map((f) => (f.id === action.id ? { ...f, done: !f.done } : f)),
      };
    case "addFeedback": {
      const seq = data.seq + 1;
      const entry = {
        id: `FB-${seq}`,
        eventId: action.eventId,
        guest: action.guest,
        rating: action.rating,
        comment: action.comment,
        date: DEMO_TODAY,
        reviewed: false,
        reply: "",
        source: "Customer app" as const,
      };
      const next = { ...data, seq, feedback: [entry, ...data.feedback] };
      const withLog = {
        ...next,
        ...log(next, `${action.guest} left ${action.rating}★ feedback on ${titleOf(data, action.eventId)}`, "feedback"),
      };
      return {
        ...withLog,
        ...notify(withLog, {
          kind: "feedback",
          title: `New ${action.rating}★ feedback`,
          body: `${action.guest} on ${titleOf(data, action.eventId)}`,
          view: "feedback",
        }),
      };
    }
    case "setReviewed":
      return {
        ...data,
        feedback: data.feedback.map((f) => (f.id === action.id ? { ...f, reviewed: action.reviewed } : f)),
      };
    case "setReply":
      return {
        ...data,
        feedback: data.feedback.map((f) => (f.id === action.id ? { ...f, reply: action.reply, reviewed: true } : f)),
      };
    case "markRead":
      return {
        ...data,
        notifications: data.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };
    case "markAllRead":
      return { ...data, notifications: data.notifications.map((n) => ({ ...n, read: true })) };
    case "setRsvp": {
      const next = { ...data, rsvps: { ...data.rsvps, [action.eventId]: action.rsvp } };
      const word = { yes: "accepted", maybe: "marked maybe for", no: "declined" }[action.rsvp.response];
      return { ...next, ...log(next, `A guest ${word} ${titleOf(data, action.eventId)} (party of ${action.rsvp.party})`, "rsvp") };
    }
    case "focusEvent":
      return data.events.some((e) => e.id === action.eventId) ? { ...data, focusEventId: action.eventId } : data;
  }
}

function storeReducer(state: StoreState, action: Action): StoreState {
  if (action.type === "hydrate") {
    return { data: action.data ?? state.data, hydrated: true };
  }
  if (action.type === "reset") return { data: createSeed(), hydrated: true };
  const data = dataReducer(state.data, action);
  return data === state.data ? state : { ...state, data };
}

function isDemoData(value: unknown): value is DemoData {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<DemoData>;
  return (
    v.version === 1 &&
    Array.isArray(v.events) &&
    Array.isArray(v.staff) &&
    Array.isArray(v.tasks) &&
    Array.isArray(v.followUps) &&
    Array.isArray(v.feedback) &&
    Array.isArray(v.notifications) &&
    Array.isArray(v.activity) &&
    typeof v.seq === "number" &&
    typeof v.focusEventId === "string" &&
    typeof v.rsvps === "object"
  );
}

function loadSaved(): DemoData | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isDemoData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/* ───────────────────────────── View routing ───────────────────────────── */

const VIEW_IDS: ViewId[] = ["overview", "calendar", "events", "menu", "quotation", "team", "customer", "feedback"];
const HASH_ALIASES: Record<string, ViewId> = {
  staff: "team",
  tasks: "team",
  manager: "feedback",
  admin: "overview",
  dashboard: "overview",
  bookings: "events",
  quote: "quotation",
  customers: "customer",
  app: "customer",
};

export function viewFromHash(hash: string): ViewId | null {
  const key = hash.replace(/^#/, "").split(/[/?&]/)[0].toLowerCase();
  if ((VIEW_IDS as string[]).includes(key)) return key as ViewId;
  return HASH_ALIASES[key] ?? null;
}

/* ───────────────────────────── Context ───────────────────────────── */

export type ToastTone = "success" | "info" | "warning";
export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface DemoContextValue {
  data: DemoData;
  dispatch: (action: Action) => void;
  ready: boolean;
  view: ViewId;
  navigate: (view: ViewId, opts?: { eventId?: string }) => void;
  drawerEventId: string | null;
  openEvent: (eventId: string) => void;
  closeEvent: () => void;
  enquiryOpen: boolean;
  setEnquiryOpen: (open: boolean) => void;
  toasts: Toast[];
  toast: (message: string, tone?: ToastTone) => void;
  dismissToast: (id: number) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(storeReducer, undefined, () => ({ data: createSeed(), hydrated: false }));
  const [view, setView] = useState<ViewId>("overview");
  const [hashRead, setHashRead] = useState(false);
  const [drawerEventId, setDrawerEventId] = useState<string | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastSeq = useRef(0);

  // Load the visitor's saved sandbox once (server + first client render use the seed).
  useEffect(() => {
    if (store.hydrated) return;
    dispatch({ type: "hydrate", data: loadSaved() });
  }, [store.hydrated]);

  // Persist after hydration.
  useEffect(() => {
    if (!store.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.data));
    } catch {
      /* storage unavailable (private mode / quota) — demo keeps working in memory */
    }
  }, [store.data, store.hydrated]);

  // Hash ⇄ view sync. Runs again whenever Next re-shows this route from <Activity>.
  useEffect(() => {
    const sync = () => {
      const next = viewFromHash(window.location.hash);
      if (next) setView(next);
      setHashRead(true);
    };
    const frame = window.requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  // Transient overlays should not survive the route being hidden by <Activity>.
  useLayoutEffect(() => {
    return () => {
      setDrawerEventId(null);
      setEnquiryOpen(false);
    };
  }, []);

  const navigate = useCallback((next: ViewId, opts?: { eventId?: string }) => {
    setView(next);
    if (opts?.eventId) dispatch({ type: "focusEvent", eventId: opts.eventId });
    try {
      window.history.replaceState(window.history.state, "", `#${next}`);
    } catch {
      /* ignore */
    }
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    toastSeq.current += 1;
    const id = toastSeq.current;
    setToasts((list) => [...list.slice(-2), { id, message, tone }]);
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      data: store.data,
      dispatch,
      ready: store.hydrated && hashRead,
      view,
      navigate,
      drawerEventId,
      openEvent: setDrawerEventId,
      closeEvent: () => setDrawerEventId(null),
      enquiryOpen,
      setEnquiryOpen,
      toasts,
      toast,
      dismissToast,
    }),
    [store.data, store.hydrated, hashRead, view, navigate, drawerEventId, enquiryOpen, toasts, toast, dismissToast],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

export function useEvent(eventId: string | null): DemoEvent | undefined {
  const { data } = useDemo();
  return eventId ? data.events.find((e) => e.id === eventId) : undefined;
}
