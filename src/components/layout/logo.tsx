import { cn } from "@/lib/cn";
import { site } from "@/config/site";

/**
 * Original EVENTOS mark: three offset layers (the "OS" stack) forming an
 * abstract E. Swap this component when the client's real logo is supplied.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <defs>
        <linearGradient id="eo-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b86ff" />
          <stop offset="1" stopColor="#865dff" />
        </linearGradient>
        <linearGradient id="eo-g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#386bff" />
          <stop offset="1" stopColor="#6f7dff" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#0b1020" />
      <rect x="2.5" y="2.5" width="27" height="27" rx="7.5" fill="none" stroke="white" strokeOpacity="0.12" />
      <rect x="8" y="8" width="16" height="4" rx="2" fill="url(#eo-g1)" />
      <rect x="8" y="14" width="11" height="4" rx="2" fill="url(#eo-g2)" opacity="0.9" />
      <rect x="8" y="20" width="16" height="4" rx="2" fill="#f5f7fb" opacity="0.92" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "text-[0.95rem] font-semibold tracking-[0.14em]",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {site.wordmark}
      </span>
    </span>
  );
}
