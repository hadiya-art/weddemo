import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}>{children}</Tag>;
}

/** Monospace label used above headings — reads like a run-of-show cue. */
export function Eyebrow({
  children,
  index,
  tone = "light",
  className,
}: {
  children: ReactNode;
  index?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "eyebrow inline-flex items-center gap-3",
        tone === "dark" ? "text-haze-muted" : "text-ink-subtle",
        className,
      )}
    >
      {index && (
        <span className={cn(tone === "dark" ? "text-electric-300" : "text-electric-600")}>{index}</span>
      )}
      {index && (
        <span aria-hidden className={cn("h-px w-6", tone === "dark" ? "bg-white/20" : "bg-ink/15")} />
      )}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  tone = "light",
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow index={index} tone={tone} className={cn(align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <Tag
        className={cn(
          "mt-5 text-balance text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3.15rem]",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-5 text-pretty text-[1.05rem] leading-relaxed sm:text-lg",
            tone === "dark" ? "text-haze-muted" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** Visible marker for unconfirmed client information. */
export function PlaceholderTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-dashed border-warning/50 bg-warning-soft px-2 py-0.5 font-mono text-[0.64rem] tracking-wider text-warning uppercase",
        className,
      )}
    >
      To be confirmed
    </span>
  );
}

export function DemoDataTag({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[0.62rem] tracking-wider uppercase",
        tone === "dark"
          ? "bg-white/[0.06] text-haze-muted ring-1 ring-inset ring-white/10"
          : "bg-electric/[0.07] text-electric-600 ring-1 ring-inset ring-electric/15",
        className,
      )}
    >
      <span aria-hidden className="size-1 rounded-full bg-current" />
      Sample data
    </span>
  );
}
