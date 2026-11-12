import type { ReactNode } from "react";
import { ctas } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";

/** Closing dark call-to-action band used at the end of inner pages. */
export function CtaBand({
  eyebrow = "Next cue",
  title = (
    <>
      See the workspace with <span className="accent-serif">sample</span> data.
    </>
  ),
  description = "Explore the interactive demo at your own pace, or book a guided walkthrough shaped around how your business runs events.",
  primary = ctas.primary,
  secondary = ctas.secondary,
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="on-dark noise relative isolate overflow-hidden bg-midnight py-24 sm:py-32">
      <div aria-hidden className="grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,black,transparent)]" />
      <div
        aria-hidden
        className="absolute bottom-[-18rem] left-1/2 -z-10 h-[30rem] w-[56rem] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_107_255/0.42),rgb(134_93_255/0.2)_55%,transparent)] blur-[90px]"
      />
      <Container className="relative flex flex-col items-center text-center">
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-3xl text-balance text-[2.3rem] leading-[1.04] font-semibold tracking-[-0.04em] text-white sm:text-[3.3rem]">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-haze-muted sm:text-lg">{description}</p>
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href={primary.href} size="lg" arrow className="w-full sm:w-auto">
            {primary.label}
          </ButtonLink>
          <ButtonLink href={secondary.href} size="lg" variant="secondary" className="w-full sm:w-auto">
            {secondary.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
