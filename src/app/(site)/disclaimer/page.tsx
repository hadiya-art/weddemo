import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { site } from "@/config/site";
import { Container, Eyebrow, PlaceholderTag } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DarkHero, HeroLead, HeroTitle } from "@/components/pages/dark-hero";

export const metadata: Metadata = {
  title: "Concept Disclaimer",
  description: `${site.name} is a fictional concept brand. What is simulated on this site, what is not claimed, and how content will be replaced after client feedback.`,
};

const toc = [
  { id: "what-it-is", label: "What EVENTOS is" },
  { id: "simulated", label: "What's simulated" },
  { id: "not-claimed", label: "What's not claimed" },
  { id: "placeholders", label: "Placeholders" },
  { id: "next", label: "How content will be replaced" },
];

const simulated = [
  ["Demo data", "Every client, event, dish, price, staff member and message is fictional and stored only in your browser."],
  ["Forms", "Book a Demo and Contact validate your input locally and show a confirmation. Nothing is transmitted or stored."],
  ["Quotations", "Totals use real arithmetic on sample prices and an illustrative tax rate — not real pricing or tax advice."],
  ["Notifications", "Alerts, reminders and live updates are scripted to illustrate how the workspace could behave."],
  ["Guest experiences", "Invitations, digital menus, RSVPs and feedback are illustrative screens with fictional names."],
];

const notClaimed = [
  "Any affiliation with, or endorsement by, an existing company, product or brand.",
  "Real customers, case studies, testimonials, logos or reviews.",
  "Usage figures, performance metrics, ratings or awards.",
  "Pricing, plans, availability dates or service-level commitments.",
  "Integrations, certifications or compliance status.",
];

const steps = [
  ["Client feedback", "Direction, modules and tone are reviewed with the client."],
  ["Confirm identity", "The real business name, logo and brand colours replace the EVENTOS concept brand."],
  ["Replace content", "Copy, contact details and placeholders are swapped for verified information."],
  ["Decide on data", "Any real data, integrations and form routing are defined and built properly."],
  ["Remove concept labels", "Only then is the site's concept mode switched off and the demo notices retired."],
];

export default function DisclaimerPage() {
  return (
    <>
      <DarkHero glow="center" className="pb-16 sm:pb-20">
        <div className="max-w-3xl">
          <Eyebrow tone="dark">Concept Disclaimer</Eyebrow>
          <HeroTitle className="mt-6">
            A concept, <span className="accent-serif text-gradient pr-1">clearly</span> labelled.
          </HeroTitle>
          <HeroLead className="mt-6">{site.conceptNotice}</HeroLead>
        </div>
      </DarkHero>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[14rem_1fr] lg:gap-20">
            <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-ink-subtle">On this page</p>
              <ol className="mt-4 space-y-1 border-l border-ink/[0.09]">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-[0.9rem] text-ink-muted transition-colors hover:border-ink hover:text-ink"
                    >
                      <span aria-hidden className="font-mono text-[0.68rem] text-ink-subtle">
                        0{i + 1}
                      </span>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-3xl space-y-20">
              <Block id="what-it-is" index="01" title="What EVENTOS is">
                <p>
                  {site.name} — “{site.descriptor}” — is a <strong className="font-semibold text-ink">fictional demonstration brand</strong>{" "}
                  created to present a design and product direction to a prospective client. It explores how caterers,
                  decorators, wedding planners and event organisers could run enquiries, bookings, menus, quotations,
                  teams and guest experiences from one workspace.
                </p>
                <p>
                  The name, logo, copy, product modules and sample content on this site are placeholders. They are not a
                  shipped product and are not offered for sale.
                </p>
              </Block>

              <Block id="simulated" index="02" title="What's simulated">
                <dl className="divide-y divide-ink/[0.08] rounded-2xl bg-mist/70 px-5 ring-1 ring-ink/[0.06] sm:px-6">
                  {simulated.map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <dt className="flex items-center gap-2 text-[0.95rem] font-medium text-ink">
                        <Check aria-hidden className="size-4 text-electric-600" />
                        {k}
                      </dt>
                      <dd className="text-[0.95rem] leading-relaxed text-ink-muted">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Block>

              <Block id="not-claimed" index="03" title="What's not claimed">
                <p>Nothing on this site should be read as a claim of:</p>
                <ul className="space-y-3">
                  {notClaimed.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink/[0.05] text-ink-muted">
                        <X aria-hidden className="size-3" />
                      </span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Any resemblance between fictional sample names (people, businesses or venues) and real ones is
                  coincidental.
                </p>
              </Block>

              <Block id="placeholders" index="04" title="Placeholders">
                <p>
                  Details that the client must supply — contact information, company story, team and mission — are
                  marked with a visible tag wherever they appear:
                </p>
                <p className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-warning/40 bg-warning-soft/40 p-4 text-[0.92rem]">
                  <PlaceholderTag /> means the value shown is not real and must be confirmed.
                </p>
              </Block>

              <Block id="next" index="05" title="How content will be replaced">
                <p>After client feedback, the concept would move towards a real site in clear steps:</p>
                <ol className="relative mt-2 space-y-6 border-l border-ink/[0.1] pl-7">
                  {steps.map(([k, v], i) => (
                    <li key={k} className="relative">
                      <span
                        aria-hidden
                        className="absolute top-0 -left-[calc(1.75rem+0.75rem+0.5px)] grid size-6 place-items-center rounded-full bg-midnight font-mono text-[0.62rem] text-white"
                      >
                        {i + 1}
                      </span>
                      <p className="font-medium text-ink">{k}</p>
                      <p className="mt-1">{v}</p>
                    </li>
                  ))}
                </ol>
              </Block>

              <div className="flex flex-col gap-3 border-t border-ink/[0.08] pt-10 sm:flex-row">
                <ButtonLink href="/demo" variant="light" arrow>
                  Explore the demo
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Questions? Contact us
                </ButtonLink>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}

function Block({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <p className="font-mono text-[0.7rem] tracking-[0.14em] text-electric-600">{index}</p>
      <h2 id={`${id}-h`} className="mt-2 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.9rem]">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[1rem] leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}
