import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPreview, CustomerPreview, ManagerPreview, StaffPreview } from "@/components/previews";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

function ModuleCard({
  index,
  name,
  audience,
  description,
  href,
  preview,
  className,
  tone = "light",
}: {
  index: string;
  name: string;
  audience: string;
  description: string;
  href: string;
  preview: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.75rem] ring-1 transition-shadow duration-500",
        dark
          ? "on-dark bg-midnight text-white ring-white/10 hover:shadow-[0_40px_80px_-40px_rgba(56,107,255,0.55)]"
          : "bg-white text-ink ring-line hover:shadow-[var(--shadow-float)]",
        className,
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-6 p-7 pb-0 sm:p-9 sm:pb-0">
        <div className="max-w-md">
          <p className={cn("eyebrow", dark ? "text-haze-subtle" : "text-ink-subtle")}>
            <span className={dark ? "text-electric-300" : "text-electric-600"}>{index}</span>
            <span className="mx-2 opacity-40">/</span>
            {audience}
          </p>
          <h3 className="mt-3 text-[1.6rem] leading-tight font-semibold tracking-[-0.03em]">
            <Link href={href} className="after:absolute after:inset-0 after:z-10 after:content-['']">
              {name}
            </Link>
          </h3>
          <p className={cn("mt-3 leading-relaxed", dark ? "text-haze-muted" : "text-ink-muted")}>{description}</p>
        </div>
        <span
          aria-hidden
          className={cn(
            "mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-500 group-hover:-rotate-45",
            dark ? "ring-white/15 group-hover:bg-white group-hover:text-ink" : "ring-line group-hover:bg-midnight group-hover:text-white",
          )}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
      <div className="relative mt-8 flex max-h-[25rem] flex-1 items-start justify-center overflow-hidden px-5 [mask-image:linear-gradient(to_bottom,black_78%,transparent)] sm:max-h-[27rem] sm:px-9">
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 h-3/4",
            dark
              ? "bg-[radial-gradient(60%_80%_at_50%_100%,rgba(56,107,255,0.28),transparent)]"
              : "bg-[radial-gradient(60%_80%_at_50%_100%,rgba(56,107,255,0.10),transparent)]",
          )}
        />
        <div className="relative w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-3">
          {preview}
        </div>
      </div>
    </article>
  );
}

export function Modules() {
  return (
    <section aria-labelledby="modules-title" className="bg-mist py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Product modules"
            index="03"
            title={
              <span id="modules-title">
                Four modules. <span className="accent-serif">One</span> connected workspace.
              </span>
            }
            description="Owners, coordinators, on-ground managers and hosts each get an interface shaped to their job — all reading from the same live event record."
          />
          <p className="max-w-xs text-sm leading-relaxed text-ink-subtle lg:text-right">
            Illustrative concept modules. Scope and features would be confirmed during discovery.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ModuleCard
              className="h-full"
              index="01"
              audience="Owners & admins"
              name="Admin Dashboard"
              description="Orders, menus, quotations, billing previews, calendar and vendors — the whole business at a glance."
              href="/solutions#admin"
              preview={<AdminPreview />}
            />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.08}>
            <ModuleCard
              className="h-full"
              tone="dark"
              index="02"
              audience="Coordinators & sales"
              name="Staff Dashboard"
              description="Today’s assignments, client enquiries and follow-ups — nothing slips between shifts."
              href="/solutions#staff"
              preview={<StaffPreview />}
            />
          </Reveal>
          <Reveal className="lg:col-span-5">
            <ModuleCard
              className="h-full"
              tone="dark"
              index="03"
              audience="On-ground leads"
              name="Manager App"
              description="Live event progress, instant notifications and guest feedback, right from the venue floor."
              href="/solutions#manager"
              preview={<ManagerPreview />}
            />
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.08}>
            <ModuleCard
              className="h-full"
              index="04"
              audience="Hosts & guests"
              name="Customer App"
              description="Elegant digital invitations, menus and event information your clients will love sharing."
              href="/solutions#customer"
              preview={<CustomerPreview />}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
