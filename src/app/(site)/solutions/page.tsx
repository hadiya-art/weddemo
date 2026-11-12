import type { Metadata } from "next";
import { Info } from "lucide-react";
import { solutionModules } from "@/content/solutions";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { DarkHero, HeroLead, HeroTitle } from "@/components/pages/dark-hero";
import { CtaBand } from "@/components/pages/cta-band";
import { ModuleSwitcher } from "@/components/pages/module-switcher";
import {
  AdminSection,
  CustomerSection,
  ManagerSection,
  StaffSection,
} from "@/components/pages/solutions-sections";

export const metadata: Metadata = {
  title: "Solutions — Four modules, one workspace",
  description:
    "Explore the four illustrative EVENTOS modules: an Admin Dashboard for owners, a Staff Dashboard for coordinators, a Manager App for on-ground leads and a Customer App for hosts and guests.",
};

const [admin, staff, manager, customer] = solutionModules;

const flow = [
  { module: "Staff", cue: "Enquiry captured", body: "A coordinator logs date, guest count and budget, and sets a follow-up." },
  { module: "Admin", cue: "Quotation approved", body: "The owner prices menus and décor, applies a discount and sends the quote." },
  { module: "Manager", cue: "Run-of-show live", body: "On the day, the event lead checks off cues and handles live alerts." },
  { module: "Customer", cue: "Guests welcomed", body: "Hosts share the invitation and menu; guests RSVP and leave feedback at the table." },
];

export default function SolutionsPage() {
  return (
    <>
      <DarkHero>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <Eyebrow tone="dark">Solutions · Four modules</Eyebrow>
            <HeroTitle className="mt-6">
              Four modules. <span className="accent-serif text-gradient pr-1">One</span> workspace.
            </HeroTitle>
            <HeroLead className="mt-6">
              Owners, coordinators, on-ground managers and the clients they serve each get a surface built for their
              job — all reading from the same event record, so nothing is retyped and nobody works from an old
              version.
            </HeroLead>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/demo" size="lg" arrow>
                Explore the demo
              </ButtonLink>
              <ButtonLink href="/book-demo" size="lg" variant="secondary">
                Book a Demo
              </ButtonLink>
            </div>
          </div>

          <ModuleMap />
        </div>
        <p className="mt-14 flex items-start gap-2 text-[0.82rem] text-haze-subtle sm:items-center">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
          Modules described on this page are illustrative concepts, shown with fictional sample data.
        </p>
      </DarkHero>

      <div className="relative">
        {/* Overlay spanning all module sections so the switcher stays sticky only within them */}
        <div className="pointer-events-none absolute inset-0 z-30 pt-6">
          <ModuleSwitcher items={solutionModules.map((m) => ({ id: m.id, index: m.index, label: m.shortName }))} />
        </div>
        <AdminSection m={admin} />
        <StaffSection m={staff} />
        <ManagerSection m={manager} />
        <CustomerSection m={customer} />
      </div>

      <section className="relative bg-white py-24 sm:py-32">
        <div aria-hidden className="hairline absolute inset-x-0 top-0" />
        <Container>
          <SectionHeading
            eyebrow="How they connect"
            index="05"
            title={
              <>
                One booking, <span className="accent-serif">four</span> hand-offs.
              </>
            }
            description="Each module picks up where the last one left off. Here is how a single, fictional wedding booking would travel through the workspace."
          />
          <ol className="mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            {flow.map((f, i) => (
              <li key={f.cue} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-midnight font-mono text-[0.72rem] text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < flow.length - 1 && (
                    <span aria-hidden className="hidden h-px flex-1 bg-gradient-to-r from-ink/20 to-ink/5 md:block" />
                  )}
                </div>
                <p className="eyebrow mt-6 text-electric-600">{f.module}</p>
                <h3 className="mt-2 text-[1.12rem] font-semibold tracking-[-0.02em] text-ink">{f.cue}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{f.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand
        eyebrow="Your cue"
        title={
          <>
            See all four modules <span className="accent-serif">working</span> together.
          </>
        }
      />
    </>
  );
}

