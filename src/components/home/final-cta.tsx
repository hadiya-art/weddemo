import { ctas } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="on-dark noise relative isolate overflow-hidden bg-midnight text-white">
      {/* Perspective floor + concentric light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[70%] [perspective:900px]">
          <div className="grid-dark absolute inset-x-[-50%] bottom-[-10%] h-[160%] origin-bottom [transform:rotateX(62deg)] [mask-image:linear-gradient(to_top,black_10%,transparent_70%)]" />
        </div>
        <div className="absolute top-1/2 left-1/2 size-[56rem] -translate-x-1/2 -translate-y-[38%] rounded-full bg-[radial-gradient(closest-side,rgba(56,107,255,0.30),rgba(134,93,255,0.10)_55%,transparent)]" />
        {[22, 34, 46].map((s) => (
          <div
            key={s}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
            style={{ width: `${s}rem`, height: `${s}rem` }}
          />
        ))}
      </div>
      <Container className="relative py-28 text-center sm:py-40">
        <p className="eyebrow text-haze-muted">
          <span className="text-electric-300">08</span>
          <span className="mx-3 inline-block h-px w-6 bg-white/20 align-middle" />
          Next step
        </p>
        <h2
          id="cta-title"
          className="mx-auto mt-6 max-w-3xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-[4.2rem]"
        >
          Your next season deserves a <span className="accent-serif text-gradient pr-1">calmer</span> back office.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-haze-muted">
          Explore the interactive workspace now, or book a guided walkthrough tailored to how your business runs.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={ctas.primary.href} size="lg" arrow>
            {ctas.primary.label}
          </ButtonLink>
          <ButtonLink href={ctas.secondary.href} variant="secondary" size="lg">
            {ctas.secondary.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
