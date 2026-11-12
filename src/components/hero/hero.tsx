import { ctas } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { HeroIntro } from "./hero-intro";
import { HeroStage } from "./hero-stage";

const audiences = ["Caterers", "Decorators", "Wedding planners", "Event organisers"];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark noise relative isolate overflow-hidden bg-midnight text-white"
    >
      {/* Cinematic lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[30%] right-[-10%] h-[85%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(56,107,255,0.28),transparent)] blur-2xl" />
        <div className="absolute bottom-[-35%] left-[-15%] h-[80%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(134,93,255,0.16),transparent)] blur-2xl" />
        <div className="grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-midnight" />
      </div>

      <Container className="relative">
        <div className="grid min-h-[min(100svh,980px)] items-center gap-6 pt-32 pb-10 lg:grid-cols-12 lg:pt-32 lg:pb-24">
          <HeroIntro className="relative z-10 lg:col-span-6">
            <p className="eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] py-1.5 pr-3.5 pl-3 text-haze-muted ring-1 ring-inset ring-white/10">
              <span aria-hidden className="size-1.5 rounded-full bg-electric shadow-[0_0_10px_2px_rgba(56,107,255,0.7)]" />
              Event Business OS
            </p>
            <h1
              id="hero-title"
              className="mt-7 text-[2.65rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
            >
              <span className="block">Run Every Event.</span>
              <span className="text-gradient block pb-1">
                From One <span className="accent-serif pr-1 text-[1.08em] font-normal">Smarter</span> Workspace.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-pretty text-haze-muted sm:text-lg">
              Enquiries, bookings, menus, quotations, teams and guest experience — connected in one calm
              workspace, so every celebration you deliver runs as smoothly as it looks.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={ctas.secondary.href} size="lg" arrow>
                {ctas.secondary.label}
              </ButtonLink>
              <ButtonLink href={ctas.primary.href} variant="secondary" size="lg">
                {ctas.primary.label}
              </ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="eyebrow text-haze-subtle">Designed for</span>
              <ul className="flex flex-wrap gap-2 text-[0.82rem] text-haze-muted">
                {audiences.map((a) => (
                  <li key={a} className="rounded-full bg-white/[0.03] px-3 py-1 ring-1 ring-inset ring-white/[0.08]">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </HeroIntro>

          {/* Mobile / tablet stage (in flow) */}
          <HeroStage className="relative -mx-5 aspect-[1.25/1] sm:mx-0 sm:aspect-[1.6/1] lg:hidden" />
        </div>
      </Container>

      {/* Desktop stage — bleeds off the right edge behind the copy column */}
      <HeroStage className="absolute top-[9%] right-[-6%] bottom-[2%] left-[calc(50%-40px)] hidden lg:block 2xl:right-[calc(50%-820px)] 2xl:left-[calc(50%-20px)]" />
    </section>
  );
}
