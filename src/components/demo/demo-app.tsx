"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronsUpDown,
  ClipboardList,
  LayoutDashboard,
  Menu as MenuIcon,
  MessageSquareHeart,
  Plus,
  ReceiptText,
  RotateCcw,
  Smartphone,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/layout/logo";
import { BUSINESS, CURRENT_USER, DEMO_TODAY, VIEW_LABELS } from "@/lib/demo/catalog";
import { formatLongDate } from "@/lib/demo/dates";
import type { ViewId } from "@/lib/demo/types";
import { DemoProvider, useDemo } from "./store";
import { Btn, Drawer, IconBtn, Modal, PopoverPanel, ToastRegion, useDismiss } from "./ui";
import { GlobalSearch } from "./search";
import { NotificationsMenu } from "./notifications";
import { EventDrawer } from "./event-drawer";
import { NewEnquiryModal } from "./new-enquiry";
import { OverviewView } from "./views/overview";
import { CalendarView } from "./views/calendar";
import { EventsView } from "./views/events";
import { MenuView } from "./views/menu";
import { QuotationView } from "./views/quotation";
import { TeamView } from "./views/team";
import { CustomerView } from "./views/customer";
import { FeedbackView } from "./views/feedback";

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const NAV: { group: string; items: { id: ViewId; icon: IconType }[] }[] = [
  {
    group: "Operations",
    items: [
      { id: "overview", icon: LayoutDashboard },
      { id: "calendar", icon: CalendarDays },
      { id: "events", icon: ClipboardList },
      { id: "team", icon: Users },
    ],
  },
  {
    group: "Sales & catering",
    items: [
      { id: "menu", icon: UtensilsCrossed },
      { id: "quotation", icon: ReceiptText },
    ],
  },
  {
    group: "Guest experience",
    items: [
      { id: "customer", icon: Smartphone },
      { id: "feedback", icon: MessageSquareHeart },
    ],
  },
];

const VIEWS: Record<ViewId, ComponentType> = {
  overview: OverviewView,
  calendar: CalendarView,
  events: EventsView,
  menu: MenuView,
  quotation: QuotationView,
  team: TeamView,
  customer: CustomerView,
  feedback: FeedbackView,
};

export function DemoApp() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}

function Shell() {
  const { view, ready } = useDemo();
  const [mobileNav, setMobileNav] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [view]);

  const View = VIEWS[view];

  return (
    <div className="flex h-dvh flex-col bg-mist text-ink print:block print:h-auto print:bg-white">
      <ConceptBanner />
      <div className="flex min-h-0 flex-1 print:block">
        <aside
          aria-label="Workspace navigation"
          className="on-dark hidden w-[248px] shrink-0 flex-col border-r border-white/[0.06] bg-midnight lg:flex print:hidden"
        >
          <SidebarContent onReset={() => setResetOpen(true)} />
        </aside>

        <Drawer open={mobileNav} onClose={() => setMobileNav(false)} label="Workspace navigation" side="left" widthClass="max-w-[288px]" dark>
          <div className="flex justify-end px-3 pt-3">
            <IconBtn label="Close navigation" tone="dark" onClick={() => setMobileNav(false)}>
              <X aria-hidden className="size-4" />
            </IconBtn>
          </div>
          <SidebarContent
            onNavigate={() => setMobileNav(false)}
            onReset={() => {
              setMobileNav(false);
              setResetOpen(true);
            }}
          />
        </Drawer>

        <div className="flex min-w-0 flex-1 flex-col print:block">
          <Topbar onMenu={() => setMobileNav(true)} />
          <main
            ref={mainRef}
            id="demo-main"
            tabIndex={-1}
            className="scrollbar-thin relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto focus-visible:outline-none print:overflow-visible"
          >
            <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pt-8 print:p-0">
              {ready ? (
                <motion.div
                  key={view}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <View />
                </motion.div>
              ) : (
                <LoadingSkeleton />
              )}
            </div>
          </main>
        </div>
      </div>

      <EventDrawer />
      <NewEnquiryModal />
      <ResetModal open={resetOpen} onClose={() => setResetOpen(false)} />
      <ToastRegion />
    </div>
  );
}

