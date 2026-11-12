import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { contact } from "@/config/site";
import { Container, Eyebrow, PlaceholderTag } from "@/components/ui/primitives";
import { DarkHero, HeroLead, HeroTitle } from "@/components/pages/dark-hero";
import { ContactForm } from "@/components/pages/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact channels for the EVENTOS concept. Details shown are placeholders until confirmed, and the enquiry form is a simulated flow that sends nothing.",
};

const channelIcons: Record<keyof typeof contact, LucideIcon> = {
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  address: MapPin,
  hours: Clock,
};

export default function ContactPage() {
  const channels = (Object.keys(contact) as (keyof typeof contact)[]).map((key) => ({ key, ...contact[key] }));

  return (
    <>
      <DarkHero glow="right" className="pb-20 sm:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow tone="dark">Contact</Eyebrow>
            <HeroTitle className="mt-6">
              Let&apos;s talk <span className="accent-serif text-gradient pr-1">events</span>.
            </HeroTitle>
            <HeroLead className="mt-6">
              Questions about the concept, a module, or how a workspace like this could fit your business — send a note
              or book a guided walkthrough.
            </HeroLead>
          </div>
          <SignalGraphic />
        </div>
      </DarkHero>

      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Eyebrow index="01">Channels</Eyebrow>
              <h2 className="mt-5 text-[1.9rem] leading-[1.1] font-semibold tracking-[-0.035em] text-ink sm:text-[2.3rem]">
                Where to <span className="accent-serif">reach</span> the team.
              </h2>
              <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-muted">
                These details are placeholders until the client confirms them. Anything marked below is not a real
                address or number.
              </p>

              <ul className="mt-9 divide-y divide-ink/[0.08] overflow-hidden rounded-2xl bg-white ring-1 ring-ink/[0.07]">
                {channels.map((c) => {
                  const Icon = channelIcons[c.key];
                  return (
                    <li key={c.key} className="flex items-start gap-4 p-5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mist text-ink ring-1 ring-ink/[0.06]">
                        <Icon aria-hidden className="size-4" strokeWidth={1.7} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 text-[0.8rem] text-ink-subtle">
                          {c.label}
                          {c.placeholder && <PlaceholderTag />}
                        </p>
                        <p className="mt-1 break-words text-[1rem] font-medium tracking-[-0.01em] text-ink">{c.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/book-demo"
                className="group mt-6 flex items-center justify-between gap-4 rounded-2xl bg-midnight p-5 text-white transition-shadow hover:shadow-glow"
              >
                <span>
                  <span className="block text-[1rem] font-medium">Prefer a guided walkthrough?</span>
                  <span className="mt-0.5 block text-[0.86rem] text-haze-muted">Book a demo shaped around your events.</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </div>

            <div className="lg:pt-2">
              <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-panel ring-1 ring-ink/[0.07]">
                <div className="flex items-center justify-between gap-4 border-b border-line bg-mist/60 px-6 py-4 sm:px-8">
                  <div>
                    <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">General enquiry</h2>
                    <p className="mt-0.5 text-[0.82rem] text-ink-subtle">Name, email and a short message.</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-ink-subtle uppercase ring-1 ring-line">
                    Simulated
                  </span>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Abstract "signal" graphic — concentric rings and conversation nodes, no map. */
function SignalGraphic() {
  const nodes = [
    { label: "Enquiry", x: "12%", y: "22%" },
    { label: "Walkthrough", x: "64%", y: "12%" },
    { label: "Follow-up", x: "70%", y: "72%" },
    { label: "Proposal", x: "8%", y: "70%" },
  ];
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-[22rem]">
      {[100, 76, 52, 28].map((s, i) => (
        <span
          key={s}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
          style={{ width: `${s}%`, height: `${s}%`, borderStyle: i % 2 ? "dashed" : "solid" }}
        />
      ))}
      <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet shadow-[0_0_60px_-6px_rgb(56_107_255/0.7)]">
        <Mail className="size-6 text-white" strokeWidth={1.6} />
      </span>
      {nodes.map((n) => (
        <span
          key={n.label}
          className="absolute flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 font-mono text-[0.66rem] tracking-wider text-haze-muted uppercase ring-1 ring-white/10 backdrop-blur-sm"
          style={{ left: n.x, top: n.y }}
        >
          <span className="size-1.5 rounded-full bg-electric-300" />
          {n.label}
        </span>
      ))}
    </div>
  );
}
