import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    cue: "Enquiry",
    title: "Capture every enquiry",
    body: "Calls, walk-ins and messages become a single enquiry with dates, guest count and requirements.",
    module: "Staff Dashboard",
  },
  {
    cue: "Plan & quote",
    title: "Plan the menu and quote",
    body: "Build the menu, choose décor and services, and send a clear quotation with an advance schedule.",
    module: "Admin Dashboard",
  },
  {
    cue: "Assign & run",
    title: "Assign teams and run the day",
    body: "Staff and vendors get their tasks; managers follow a live run-of-show from the venue floor.",
    module: "Manager App",
  },
  {
    cue: "Delight & learn",
    title: "Delight hosts, learn from guests",
    body: "Hosts share invitations and menus; guest feedback flows back to improve the next event.",
    module: "Customer App",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="relative overflow-hidden bg-mist py-24 sm:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          index="06"
          title={
            <span id="how-title">
              From first enquiry to <span className="accent-serif">final applause.</span>
            </span>
          }
          description="One continuous flow — each step hands off cleanly to the next, so nothing is re-typed or lost."
        />

        <ol className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <span
            aria-hidden
            className="absolute top-[1.15rem] right-[12.5%] left-[12.5%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(56,107,255,0.5)_15%,rgba(134,93,255,0.5)_85%,transparent)] lg:block"
          />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.cue} delay={i * 0.08} className="relative lg:px-4">
              <div className="flex items-center gap-3 lg:flex-col lg:gap-0">
                <span className="relative z-10 inline-flex size-9 items-center justify-center rounded-full bg-midnight font-mono text-[0.72rem] text-white shadow-[0_0_0_6px_var(--color-mist)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="eyebrow text-electric-600 lg:mt-5">{s.cue}</span>
              </div>
              <div className="mt-5 rounded-2xl bg-white p-6 ring-1 ring-line lg:min-h-[13.5rem]">
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">{s.body}</p>
                <p className="mt-5 inline-flex rounded-full bg-mist px-2.5 py-1 font-mono text-[0.66rem] tracking-wider text-ink-subtle uppercase ring-1 ring-line">
                  {s.module}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