function ConceptBanner() {
  return (
    <div role="region" aria-label="Concept demo notice" className="on-dark relative z-30 flex min-h-9 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#070A16] px-4 py-1.5 text-[12px] text-haze-muted sm:px-5 print:hidden">
      <p className="flex min-w-0 items-center gap-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-violet shadow-[0_0_8px_2px_rgb(134_93_255/0.55)]" />
        <span className="font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap text-haze uppercase">Concept demo</span>
        <span aria-hidden className="text-white/25">·</span>
        <span className="hidden truncate md:inline">
          All clients, events and figures are fictional sample data stored only in this browser.
        </span>
        <span className="truncate md:hidden">Fictional sample data</span>
      </p>
      <nav aria-label="Leave demo" className="flex shrink-0 items-center gap-1">
        <Link
          href="/"
          aria-label="Back to site"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-haze-muted transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft aria-hidden className="size-3.5 sm:hidden" />
          <span className="hidden sm:inline">Back to site</span>
        </Link>
        <Link
          href="/book-demo"
          className="inline-flex items-center gap-1 rounded-md bg-electric-600 px-2.5 py-1 font-medium whitespace-nowrap text-white transition-colors hover:bg-electric"
        >
          Book a Demo
          <ArrowUpRight aria-hidden className="size-3" />
        </Link>
      </nav>
    </div>
  );
}

