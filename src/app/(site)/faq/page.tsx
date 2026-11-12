import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { faqs, type Faq } from "@/content/faq";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DarkHero, HeroLead, HeroTitle } from "@/components/pages/dark-hero";
import { FaqBrowser } from "@/components/pages/faq-browser";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about the EVENTOS concept: what it is, who it's designed for, how the interactive demo works and what happens when you book a demo.",
};

const categoryOrder: Faq["category"][] = ["Product", "Demo", "Getting started"];

export default function FaqPage() {
  const categories = categoryOrder.filter((c) => faqs.some((f) => f.category === c));

  return (
    <>
      <DarkHero glow="right" className="pb-16 sm:pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <Eyebrow tone="dark">FAQ</Eyebrow>
            <HeroTitle className="mt-6">
              Questions, answered <span className="accent-serif text-gradient pr-1">honestly</span>.
            </HeroTitle>
            <HeroLead className="mt-6">
              What EVENTOS is, what the demo does and doesn&apos;t do, and how a workspace like this would be shaped
              around a real business.
            </HeroLead>
          </div>
          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-white/[0.08] lg:grid-cols-1">
            {categories.map((c, i) => (
              <li key={c} className="flex flex-col gap-1 bg-midnight/90 p-4 lg:flex-row lg:items-center lg:justify-between">
                <span className="font-mono text-[0.66rem] text-electric-300">0{i + 1}</span>
                <span className="text-[0.9rem] text-white lg:mr-auto lg:ml-4">{c}</span>
                <span className="text-[0.8rem] text-haze-subtle tabular-nums">
                  {faqs.filter((f) => f.category === c).length} questions
                </span>
              </li>
            ))}
          </ul>
        </div>
      </DarkHero>

      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <FaqBrowser items={faqs} categories={categories} />
        </Container>
      </section>

      <section className="bg-mist pb-24 sm:pb-32">
        <Container>
          <div className="on-dark noise relative isolate overflow-hidden rounded-[2rem] bg-midnight px-6 py-12 sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="absolute -right-24 -bottom-40 -z-10 h-[26rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(56_107_255/0.4),rgb(134_93_255/0.18)_60%,transparent)] blur-3xl"
            />
            <div aria-hidden className="grid-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <Eyebrow tone="dark">Still have questions?</Eyebrow>
                <h2 className="mt-5 max-w-xl text-balance text-[2rem] leading-[1.06] font-semibold tracking-[-0.035em] text-white sm:text-[2.6rem]">
                  Ask us <span className="accent-serif">anything</span> about the concept.
                </h2>
                <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-haze-muted">
                  Send a note through the contact page, or request a walkthrough tailored to the events your business
                  runs.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <ButtonLink href="/book-demo" size="lg" arrow className="w-full">
                  Book a Demo
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="secondary" className="w-full">
                  Contact the team
                </ButtonLink>
                <Link
                  href="/disclaimer"
                  className="mt-2 inline-flex items-center justify-center gap-1 text-[0.85rem] text-haze-subtle transition-colors hover:text-white"
                >
                  Read the concept disclaimer <ArrowUpRight aria-hidden className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
