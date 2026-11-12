import type { Metadata } from "next";
import { site } from "@/config/site";
import { Container, Eyebrow, PlaceholderTag, SectionHeading } from "@/components/ui/primitives";
import { DarkHero, HeroLead, HeroTitle } from "@/components/pages/dark-hero";
import { CtaBand } from "@/components/pages/cta-band";

export const metadata: Metadata = {
  title: "About the concept",
  description:
    "Why event businesses need one operating layer, and the design principles behind the EVENTOS concept. Company story and team details are placeholders pending client input.",
};

const scattered: { label: string; side: "left" | "right"; x: string; y: string; r: number }[] = [
  { label: "Chat threads", side: "left", x: "6%", y: "8%", r: -4 },
  { label: "Spreadsheet menus", side: "right", x: "5%", y: "2%", r: 3 },
  { label: "PDF quotations", side: "left", x: "10%", y: "33%", r: 2 },
  { label: "Paper run-sheets", side: "right", x: "4%", y: "27%", r: -3 },
  { label: "Missed calls", side: "left", x: "4%", y: "58%", r: 3 },
  { label: "Printed menus", side: "right", x: "8%", y: "53%", r: -2 },
  { label: "Notebook follow-ups", side: "left", x: "16%", y: "79%", r: 1 },
];

const principles = [
  {
    title: "One record, many views",
    body: "An event is entered once. Owners see margins, coordinators see tasks, managers see cues and guests see an invitation — all drawn from the same source.",
  },
  {
    title: "Designed for the event day",
    body: "The hardest hours happen on the floor, not at a desk. Mobile surfaces should be fast, legible in low light and usable with one hand.",
  },
  {
    title: "Calm by default",
    body: "Fewer dashboards, clearer priorities. The workspace should surface what needs attention today and stay quiet about everything else.",
  },
  {
    title: "Numbers that show their working",
    body: "Quotations explain themselves: plate counts, add-ons, discounts and tax lines are visible, so clients and teams can trust the total.",
  },
  {
    title: "Hospitality-grade guest touchpoints",
    body: "Anything a guest sees — an invitation, a menu, a feedback card — should feel like an extension of the business's own brand.",
  },
];

const placeholders = [
  {
    title: "[Company story — to be provided by client]",
    guidance: "How the business started, the events it is known for, and why it is building (or adopting) this workspace.",
  },
  {
    title: "[Mission statement — to be provided by client]",
    guidance: "One or two sentences on what the business promises its clients and its team.",
  },
  {
    title: "[Team & leadership — to be provided by client]",
    guidance: "Names, roles and photos only once confirmed and approved for publication by each person.",
  },
];

