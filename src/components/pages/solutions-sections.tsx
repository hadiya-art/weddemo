import type { ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  CalendarHeart,
  ClipboardList,
  FileText,
  Inbox,
  Info,
  ListChecks,
  MapPin,
  MessageSquare,
  Repeat2,
  Star,
  Store,
  Ticket,
  UserCheck,
  UtensilsCrossed,
  Wallet,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { industryLabels, type IndustryKey, type SolutionModule } from "@/content/solutions";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { AdminPreview, CustomerPreview, ManagerPreview, StaffPreview } from "@/components/previews";
import { cn } from "@/lib/cn";

const icons: Record<SolutionModule["id"], LucideIcon[]> = {
  admin: [ClipboardList, UtensilsCrossed, FileText, Wallet, CalendarDays, Store],
  staff: [ListChecks, Inbox, Bell, MessageSquare, Repeat2],
  manager: [Activity, Bell, Star, UserCheck],
  customer: [Ticket, UtensilsCrossed, MapPin, CalendarHeart],
};

const industryOrder: IndustryKey[] = ["caterer", "decorator", "planner", "organiser"];

function Title({ m, tone, className }: { m: SolutionModule; tone: "light" | "dark"; className?: string }) {
  return (
    <h2
      className={cn(
        "mt-5 text-balance text-[2.1rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[2.6rem] lg:text-[2.9rem]",
        tone === "dark" ? "text-white" : "text-ink",
        className,
      )}
    >
      {m.title[0]}
      <span className="accent-serif">{m.title[1]}</span>
      {m.title[2]}
    </h2>
  );
}

function Meta({ m, tone }: { m: SolutionModule; tone: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <dl
      className={cn(
        "mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl text-sm ring-1",
        dark ? "bg-white/10 ring-white/10" : "bg-ink/[0.08] ring-ink/[0.08]",
      )}
    >
      {[
        ["Built for", m.audience],
        ["Surface", m.surface],
      ].map(([k, v]) => (
        <div key={k} className={cn("p-3.5", dark ? "bg-midnight" : "bg-white")}>
          <dt className={cn("eyebrow text-[0.62rem]", dark ? "text-haze-subtle" : "text-ink-subtle")}>{k}</dt>
          <dd className={cn("mt-1.5 leading-snug", dark ? "text-haze" : "text-ink-2")}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Ctas({ m, tone }: { m: SolutionModule; tone: "light" | "dark" }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <ButtonLink href={m.demoHref} arrow variant={tone === "dark" ? "primary" : "light"}>
        Try it in the demo
      </ButtonLink>
      <ButtonLink href={`/book-demo?module=${m.id}`} variant={tone === "dark" ? "secondary" : "outline"}>
        Book a Demo
      </ButtonLink>
    </div>
  );
}

function IllustrativeNote({ tone, className }: { tone: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[0.8rem] leading-relaxed",
        tone === "dark" ? "text-haze-subtle" : "text-ink-subtle",
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      Illustrative concept. Capabilities show intended direction, not a shipped product.
    </p>
  );
}

/** Industry use-cases rendered as a quiet ledger. */
function UseCaseLedger({ m, tone, hideLabel }: { m: SolutionModule; tone: "light" | "dark"; hideLabel?: boolean }) {
  const dark = tone === "dark";
  return (
    <div>
      {!hideLabel && <p className={cn("eyebrow mb-4", dark ? "text-haze-subtle" : "text-ink-subtle")}>In practice</p>}
      <dl className={cn("border-t", dark ? "border-white/10" : "border-ink/[0.09]")}>
        {industryOrder.map((k) => (
          <div
            key={k}
            className={cn(
              "grid gap-1 border-b py-3.5 sm:grid-cols-[9.5rem_1fr] sm:gap-6",
              dark ? "border-white/10" : "border-ink/[0.09]",
            )}
          >
            <dt className={cn("text-[0.86rem] font-medium", dark ? "text-white" : "text-ink")}>{industryLabels[k]}</dt>
            <dd className={cn("text-[0.93rem] leading-relaxed", dark ? "text-haze-muted" : "text-ink-muted")}>
              {m.useCases[k]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SectionShell({
  m,
  className,
  children,
}: {
  m: SolutionModule;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={m.id} aria-labelledby={`${m.id}-label`} className={cn("relative overflow-x-clip scroll-mt-32 py-24 sm:py-32", className)}>
      {children}
    </section>
  );
}

/* ── 01 Admin — wide split, capabilities as a 3×2 spec grid ───────────────── */

export function AdminSection({ m }: { m: SolutionModule }) {
  const ic = icons.admin;
  return (
    <SectionShell m={m} className="bg-white">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow index={m.index}>
              <span id={`${m.id}-label`}>{m.name}</span>
            </Eyebrow>
            <Title m={m} tone="light" />
            <p className="mt-5 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-ink-muted">{m.job}</p>
            <Meta m={m} tone="light" />
            <Ctas m={m} tone="light" />
          </div>
          <div className="relative">
            <div aria-hidden className="grid-light absolute -inset-6 -z-0 rounded-[2rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <AdminPreview className="relative" />
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-ink/[0.08] ring-1 ring-ink/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {m.capabilities.map((c, i) => {
            const Icon = ic[i];
            return (
              <div key={c.title} className="group bg-white p-6 transition-colors hover:bg-mist/60 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-mist text-ink ring-1 ring-ink/[0.06]">
                    <Icon aria-hidden className="size-4" strokeWidth={1.7} />
                  </span>
                  <span className="font-mono text-[0.68rem] text-ink-subtle">
                    {m.index}.{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-[1.02rem] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
                <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow text-ink-subtle">In practice</p>
            <h3 className="mt-4 max-w-sm text-balance text-[1.5rem] leading-tight font-semibold tracking-[-0.03em] text-ink">
              One dashboard, <span className="accent-serif">four</span> kinds of event business.
            </h3>
            <IllustrativeNote tone="light" className="mt-5 max-w-sm" />
          </div>
          <UseCaseLedger m={m} tone="light" hideLabel />
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── 02 Staff — preview left, numbered list right ───────────────────────── */

export function StaffSection({ m }: { m: SolutionModule }) {
  const ic = icons.staff;
  return (
    <SectionShell m={m} className="bg-mist">
      <div aria-hidden className="hairline absolute inset-x-0 top-0" />
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-40">
              <StaffPreview />
              <IllustrativeNote tone="light" className="mt-6" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow index={m.index}>
              <span id={`${m.id}-label`}>{m.name}</span>
            </Eyebrow>
            <Title m={m} tone="light" />
            <p className="mt-5 text-pretty text-[1.05rem] leading-relaxed text-ink-muted">{m.job}</p>
            <Meta m={m} tone="light" />

            <ol className="mt-10 space-y-1">
              {m.capabilities.map((c, i) => {
                const Icon = ic[i];
                return (
                  <li key={c.title} className="flex gap-4 rounded-xl p-3 transition-colors hover:bg-white">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-electric-600 ring-1 ring-ink/[0.07]">
                      <Icon aria-hidden className="size-4" strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
                      <p className="mt-1 text-[0.93rem] leading-relaxed text-ink-muted">{c.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <Ctas m={m} tone="light" />
            <div className="mt-14">
              <UseCaseLedger m={m} tone="light" />
            </div>
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── 03 Manager — dark tonal break, phone + run-of-show cue list ────────── */

export function ManagerSection({ m }: { m: SolutionModule }) {
  return (
    <SectionShell m={m} className="on-dark noise isolate overflow-clip bg-midnight text-haze">
      <div aria-hidden className="grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,black,transparent)]" />
      <div
        aria-hidden
        className="absolute top-1/3 left-[8%] -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(134_93_255/0.28),transparent)] blur-3xl"
      />
      <Container>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-36">
            <ManagerPreview />
          </div>
          <div>
            <Eyebrow index={m.index} tone="dark">
              <span id={`${m.id}-label`}>{m.name}</span>
            </Eyebrow>
            <Title m={m} tone="dark" />
            <p className="mt-5 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-haze-muted">{m.job}</p>
            <Meta m={m} tone="dark" />

            <ol className="relative mt-12 border-l border-white/10 pl-7">
              {m.capabilities.map((c, i) => (
                <li key={c.title} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[calc(1.75rem+4.5px)] size-2 rounded-full bg-midnight ring-2 ring-electric-300"
                  />
                  <p className="font-mono text-[0.68rem] tracking-[0.14em] text-electric-300 uppercase">
                    Cue {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-[1.08rem] font-semibold tracking-[-0.02em] text-white">{c.title}</h3>
                  <p className="mt-1.5 max-w-lg text-[0.95rem] leading-relaxed text-haze-muted">{c.body}</p>
                </li>
              ))}
            </ol>

            <Ctas m={m} tone="dark" />
            <div className="mt-14">
              <UseCaseLedger m={m} tone="dark" />
            </div>
            <IllustrativeNote tone="dark" className="mt-6" />
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ── 04 Customer — warm editorial, phone on an arch, use-cases as a row ─── */

export function CustomerSection({ m }: { m: SolutionModule }) {
  const ic = icons.customer;
  return (
    <SectionShell m={m} className="bg-[#fbfaf7]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Eyebrow index={m.index}>
              <span id={`${m.id}-label`}>{m.name}</span>
            </Eyebrow>
            <Title m={m} tone="light" />
            <p className="mt-5 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-ink-muted">{m.job}</p>

            <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {m.capabilities.map((c, i) => {
                const Icon = ic[i];
                return (
                  <div key={c.title} className="border-t border-[#e7dfd2] pt-5">
                    <Icon aria-hidden className="size-5 text-[#9b7b4c]" strokeWidth={1.5} />
                    <h3 className="mt-3 text-[1rem] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
                    <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink-muted">{c.body}</p>
                  </div>
                );
              })}
            </div>
            <Ctas m={m} tone="light" />
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute inset-x-4 top-8 bottom-0 rounded-t-full bg-gradient-to-b from-[#efe7da] via-[#f5efe6] to-transparent ring-1 ring-[#e7dfd2]"
            />
            <div aria-hidden className="absolute inset-x-12 top-16 bottom-0 rounded-t-full ring-1 ring-[#e7dfd2]/80" />
            <div className="relative px-6 pt-14 sm:px-10">
              <CustomerPreview />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className="eyebrow text-ink-subtle">In practice</p>
          <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-[#e7dfd2] ring-1 ring-[#e7dfd2] sm:grid-cols-2 lg:grid-cols-4">
            {industryOrder.map((k) => (
              <div key={k} className="bg-[#fbfaf7] p-6">
                <dt className="font-serif text-[1.35rem] leading-none text-ink italic">{industryLabels[k]}</dt>
                <dd className="mt-3 text-[0.93rem] leading-relaxed text-ink-muted">{m.useCases[k]}</dd>
              </div>
            ))}
          </dl>
          <IllustrativeNote tone="light" className="mt-6" />
        </div>
      </Container>
    </SectionShell>
  );
}

