import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Reusable device frames for the illustrative product previews.
 * Both frames are fluid: they fill their container up to a sensible max width
 * and never rely on fixed pixel widths that could overflow a 320px viewport.
 */

export function BrowserFrame({
  children,
  className,
  title,
  toolbar,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  /** Short label shown in the address pill, e.g. "Admin · Overview". */
  title?: string;
  /** Optional element rendered at the right of the title bar (e.g. a DemoDataTag). */
  toolbar?: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "@container relative w-full overflow-hidden rounded-[1.1rem] shadow-float",
        dark ? "bg-charcoal ring-1 ring-white/10" : "bg-white ring-1 ring-ink/[0.08]",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 items-center gap-3 border-b px-3",
          dark ? "border-white/[0.07] bg-white/[0.03]" : "border-line bg-mist/80",
        )}
      >
        <div aria-hidden className="flex shrink-0 items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", dark ? "bg-white/15" : "bg-ink/[0.12]")} />
          <span className={cn("size-2.5 rounded-full", dark ? "bg-white/15" : "bg-ink/[0.12]")} />
          <span className={cn("size-2.5 rounded-full", dark ? "bg-white/15" : "bg-ink/[0.12]")} />
        </div>
        {title && (
          <div className="flex min-w-0 flex-1 justify-center">
            <span
              className={cn(
                "flex h-5.5 max-w-[16rem] min-w-0 items-center gap-1.5 truncate rounded-md px-2.5 font-mono text-[10px] tracking-wide",
                dark ? "bg-white/[0.05] text-haze-subtle" : "bg-white text-ink-subtle ring-1 ring-ink/[0.06]",
              )}
            >
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-success/80" />
              <span className="truncate">{title}</span>
            </span>
          </div>
        )}
        <div className="flex shrink-0 items-center">{toolbar}</div>
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
  tone = "dark",
  time = "9:41",
}: {
  children: ReactNode;
  className?: string;
  /** Screen tone — controls the status bar colours. */
  tone?: "light" | "dark";
  time?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("relative mx-auto w-full max-w-[19rem]", className)}>
      {/* Hardware buttons */}
      <span aria-hidden className="absolute top-24 -left-[3px] h-8 w-[3px] rounded-l bg-[#1b2133]" />
      <span aria-hidden className="absolute top-36 -left-[3px] h-12 w-[3px] rounded-l bg-[#1b2133]" />
      <span aria-hidden className="absolute top-32 -right-[3px] h-16 w-[3px] rounded-r bg-[#1b2133]" />
      <div className="rounded-[2.9rem] bg-[#0a0d18] p-[7px] shadow-float ring-1 ring-white/10">
        <div
          className={cn(
            "relative overflow-hidden rounded-[2.45rem]",
            dark ? "bg-midnight text-haze" : "bg-[#fbfaf7] text-ink",
          )}
        >
          {/* Status bar + island */}
          <div
            aria-hidden
            className={cn(
              "relative z-10 flex h-11 items-center justify-between px-7 text-[11px] font-semibold",
              dark ? "text-white" : "text-ink",
            )}
          >
            <span className="tabular-nums">{time}</span>
            <span className="absolute top-2.5 left-1/2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <SignalGlyph />
              <BatteryGlyph />
            </span>
          </div>
          {children}
          {/* Home indicator */}
          <div aria-hidden className="flex h-6 items-center justify-center">
            <span className={cn("h-1 w-24 rounded-full", dark ? "bg-white/40" : "bg-ink/25")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalGlyph() {
  return (
    <svg viewBox="0 0 16 10" className="h-2.5 w-4" fill="currentColor">
      <rect x="0" y="6" width="3" height="4" rx="0.8" />
      <rect x="4.3" y="4" width="3" height="6" rx="0.8" />
      <rect x="8.6" y="2" width="3" height="8" rx="0.8" />
      <rect x="12.9" y="0" width="3" height="10" rx="0.8" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 26 12" className="h-3 w-6" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
      <rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}