export default function AboutPage() {
  return (
    <>
      <DarkHero glow="left">
        <div className="max-w-4xl">
          <Eyebrow tone="dark">About the concept</Eyebrow>
          <HeroTitle className="mt-6">
            One operating layer for the business of{" "}
            <span className="accent-serif text-gradient pr-1">celebration</span>.
          </HeroTitle>
          <HeroLead className="mt-6 max-w-2xl">
            {site.name} is a concept exploring what software for event businesses could feel like when it is designed
            around how events actually run — from the first enquiry to the last guest leaving.
          </HeroLead>
          <p className="mt-8 flex flex-wrap items-center gap-2 text-[0.85rem] text-haze-subtle">
            <PlaceholderTag />
            This page uses editable placeholder copy. The client&apos;s own story will replace it.
          </p>
        </div>
      </DarkHero>

      {/* 01 — The problem */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                index="01"
                eyebrow="Why one layer"
                title={
                  <>
                    Great events. <span className="accent-serif">Scattered</span> operations.
                  </>
                }
                description="Event businesses run on handovers — sales to kitchen, kitchen to floor, floor to client. When each handover lives in a different chat, sheet or notebook, details slip and teams spend evenings reconciling instead of creating."
              />
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-ink-muted">
                The concept proposes a single operating layer underneath every team: one event record, shared by
                owners, coordinators, on-ground managers and the hosts they serve.
              </p>
            </div>

            <div aria-hidden className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              {/* Before */}
              <div className="relative h-72 overflow-hidden rounded-2xl bg-mist ring-1 ring-ink/[0.06]">
                <p className="absolute top-4 left-4 font-mono text-[0.62rem] tracking-[0.14em] text-ink-subtle uppercase">
                  Today
                </p>
                {scattered.map((s) => (
                  <span
                    key={s.label}
                    className="absolute rounded-lg bg-white px-2.5 py-1.5 text-[0.74rem] whitespace-nowrap text-ink-muted shadow-[0_6px_16px_-10px_rgb(11_16_32/0.4)] ring-1 ring-ink/[0.07]"
                    style={{ [s.side]: s.x, top: `calc(${s.y} + 1.6rem)`, transform: `rotate(${s.r}deg)` }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
              <span className="mx-auto grid size-9 rotate-90 place-items-center rounded-full bg-midnight text-white sm:rotate-0">
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {/* After */}
              <div className="relative flex h-72 flex-col justify-center gap-2.5 overflow-hidden rounded-2xl bg-midnight p-5 ring-1 ring-ink/10">
                <p className="absolute top-4 left-4 font-mono text-[0.62rem] tracking-[0.14em] text-haze-subtle uppercase">
                  One layer
                </p>
                <div className="absolute -top-16 -right-16 size-40 rounded-full bg-electric/30 blur-3xl" />
                {[
                  ["Customer", "from-white/90 to-white/70", "text-midnight"],
                  ["Manager", "from-violet to-violet/70", "text-white"],
                  ["Staff", "from-electric to-electric/70", "text-white"],
                  ["Admin", "from-white/15 to-white/5", "text-white"],
                ].map(([l, g, t], i) => (
                  <span
                    key={l}
                    className={`relative flex h-10 items-center justify-between rounded-xl bg-gradient-to-r px-3.5 text-[0.8rem] font-medium ${g} ${t}`}
                    style={{ marginLeft: `${i * 6}%`, marginRight: `${(3 - i) * 6}%` }}
                  >
                    {l}
                    <span className="font-mono text-[0.6rem] opacity-70">0{4 - i}</span>
                  </span>
                ))}
                <p className="relative mt-1 text-center font-mono text-[0.6rem] tracking-[0.14em] text-haze-subtle uppercase">
                  Shared event record
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 02 — Principles */}
      <section className="relative bg-mist py-24 sm:py-32">
        <div aria-hidden className="hairline absolute inset-x-0 top-0" />
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                index="02"
                eyebrow="Design principles"
                title={
                  <>
                    Five ideas that <span className="accent-serif">shape</span> the concept.
                  </>
                }
                description="These principles guide every screen in the demo. They are a starting point, to be refined with the client's team."
              />
            </div>
            <ol className="border-t border-ink/[0.09]">
              {principles.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-ink/[0.09] py-8 sm:grid-cols-[5rem_1fr] sm:gap-6"
                >
                  <span aria-hidden className="font-serif text-[2.6rem] leading-none text-electric-600 italic sm:text-[3.2rem]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[1.2rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.3rem]">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[1rem] leading-relaxed text-ink-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 03 — Client story placeholders */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <SectionHeading
            index="03"
            eyebrow="The people behind it"
            title={
              <>
                This part of the story is <span className="accent-serif">yours</span> to tell.
              </>
            }
            description="We haven't invented a history, founders or a team. These blocks mark exactly where the client's own, verified details belong."
          />
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {placeholders.map((p, i) => (
              <div
                key={p.title}
                className={`flex flex-col rounded-2xl border border-dashed border-warning/40 bg-warning-soft/30 p-6 sm:p-7 ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <PlaceholderTag className="self-start" />
                <p
                  className={`mt-5 font-medium tracking-[-0.02em] text-ink ${
                    i === 0 ? "text-[1.4rem] sm:text-[1.7rem]" : "text-[1.1rem]"
                  }`}
                >
                  {p.title}
                </p>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-ink-muted">{p.guidance}</p>
                {i === 0 && (
                  <div aria-hidden className="mt-auto space-y-2.5 pt-10">
                    {[100, 92, 96, 60].map((w, j) => (
                      <span key={j} className="block h-2 rounded-full bg-warning/15" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow="See the thinking in practice"
        title={
          <>
            Principles are easier to <span className="accent-serif">feel</span> than read.
          </>
        }
      />
    </>
  );
}
