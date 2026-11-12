import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

/** Discreet but always-visible marker that this is a concept demonstration. */
export function ConceptBadge({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  if (!site.isConceptDemo) return null;
  return (
    <Link
      href="/disclaimer"
      title={site.conceptNotice}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase transition-colors",
        tone === "dark"
          ? "bg-white/[0.06] text-haze-muted ring-1 ring-inset ring-white/12 hover:text-white hover:bg-white/10"
          : "bg-ink/[0.04] text-ink-muted ring-1 ring-inset ring-ink/10 hover:text-ink",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-violet shadow-[0_0_8px_2px_rgb(134_93_255/0.6)]" />
      {site.conceptLabel}
    </Link>
  );
}