function SidebarContent({ onNavigate, onReset }: { onNavigate?: () => void; onReset: () => void }) {
  const { view, navigate, data } = useDemo();
  const counts: Partial<Record<ViewId, number>> = {
    events: data.events.filter((e) => e.status === "enquiry").length,
    team: data.followUps.filter((f) => !f.done).length,
    feedback: data.feedback.filter((f) => !f.reviewed).length,
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <WorkspaceSwitcher onReset={onReset} />
      <nav aria-label="Demo views" className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 pt-2 pb-4">
        {NAV.map((group) => (
          <div key={group.group} className="mt-4 first:mt-1">
            <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-haze-subtle uppercase">{group.group}</p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map(({ id, icon: Icon }) => {
                const active = view === id;
                const count = counts[id];
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={active ? "page" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(id);
                        onNavigate?.();
                      }}
                      className={cn(
                        "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors",
                        active ? "bg-white/[0.08] text-white" : "text-haze-muted hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      {active && (
                        <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-electric shadow-[0_0_12px_rgb(56_107_255/0.8)]" />
                      )}
                      <Icon aria-hidden className={cn("size-4 shrink-0", active ? "text-electric-300" : "text-haze-subtle group-hover:text-haze-muted")} />
                      <span className="flex-1 truncate">{VIEW_LABELS[id]}</span>
                      {count ? (
                        <span
                          className={cn(
                            "rounded-md px-1.5 text-[10.5px] leading-[18px] font-semibold tabular-nums",
                            active ? "bg-electric/25 text-white" : "bg-white/[0.07] text-haze-muted",
                          )}
                        >
                          {count}
                          <span className="sr-only"> pending</span>
                        </span>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/[0.06] p-3">
        <div className="rounded-xl bg-white/[0.035] p-3 ring-1 ring-white/[0.06]">
          <p className="font-mono text-[10px] tracking-[0.14em] text-haze-subtle uppercase">Demo date</p>
          <p className="mt-1 text-[13px] font-medium text-white">{formatLongDate(DEMO_TODAY)}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-haze-subtle">Clock is fixed so every visitor sees the same story.</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-white/[0.06] text-[12.5px] font-medium text-haze transition-colors hover:bg-white/[0.1] hover:text-white"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Reset sample data
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSwitcher({ onReset }: { onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismiss(open, [wrapRef], () => setOpen(false));
  return (
    <div ref={wrapRef} className="relative px-3 pt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-white/[0.05]"
      >
        <LogoMark className="size-8" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-white">{BUSINESS.name}</span>
          <span className="block truncate text-[11.5px] text-haze-subtle">EVENTOS workspace · Pro</span>
        </span>
        <ChevronsUpDown aria-hidden className="size-3.5 text-haze-subtle" />
      </button>
      <PopoverPanel open={open} label="Workspace" align="left" className="right-3 left-3 p-1.5">
        <p className="px-2.5 pt-1.5 pb-1 font-mono text-[10px] tracking-[0.14em] text-ink-subtle uppercase">Workspaces</p>
        <div className="flex items-center gap-2.5 rounded-lg bg-mist px-2.5 py-2">
          <LogoMark className="size-6" />
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{BUSINESS.name}</span>
          <Check aria-hidden className="size-4 text-electric-600" />
        </div>
        <p className="px-2.5 py-2 text-[12px] leading-snug text-ink-subtle">
          This concept demo contains one fictional sample workspace.
        </p>
        <div className="my-1 h-px bg-line" />
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onReset();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-ink-2 hover:bg-mist"
        >
          <RotateCcw aria-hidden className="size-3.5 text-ink-subtle" /> Reset sample data
        </button>
        <Link href="/" className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-ink-2 hover:bg-mist">
          <ArrowUpRight aria-hidden className="size-3.5 text-ink-subtle" /> Back to EVENTOS site
        </Link>
      </PopoverPanel>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { view, setEnquiryOpen } = useDemo();
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-white/85 px-3 backdrop-blur-md sm:gap-3 sm:px-5 lg:px-8 print:hidden">
      <IconBtn label="Open navigation" onClick={onMenu} className="lg:hidden">
        <MenuIcon aria-hidden className="size-[18px]" />
      </IconBtn>
      <div className="flex min-w-0 items-center gap-2 text-[13px]">
        <span className="hidden truncate text-ink-subtle md:inline">{BUSINESS.name}</span>
        <span aria-hidden className="hidden text-line-strong md:inline">/</span>
        <span className="truncate font-medium text-ink">{VIEW_LABELS[view]}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <GlobalSearch />
        <Btn variant="primary" size="sm" onClick={() => setEnquiryOpen(true)} className="hidden sm:inline-flex">
          <Plus aria-hidden className="size-3.5" />
          New enquiry
        </Btn>
        <NotificationsMenu />
        <div className="ml-0.5 flex items-center gap-2.5 sm:border-l sm:border-line sm:pl-3">
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-electric to-violet text-[11px] font-semibold text-white shadow-[0_0_0_2px_white,0_0_0_3px_rgb(56_107_255/0.2)]"
          >
            {CURRENT_USER.initials}
          </span>
          <span className="hidden leading-tight xl:block">
            <span className="block text-[12.5px] font-medium text-ink">{CURRENT_USER.name}</span>
            <span className="block text-[11px] text-ink-subtle">{CURRENT_USER.role} · sample user</span>
          </span>
          <span className="sr-only xl:hidden">
            Signed in as {CURRENT_USER.name}, {CURRENT_USER.role} (sample user)
          </span>
        </div>
      </div>
    </header>
  );
}

function ResetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch, toast, navigate, closeEvent } = useDemo();
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Reset sample data?"
      description="Every change you made in this demo — statuses, menus, quotes, tasks, feedback — will be replaced with the original sample data."
      initialFocus={cancelRef}
      footer={
        <>
          <Btn ref={cancelRef} onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              dispatch({ type: "reset" });
              closeEvent();
              onClose();
              navigate("overview");
              toast("Sample data restored. Nothing outside this browser was affected.", "info");
            }}
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Reset demo
          </Btn>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-ink-muted">
        Your sandbox lives only in this browser&apos;s local storage. Resetting clears it — there is no server or real
        database behind this concept.
      </p>
    </Modal>
  );
}

function LoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading demo workspace" className="space-y-6">
      <div className="skeleton h-8 w-56 rounded-lg" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="skeleton h-72 rounded-xl xl:col-span-2" />
        <div className="skeleton h-72 rounded-xl" />
      </div>
    </div>
  );
}