/** Hero visual: four module tiles converging into one shared event record. */
function ModuleMap() {
  return (
    <div className="relative">
      <ul className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {solutionModules.map((m) => (
          <li key={m.id}>
            <a
              href={`#${m.id}`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white/[0.035] p-4 ring-1 ring-inset ring-white/10 transition-[background-color,box-shadow] duration-300 hover:bg-white/[0.06] hover:ring-white/20 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-electric-300">{m.index}</span>
                <span className="font-mono text-[0.6rem] tracking-[0.12em] text-haze-subtle uppercase">
                  {m.surface.split(" · ")[0]}
                </span>
              </div>
              <ModuleGlyph id={m.id} />
              <div>
                <p className="text-[0.98rem] font-medium tracking-[-0.02em] text-white">{m.name}</p>
                <p className="mt-1 text-[0.8rem] leading-snug text-haze-subtle">{m.audience}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {/* Convergence lines */}
      <svg aria-hidden viewBox="0 0 400 48" preserveAspectRatio="none" className="h-10 w-full text-white/20">
        <path d="M100 0 C100 30, 200 18, 200 48" fill="none" stroke="currentColor" strokeDasharray="3 4" />
        <path d="M300 0 C300 30, 200 18, 200 48" fill="none" stroke="currentColor" strokeDasharray="3 4" />
      </svg>
      <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-electric/15 via-violet/10 to-electric/15 p-3.5 ring-1 ring-inset ring-white/12 sm:p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10">
          <span className="size-2 animate-pulse-soft rounded-full bg-electric-300 shadow-[0_0_10px_2px_rgb(142_169_255/0.6)]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.62rem] tracking-[0.14em] text-haze-subtle uppercase">Shared event record</p>
          <p className="truncate text-[0.92rem] text-white">Sharma–Iyer Wedding · 22 Nov · 450 guests</p>
        </div>
        <span className="hidden rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-haze-muted uppercase ring-1 ring-inset ring-white/10 sm:inline">
          Sample
        </span>
      </div>
    </div>
  );
}

/** Tiny abstract glyph per module — hints at each surface without mimicking a screenshot. */
function ModuleGlyph({ id }: { id: string }) {
  const common = "my-5 h-12 w-full sm:my-6";
  if (id === "admin")
    return (
      <div aria-hidden className={`${common} flex gap-1.5`}>
        <span className="w-2 rounded-sm bg-white/15" />
        <span className="grid flex-1 grid-cols-3 gap-1">
          <span className="rounded-sm bg-white/10" />
          <span className="rounded-sm bg-electric/40" />
          <span className="rounded-sm bg-white/10" />
          <span className="col-span-3 rounded-sm bg-white/[0.06]" />
        </span>
      </div>
    );
  if (id === "staff")
    return (
      <div aria-hidden className={`${common} flex flex-col justify-center gap-1.5`}>
        {[80, 62, 72].map((w, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-[3px] ${i === 0 ? "bg-electric-300" : "ring-1 ring-white/25"}`} />
            <span className="h-1.5 rounded-full bg-white/15" style={{ width: `${w}%` }} />
          </span>
        ))}
      </div>
    );
  if (id === "manager")
    return (
      <div aria-hidden className={`${common} flex items-center gap-1`}>
        {[1, 1, 1, 0.6, 0.25, 0.25].map((o, i) => (
          <span key={i} className="flex flex-1 items-center gap-1">
            <span className="size-2 shrink-0 rounded-full bg-violet-300" style={{ opacity: o }} />
            {i < 5 && <span className="h-px flex-1 bg-white/20" />}
          </span>
        ))}
      </div>
    );
  return (
    <div aria-hidden className={`${common} flex items-center justify-center`}>
      <span className="font-serif text-[1.6rem] leading-none text-white/80 italic">M &amp; K</span>
    </div>
  );
}
