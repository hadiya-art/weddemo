import { BellRing, Database, HandHeart, Scale } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const benefits = [
  {
    icon: Database,
    title: "One record for every event",
    body: "Client details, menus, décor, vendors, payments and notes live together — so the latest version is the only version.",
  },
  {
    icon: Scale,
    title: "Quotations you can stand behind",
    body: "Prices roll up from real menu items and packages, with discounts, taxes and payment schedules calculated the same way every time.",
  },
  {
    icon: BellRing,
    title: "Teams that know what’s next",
    body: "Assignments, follow-ups and checklists reach the right person, with notifications when something changes.",
  },
  {
    icon: HandHeart,
    title: "Hosts and guests who feel cared for",
    body: "Beautiful invitations, menus and event information — and an easy way to share feedback afterwards.",
  },
];

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="bg-white py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Benefits"
              index="05"
              title={
                <span id="benefits-title">
                  What changes when everything lives in <span className="accent-serif">one place.</span>
                </span>
              }
              description="Less chasing, fewer surprises, and more time for the craft your clients actually book you for."
            />
          </div>
          <ol className="lg:col-span-7">
            {benefits.map((b, i) => (
              <Reveal
                as="li"
                key={b.title}
                delay={i * 0.05}
                className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr_auto] sm:gap-x-8"
              >
                <span className="font-mono text-sm text-ink-subtle tabular-nums sm:pt-1.5">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.4rem]">{b.title}</h3>
                  <p className="mt-2.5 max-w-lg leading-relaxed text-ink-muted">{b.body}</p>
                </div>
                <span
                  aria-hidden
                  className="hidden size-12 items-center justify-center rounded-2xl bg-mist text-ink-2 ring-1 ring-line transition-colors duration-500 group-hover:bg-midnight group-hover:text-white sm:inline-flex"
                >
                  <b.icon className="size-5" strokeWidth={1.6} />
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
