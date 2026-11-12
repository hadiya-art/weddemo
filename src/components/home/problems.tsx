import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const cues = [
  {
    time: "07:40",
    title: "Final headcount moves from 380 to 440",
    breaks: "The kitchen is still cooking from Tuesday’s spreadsheet.",
    answer: "Guest count updates menus, quantities and the quote together.",
  },
  {
    time: "10:15",
    title: "The client asks for the revised quotation",
    breaks: "Three versions live in three different inboxes.",
    answer: "One versioned quotation, generated from the live menu.",
  },
  {
    time: "13:30",
    title: "Florist and lighting arrive at the same gate",
    breaks: "Vendor timings are buried in a group chat.",
    answer: "Assignments and arrival slots every lead can see.",
  },
  {
    time: "18:00",
    title: "Sangeet begins — the manager is on four calls",
    breaks: "Nobody has a single view of what’s done and what isn’t.",
    answer: "A live run-of-show with checklists and alerts.",
  },
  {
    time: "23:30",
    title: "Guests leave delighted. Their feedback leaves too.",
    breaks: "Learnings never reach the next event.",
    answer: "Guest feedback captured, reviewed and shared.",
  },
];

export function Problems() {
  return (
    <section aria-labelledby="problems-title" className="relative bg-mist py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="The problem"
              index="01"
              title={
                <span id="problems-title">
                  Flawless on the day. <span className="accent-serif text-ink-muted">Chaotic</span> behind the scenes.
                </span>
              }
              description="Event businesses run on WhatsApp threads, spreadsheets, paper menus and memory. It works — until a busy season stretches every handover to breaking point."
            />
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-mono text-[0.68rem] tracking-wider text-ink-subtle uppercase ring-1 ring-line">
              <span aria-hidden className="size-1.5 rounded-full bg-violet" />
              An illustrative wedding-season Saturday
            </p>
          </div>
        </div>

        <ol className="relative lg:col-span-7" aria-label="Where operations typically break during an event day">
          <span aria-hidden className="absolute top-3 bottom-3 left-[4.02rem] w-px bg-gradient-to-b from-line via-line-strong to-line sm:left-[5.6rem]" />
          {cues.map((c, i) => (
            <Reveal as="li" key={c.time} delay={i * 0.05} className="relative grid grid-cols-[3.4rem_1fr] gap-x-5 pb-6 last:pb-0 sm:grid-cols-[4.6rem_1fr] sm:gap-x-8">
              <div className="pt-5 text-right">
                <span className="font-mono text-[0.8rem] text-ink-subtle tabular-nums">{c.time}</span>
              </div>
              <span
                aria-hidden
                className="absolute top-[1.6rem] left-[3.8rem] size-[0.45rem] rounded-full bg-white ring-[3px] ring-electric/70 sm:left-[5.38rem]"
              />
              <article className="rounded-2xl bg-white p-5 shadow-[var(--shadow-panel)] ring-1 ring-line sm:p-6">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em] text-ink sm:text-lg">{c.title}</h3>
                <dl className="mt-4 grid gap-3 text-[0.93rem] leading-relaxed sm:grid-cols-2 sm:gap-6">
                  <div>
                    <dt className="eyebrow !text-[0.62rem] text-danger">Where it breaks</dt>
                    <dd className="mt-1.5 text-ink-muted">{c.breaks}</dd>
                  </div>
                  <div className="sm:border-l sm:border-line sm:pl-6">
                    <dt className="eyebrow !text-[0.62rem] text-electric-600">With one workspace</dt>
                    <dd className="mt-1.5 text-ink-2">{c.answer}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
