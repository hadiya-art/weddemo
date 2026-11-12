import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/primitives";

/**
 * Dark first-section shell shared by inner pages. Provides the top padding the
 * fixed header needs, the fine engineering grid, soft light and grain.
 */
export function DarkHero({
  children,
  className,
  containerClassName,
  glow = "center",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  glow?: "center" | "left" | "right";
}) {
  return (
    <section className={cn("on-dark noise relative isolate overflow-hidden bg-midnight pt-36 pb-20 text-haze sm:pt-44 sm:pb-28", className)}>
      <div
        aria-hidden
        className="grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className={cn(
          "absolute -top-40 -z-10 h-[34rem] w-[48rem] max-w-[140vw] rounded-full opacity-70 blur-[120px]",
          "bg-[radial-gradient(closest-side,rgb(56_107_255/0.45),rgb(134_93_255/0.18)_60%,transparent)]",
          glow === "center" && "left-1/2 -translate-x-1/2",
          glow === "left" && "-left-40",
          glow === "right" && "-right-40",
        )}
      />
      <div aria-hidden className="hairline-dark absolute inset-x-0 bottom-0" />
      <Container className={cn("relative", containerClassName)}>{children}</Container>
    </section>
  );
}

/** Large page title used inside DarkHero. */
export function HeroTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "text-balance text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-white sm:text-[3.6rem] lg:text-[4.4rem]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function HeroLead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("max-w-xl text-pretty text-[1.08rem] leading-relaxed text-haze-muted sm:text-[1.2rem]", className)}>
      {children}
    </p>
  );
}
