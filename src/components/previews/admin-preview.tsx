import {
  Bell,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  Settings,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { DemoDataTag } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { BrowserFrame } from "./frames";

/* Fictional sample data — illustrative only. */
const kpis = [
  { label: "Events this month", value: "18", note: "+3 vs Oct", tone: "up" },
  { label: "Open pipeline", value: "₹24.6L", note: "11 enquiries", tone: "flat" },
  { label: "Quotes awaiting", value: "7", note: "2 expire soon", tone: "warn" },
  { label: "Crew scheduled", value: "42", note: "this weekend", tone: "flat" },
] as const;

const days = [
  { d: "Mon", n: 17, events: 1 },
  { d: "Tue", n: 18, events: 0 },
  { d: "Wed", n: 19, events: 2 },
  { d: "Thu", n: 20, events: 1 },
  { d: "Fri", n: 21, events: 3 },
  { d: "Sat", n: 22, events: 4, active: true },
  { d: "Sun", n: 23, events: 2 },
];

type Status = "Confirmed" | "Quote sent" | "Tasting" | "Deposit due";
const orders: { name: string; meta: string; guests: number; status: Status }[] = [
  { name: "Sharma–Iyer Wedding", meta: "Catering + Décor", guests: 450, status: "Confirmed" },
  { name: "Kapoor Sangeet Night", meta: "Décor · Lighting", guests: 220, status: "Deposit due" },
  { name: "Annual Sales Dinner", meta: "Catering · Bar", guests: 180, status: "Quote sent" },
  { name: "Mehta Mehendi Brunch", meta: "Live counters", guests: 90, status: "Tasting" },
];

const statusStyle: Record<Status, string> = {
  Confirmed: "bg-success-soft text-success",
  "Quote sent": "bg-electric/[0.08] text-electric-600",
  Tasting: "bg-violet/[0.1] text-[#6a42e6]",
  "Deposit due": "bg-warning-soft text-warning",
};

const subtotal = 472_500;
const taxRate = 0.18; // illustrative only
const tax = Math.round(subtotal * taxRate);

export function AdminPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Illustrative Admin Dashboard preview with sample data: monthly KPIs, a week calendar strip, a table of event orders with status labels and a quotation total in rupees."
      className={cn("w-full", className)}
    >
      <BrowserFrame title="Admin · Overview" toolbar={<span className="hidden @sm:flex"><DemoDataTag /></span>}>
        <div className="flex min-h-0 bg-mist/60 text-ink">
          {/* Dark sidebar strip */}
          <aside className="flex w-11 shrink-0 flex-col items-center gap-1.5 bg-midnight py-3 @lg:w-12">
            <span className="mb-2 grid size-6 place-items-center rounded-md bg-gradient-to-br from-electric to-violet text-[10px] font-bold text-white">
              E
            </span>
            {[LayoutDashboard, CalendarDays, ClipboardList, UtensilsCrossed, Receipt, Users].map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  "grid size-7 place-items-center rounded-lg",
                  i === 0 ? "bg-white/[0.1] text-white" : "text-haze-subtle",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.8} />
              </span>
            ))}
            <span className="mt-auto grid size-7 place-items-center text-haze-subtle">
              <Settings className="size-3.5" strokeWidth={1.8} />
            </span>
          </aside>

          <div className="min-w-0 flex-1 p-3 @md:p-4">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.14em] text-ink-subtle uppercase">November · Week 47</p>
                <p className="truncate text-[13px] font-semibold tracking-[-0.02em]">Business overview</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="hidden h-6 items-center gap-1.5 rounded-md bg-white px-2 text-[10px] text-ink-subtle ring-1 ring-line @md:flex">
                  <Search className="size-3" /> Search orders
                </span>
                <span className="relative grid size-6 place-items-center rounded-md bg-white ring-1 ring-line">
                  <Bell className="size-3 text-ink-muted" />
                  <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-electric" />
                </span>
                <span className="flex h-6 items-center gap-1 rounded-md bg-electric-600 px-2 text-[10px] font-medium text-white">
                  <Plus className="size-3" /> <span className="hidden @sm:inline">New order</span>
                </span>
              </div>
            </div>

            {/* KPIs */}
            <div className="mt-3 grid grid-cols-2 gap-2 @lg:grid-cols-4">
              {kpis.map((k) => (
                <div key={k.label} className="rounded-lg bg-white p-2.5 ring-1 ring-line/80">
                  <p className="truncate text-[10px] text-ink-subtle">{k.label}</p>
                  <p className="mt-1 text-[15px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{k.value}</p>
                  <p
                    className={cn(
                      "mt-1.5 truncate text-[10px]",
                      k.tone === "up" ? "text-success" : k.tone === "warn" ? "text-warning" : "text-ink-subtle",
                    )}
                  >
                    {k.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Calendar strip */}
            <div className="mt-2 rounded-lg bg-white p-2 ring-1 ring-line/80">
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => (
                  <div
                    key={day.n}
                    className={cn(
                      "flex flex-col items-center rounded-md py-1.5",
                      day.active ? "bg-midnight text-white" : "text-ink-muted",
                    )}
                  >
                    <span className={cn("text-[10px]", day.active ? "text-haze-muted" : "text-ink-subtle")}>{day.d}</span>
                    <span className="text-[11px] font-semibold tabular-nums">{day.n}</span>
                    <span className="mt-1 flex h-1 gap-0.5">
                      {Array.from({ length: Math.min(day.events, 3) }).map((_, i) => (
                        <span
                          key={i}
                          className={cn("size-1 rounded-full", day.active ? "bg-electric-300" : "bg-electric/50")}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 grid gap-2 @xl:grid-cols-[1.6fr_1fr]">
              {/* Orders table */}
              <div className="rounded-lg bg-white ring-1 ring-line/80">
                <div className="flex items-center justify-between border-b border-line px-2.5 py-2">
                  <p className="text-[11px] font-semibold">Event orders</p>
                  <p className="font-mono text-[10px] tracking-wider text-ink-subtle uppercase">Guests · Status</p>
                </div>
                <ul className="divide-y divide-line/80">
                  {orders.map((o) => (
                    <li key={o.name} className="flex items-center gap-2 px-2.5 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium">{o.name}</p>
                        <p className="truncate text-[10px] text-ink-subtle">{o.meta}</p>
                      </div>
                      <span className="hidden w-8 text-right text-[10px] text-ink-muted tabular-nums @sm:block">
                        {o.guests}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
                          statusStyle[o.status],
                        )}
                      >
                        {o.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quotation */}
              <div className="relative overflow-hidden rounded-lg bg-midnight p-3 text-white">
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 size-28 rounded-full bg-electric/30 blur-2xl"
                />
                <p className="relative font-mono text-[10px] tracking-[0.14em] text-haze-subtle uppercase">
                  Quotation · Q-2041
                </p>
                <p className="relative mt-1 truncate text-[11px] text-haze-muted">Sharma–Iyer Wedding</p>
                <dl className="relative mt-2.5 space-y-1 text-[10px]">
                  <div className="flex justify-between gap-2">
                    <dt className="text-haze-subtle">Subtotal</dt>
                    <dd className="tabular-nums">{formatINR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-haze-subtle">Tax (illustr. 18%)</dt>
                    <dd className="tabular-nums">{formatINR(tax)}</dd>
                  </div>
                </dl>
                <div className="relative mt-2 border-t border-white/10 pt-2">
                  <p className="text-[10px] text-haze-subtle">Total</p>
                  <p className="text-[17px] leading-tight font-semibold tracking-[-0.03em] tabular-nums">
                    {formatINR(subtotal + tax)}
                  </p>
                </div>
                <div className="relative mt-2.5 flex gap-1.5">
                  <span className="flex-1 rounded-md bg-white py-1 text-center text-[10px] font-medium text-ink">Send</span>
                  <span className="flex-1 rounded-md bg-white/[0.08] py-1 text-center text-[10px] text-haze-muted ring-1 ring-white/10">
                    PDF
                  </span>
                </div>
              </div>
            </div>
            <DemoDataTag className="mt-2.5 @sm:hidden" />
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}
