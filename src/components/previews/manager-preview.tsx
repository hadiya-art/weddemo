import { Bell, CalendarDays, Check, ClipboardList, House, MessageSquare, Star, Truck, UtensilsCrossed } from "lucide-react";
import { DemoDataTag } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { PhoneFrame } from "./frames";

/* Fictional sample data — illustrative only. */
const timeline = [
  { time: "16:00", label: "Venue handover", state: "done" },
  { time: "17:30", label: "Décor sign-off", state: "done" },
  { time: "19:00", label: "Baraat arrival", state: "live" },
  { time: "20:30", label: "Dinner service", state: "next" },
  { time: "23:00", label: "Pack-down", state: "next" },
] as const;

export function ManagerPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Illustrative Manager App preview on a phone with sample data: today's event run-of-show timeline with progress, live notifications and a guest feedback rating."
      className={cn("w-full", className)}
    >
      <PhoneFrame tone="dark" time="19:04">
        <div className="relative px-4 pb-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-electric/25 blur-3xl"
          />
          {/* Header */}
          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.16em] text-haze-subtle uppercase">Today · Sat 22 Nov</p>
              <p className="mt-0.5 truncate text-[15px] font-semibold tracking-[-0.025em] text-white">
                Sharma–Iyer Wedding
              </p>
            </div>
            <span className="relative mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-white/[0.07] ring-1 ring-white/10">
              <Bell className="size-3.5 text-white" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-violet shadow-[0_0_6px_1px_rgb(134_93_255/0.8)]" />
            </span>
          </div>

          {/* Progress */}
          <div className="relative mt-3 rounded-2xl bg-white/[0.05] p-3 ring-1 ring-white/[0.08]">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] text-haze-muted">Event progress</p>
              <p className="text-[18px] leading-none font-semibold tracking-[-0.03em] text-white tabular-nums">
                64<span className="text-[11px] text-haze-subtle">%</span>
              </p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-electric to-violet" />
            </div>
            <p className="mt-1.5 text-[10px] text-haze-subtle">3 of 5 cues · on schedule</p>
          </div>

          {/* Run of show */}
          <p className="relative mt-3.5 font-mono text-[10px] tracking-[0.16em] text-haze-subtle uppercase">
            Run of show
          </p>
          <ol className="relative mt-2 space-y-0">
            {timeline.map((t, i) => (
              <li key={t.label} className="relative flex gap-2.5 pb-2.5 last:pb-0">
                {i < timeline.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-4 left-[7px] h-full w-px",
                      t.state === "done" ? "bg-electric/60" : "bg-white/10",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative mt-0.5 grid size-[15px] shrink-0 place-items-center rounded-full",
                    t.state === "done" && "bg-electric text-white",
                    t.state === "live" && "bg-midnight ring-2 ring-violet",
                    t.state === "next" && "bg-midnight ring-1 ring-white/20",
                  )}
                >
                  {t.state === "done" && <Check className="size-2.5" strokeWidth={3} />}
                  {t.state === "live" && (
                    <span className="size-1.5 animate-pulse-soft rounded-full bg-violet-300" />
                  )}
                </span>
                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-between gap-2",
                    t.state === "live" && "-my-1 rounded-lg bg-violet/[0.12] px-2 py-1 ring-1 ring-violet/30",
                  )}
                >
                  <p
                    className={cn(
                      "truncate text-[11px]",
                      t.state === "done" ? "text-haze-subtle" : "text-white",
                      t.state === "live" && "font-medium",
                    )}
                  >
                    {t.label}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[10px] tabular-nums",
                      t.state === "live" ? "text-violet-300" : "text-haze-subtle",
                    )}
                  >
                    {t.state === "live" ? "LIVE" : t.time}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          {/* Notifications */}
          <div className="relative mt-3 space-y-1.5">
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] p-2 ring-1 ring-white/[0.08]">
              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-warning/20 text-[#f2c06b]">
                <UtensilsCrossed className="size-3" />
              </span>
              <p className="min-w-0 flex-1 text-[10px] leading-snug text-haze">
                Live counter 2 low on paneer tikka
              </p>
              <span className="shrink-0 text-[10px] text-haze-subtle">now</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2 ring-1 ring-white/[0.06]">
              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-electric/20 text-electric-300">
                <Truck className="size-3" />
              </span>
              <p className="min-w-0 flex-1 text-[10px] leading-snug text-haze-muted">Florist van at Gate B</p>
              <span className="shrink-0 text-[10px] text-haze-subtle">4m</span>
            </div>
          </div>

          {/* Feedback */}
          <div className="relative mt-2 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2.5 ring-1 ring-white/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-haze-muted">Guest feedback</p>
              <span className="flex gap-0.5 text-[#f5c46b]">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className={cn("size-2.5", s < 4 ? "fill-current" : "fill-current opacity-40")} />
                ))}
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-white">“The jalebi counter was the highlight.”</p>
            <p className="mt-0.5 text-[10px] text-haze-subtle">Table 12 · via QR card</p>
          </div>

          <div className="relative mt-2 flex justify-center">
            <DemoDataTag tone="dark" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-around border-t border-white/[0.07] bg-white/[0.02] px-4 pt-2 text-haze-subtle">
          {[House, CalendarDays, ClipboardList, MessageSquare].map((Icon, i) => (
            <span key={i} className={cn("grid size-7 place-items-center rounded-lg", i === 0 && "text-white")}>
              <Icon className="size-3.5" />
            </span>
          ))}
        </div>
      </PhoneFrame>
    </div>
  );
}
