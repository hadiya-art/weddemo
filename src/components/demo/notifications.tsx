"use client";

import { useRef, useState, type ComponentType } from "react";
import { Bell, CalendarPlus, CheckCheck, IndianRupee, ListChecks, MessageSquareHeart, Settings2, UsersRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/demo/dates";
import type { DemoNotification, NotificationKind } from "@/lib/demo/types";
import { useDemo } from "./store";
import { PopoverPanel, useDismiss } from "./ui";

export const NOTIFICATION_ICON: Record<NotificationKind, { icon: ComponentType<{ className?: string }>; tone: string }> = {
  enquiry: { icon: CalendarPlus, tone: "bg-[#F1ECFF] text-[#5532C9]" },
  payment: { icon: IndianRupee, tone: "bg-success-soft text-[#0B7A50]" },
  task: { icon: ListChecks, tone: "bg-[#EAF0FF] text-electric-600" },
  feedback: { icon: MessageSquareHeart, tone: "bg-[#FCEBF1] text-[#8E1F4A]" },
  rsvp: { icon: UsersRound, tone: "bg-warning-soft text-[#8C5A0E]" },
  system: { icon: Settings2, tone: "bg-ink/[0.05] text-ink-muted" },
};

export function useOpenNotification() {
  const { dispatch, navigate, openEvent } = useDemo();
  return (n: DemoNotification) => {
    dispatch({ type: "markRead", id: n.id });
    navigate(n.view, n.eventId ? { eventId: n.eventId } : undefined);
    if (n.eventId && (n.view === "events" || n.view === "calendar" || n.view === "overview")) openEvent(n.eventId);
  };
}

export function NotificationsMenu() {
  const { data, dispatch } = useDemo();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismiss(open, [wrapRef], () => setOpen(false));
  const openNotification = useOpenNotification();
  const unread = data.notifications.filter((n) => !n.read).length;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative inline-flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink/[0.05] hover:text-ink",
          open && "bg-ink/[0.05] text-ink",
        )}
      >
        <Bell aria-hidden className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9.5px] font-semibold text-white tabular-nums ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>
      <PopoverPanel open={open} label="Notifications" className="fixed top-[6.25rem] right-3 left-3 w-auto overflow-hidden sm:absolute sm:top-[calc(100%+8px)] sm:left-auto sm:w-[380px]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <p className="text-[13.5px] font-semibold text-ink">Notifications</p>
            <p className="text-[11.5px] text-ink-subtle">{unread ? `${unread} unread` : "You're all caught up"}</p>
          </div>
          <button
            type="button"
            disabled={unread === 0}
            onClick={() => dispatch({ type: "markAllRead" })}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-electric-600 hover:bg-electric/[0.06] disabled:text-ink-subtle disabled:hover:bg-transparent"
          >
            <CheckCheck aria-hidden className="size-3.5" />
            Mark all read
          </button>
        </div>
        <ul className="scrollbar-thin max-h-[min(60vh,440px)] overflow-y-auto p-1.5">
          {data.notifications.map((n) => {
            const meta = NOTIFICATION_ICON[n.kind];
            const Icon = meta.icon;
            return (
              <li key={n.id} className="group relative">
                <button
                  type="button"
                  onClick={() => {
                    openNotification(n);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 pr-9 text-left transition-colors hover:bg-mist"
                >
                  <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg", meta.tone)}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[13px] leading-snug", n.read ? "text-ink-2" : "font-semibold text-ink")}>{n.title}</span>
                    <span className="mt-0.5 block truncate text-[12px] text-ink-subtle">{n.body}</span>
                    <span className="mt-1 block font-mono text-[10.5px] text-ink-subtle/90">{relativeTime(n.at)}</span>
                  </span>
                  {!n.read && <span className="sr-only">(unread)</span>}
                </button>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "markRead", id: n.id })}
                    aria-label={`Mark “${n.title}” as read`}
                    title="Mark as read"
                    className="absolute top-3 right-2 flex size-6 items-center justify-center rounded-md hover:bg-ink/[0.06]"
                  >
                    <span aria-hidden className="size-2 rounded-full bg-electric" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </PopoverPanel>
    </div>
  );
}
