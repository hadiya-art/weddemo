import type { Metadata } from "next";
import { CalendarHeart, LayoutDashboard, Receipt, ShieldCheck, Smartphone } from "lucide-react";
import { faqs } from "@/content/faq";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { DarkHero, HeroLead, HeroTitle } from "@/components/pages/dark-hero";
import { BookDemoForm } from "@/components/pages/book-demo-form";
import { FaqAccordion } from "@/components/pages/faq-accordion";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "Request a guided walkthrough of the EVENTOS concept workspace for caterers, decorators, wedding planners and event organisers. This concept form does not send data anywhere.",
};

const walkthrough = [
  { icon: LayoutDashboard, title: "Your event flow, mapped", body: "How an enquiry becomes a booking across the four modules." },
  { icon: Receipt, title: "A quotation, built live", body: "Per-plate menus, add-ons and discounts with sample prices." },
  { icon: Smartphone, title: "The event day, on mobile", body: "The Manager App's run-of-show, alerts and guest feedback." },
  { icon: CalendarHeart, title: "What guests would see", body: "Invitations, digital menus and RSVPs in the Customer App." },
];

const steps = [
  { title: "Share a few details", body: "Tell us about your business and the module you're most curious about." },
  { title: "We shape the session", body: "The walkthrough is tailored to the events you run and the team you have." },
  { title: "Walk through it together", body: "A guided tour of the workspace, with time for your questions." },
];

const bookingFaqIds = ["book", "demo-real", "customise", "pricing"];

export default function BookDemoPage() {
  const bookingFaqs = bookingFaqIds
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is (typeof faqs)[number] => Boolean(f));

  return (
    <>
      <DarkHero glow="left" className="pb-24 sm:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-16 lg:gap-y-0">
          {/* Intro */}
          <div className="lg:col-start-1 lg:row-start-1 lg:pt-4">
            <Eyebrow tone="dark">Book a Demo</Eyebrow>
            <HeroTitle className="mt-6 text-[2.5rem] leading-[1.04] sm:text-[3.3rem] lg:text-[3.6rem]">
              See your events <span className="accent-serif text-gradient pr-1">run</span> on one workspace.
            </HeroTitle>
            <HeroLead className="mt-6">
              A guided walkthrough of the concept, shaped around how your business plans, prices and delivers
              events.
            </HeroLead>
          </div>

          {/* Context */}
          <div className="lg:col-start-1 lg:row-start-2">
            <div className="lg:mt-12">
              <p className="eyebrow text-haze-subtle">What you&apos;ll see</p>
              <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-white/[0.08] sm:grid-cols-2">
                {walkthrough.map((w) => (
                  <li key={w.title} className="bg-midnight/95 p-5">
                    <w.icon aria-hidden className="size-4.5 text-electric-300" strokeWidth={1.7} />
                    <p className="mt-3 text-[0.95rem] font-medium tracking-[-0.01em] text-white">{w.title}</p>
                    <p className="mt-1 text-[0.86rem] leading-relaxed text-haze-muted">{w.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <p className="eyebrow text-haze-subtle">How it works</p>
              <ol className="mt-5 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] text-white ring-1 ring-inset ring-white/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-1">
                      <p className="text-[0.98rem] font-medium text-white">{s.title}</p>
                      <p className="mt-1 text-[0.9rem] leading-relaxed text-haze-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12 flex gap-3 rounded-2xl border border-dashed border-white/15 p-4">
              <ShieldCheck aria-hidden className="mt-0.5 size-4.5 shrink-0 text-violet-300" />
              <p className="text-[0.86rem] leading-relaxed text-haze-muted">
                <span className="font-medium text-white">Honest note:</span> this concept form doesn&apos;t send data
                anywhere. Your details are validated in your browser and never leave this page.
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="relative lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <div
              aria-hidden
              className="absolute -inset-px -z-10 rounded-[1.9rem] bg-gradient-to-b from-electric/50 via-violet/20 to-transparent opacity-60 blur-xl"
            />
            <div className="overflow-hidden rounded-[1.75rem] bg-white text-ink shadow-float ring-1 ring-white/20">
              <div className="flex items-center justify-between gap-4 border-b border-line bg-mist/70 px-6 py-4 sm:px-9">
                <div>
                  <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em]">Request a walkthrough</h2>
                  <p className="mt-0.5 text-[0.82rem] text-ink-subtle">
                    Fields marked <span className="text-electric-600">*</span> are required.
                  </p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-ink-subtle uppercase ring-1 ring-line sm:inline">
                  Simulated
                </span>
              </div>
              <BookDemoForm />
            </div>
          </div>
        </div>
      </DarkHero>

      <section className="bg-mist py-24 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow index="02">Before you book</Eyebrow>
              <h2 className="mt-5 text-balance text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-[2.5rem]">
                Good <span className="accent-serif">questions</span>, answered.
              </h2>
              <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-ink-muted">
                Prefer to look around first? The interactive demo runs entirely on sample data.
              </p>
              <ButtonLink href="/demo" variant="light" arrow className="mt-7">
                Explore the demo
              </ButtonLink>
            </div>
            <FaqAccordion items={bookingFaqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
