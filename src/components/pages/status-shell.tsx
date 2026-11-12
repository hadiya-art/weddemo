import type { ReactNode } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "@/components/layout/logo";

/**
 * Minimal dark full-screen layout for 404 / error states that render outside
 * the (site) layout (no header or footer available there).
 */
export function StatusShell({
  code,
  eyebrow,
  title,
  description,
  actions,
  visual,
}: {
  code: string;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <div className="on-dark noise relative isolate flex min-h-dvh flex-col overflow-hidden bg-midnight text-haze">
      <div aria-hidden className="grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div
        aria-hidden
        className="absolute top-[-14rem] left-1/2 -z-10 h-[32rem] w-[52rem] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_107_255/0.4),rgb(134_93_255/0.16)_60%,transparent)] blur-[100px]"
      />
      <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 pt-6 sm:px-8">
        <Link href="/" aria-label={`${site.name} home`} className="rounded-lg">
          <Logo />
        </Link>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.12em] text-haze-muted uppercase ring-1 ring-inset ring-white/12">
          {site.conceptLabel}
        </span>
      </header>

      <main id="main" className="mx-auto flex w-full max-w-[1240px] flex-1 items-center px-5 py-16 sm:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-3 text-haze-muted">
              <span className="text-electric-300">{code}</span>
              <span aria-hidden className="h-px w-6 bg-white/20" />
              {eyebrow}
            </p>
            <h1 className="mt-6 text-balance text-[2.6rem] leading-[1.03] font-semibold tracking-[-0.04em] text-white sm:text-[3.6rem]">
              {title}
            </h1>
            <div className="mt-5 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-haze-muted sm:text-[1.12rem]">
              {description}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
          </div>
          {visual}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1240px] px-5 pb-8 text-[0.78rem] text-haze-subtle sm:px-8">
        {site.conceptNotice}
      </footer>
    </div>
  );
}

/** "Lost the venue": a tiny floor plan whose guest path wanders off the grid. */
export function LostVenueVisual() {
  const tables = [
    [22, 24], [50, 24], [78, 24],
    [22, 52], [50, 52], [78, 52],
    [36, 78], [64, 78],
  ];
  return (
    <div aria-hidden className="relative mx-auto aspect-[5/4] w-full max-w-[30rem]">
      <div className="absolute inset-0 rounded-[2rem] bg-white/[0.03] ring-1 ring-inset ring-white/10" />
      <div className="absolute inset-4 rounded-[1.5rem] border border-dashed border-white/10" />
      {/* stage */}
      <div className="absolute top-[7%] left-1/2 h-[6%] w-[40%] -translate-x-1/2 rounded-full bg-gradient-to-r from-electric/40 to-violet/40 ring-1 ring-white/15" />
      <span className="absolute top-[14.5%] left-1/2 -translate-x-1/2 font-mono text-[0.58rem] tracking-[0.2em] text-haze-subtle uppercase">
        Stage
      </span>
      {/* wandering path */}
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none">
        <path
          d="M8 76 C 20 70, 30 70, 36 62 S 44 44, 56 46 S 70 58, 86 40 S 98 14, 108 6"
          stroke="url(#lost-g)"
          strokeWidth="0.6"
          strokeDasharray="1.6 1.6"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 1.5 }}
        />
        <defs>
          <linearGradient id="lost-g" x1="0" x2="1">
            <stop offset="0" stopColor="#8ea9ff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#b9a2ff" />
          </linearGradient>
        </defs>
      </svg>
      {/* tables */}
      {tables.map(([x, y], i) => (
        <span
          key={i}
          className="absolute grid size-[11%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-midnight ring-1 ring-white/15"
          style={{ left: `${x}%`, top: `${y + 8}%` }}
        >
          <span className="font-mono text-[0.55rem] text-haze-subtle">{String(i + 1).padStart(2, "0")}</span>
        </span>
      ))}
      {/* you are here */}
      <span className="absolute bottom-[3%] left-[6%] flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-electric-300 shadow-[0_0_12px_3px_rgb(142_169_255/0.6)]" />
        <span className="font-mono text-[0.58rem] tracking-[0.14em] text-haze-muted uppercase">You</span>
      </span>
      {/* the missing venue marker */}
      <span className="absolute -top-3 -right-2 flex items-center gap-2 rounded-full bg-violet/20 px-3 py-1.5 ring-1 ring-violet/40 backdrop-blur-sm">
        <span className="size-1.5 animate-pulse-soft rounded-full bg-violet-300" />
        <span className="font-mono text-[0.62rem] tracking-[0.14em] text-violet-300 uppercase">Venue ?</span>
      </span>
    </div>
  );
}
