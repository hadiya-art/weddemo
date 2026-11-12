"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Layers, ReceiptText, WalletCards } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, DemoDataTag, SectionHeading } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { formatINR, formatNumber } from "@/lib/format";
import { DECOR_TIERS, MENU_TIERS, TAX_RATE, calculateTeaser } from "@/lib/teaser-quote";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; meta: string }[];
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <fieldset>
      <legend id={id} className="eyebrow text-haze-subtle">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-2xl bg-white/[0.04] p-1.5 ring-1 ring-inset ring-white/[0.08]">
        {options.map((o) => {
          const selected = o.id === value;
          return (
            <label
              key={o.id}
              className={cn(
                "relative cursor-pointer rounded-xl px-2 py-2.5 text-center transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-300",
                selected ? "bg-white text-ink shadow-sm" : "text-haze-muted hover:bg-white/[0.05] hover:text-white",
              )}
            >
              <input
                type="radio"
                name={id}
                value={o.id}
                checked={selected}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              <span className="block text-sm font-medium">{o.label}</span>
              <span className={cn("block text-[0.72rem] tabular-nums", selected ? "text-ink-muted" : "text-haze-subtle")}>
                {o.meta}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Line({ label, value, accent }: { label: string; value: string; accent?: "green" }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[0.9rem] text-ink-muted">{label}</dt>
      <dd className={cn("text-[0.95rem] font-medium tabular-nums", accent === "green" ? "text-success" : "text-ink")}>
        {value}
      </dd>
    </div>
  );
}

const features = [
  { icon: Layers, title: "Live menu costing", body: "Per-plate prices roll up from the dishes on the menu." },
  { icon: ReceiptText, title: "One source of truth", body: "Headcount changes flow into catering, staffing and tax." },
  { icon: WalletCards, title: "Advance & balance", body: "Payment schedules are generated with every version." },
];

export function Showcase() {
  const [menu, setMenu] = useState<(typeof MENU_TIERS)[number]["id"]>("signature");
  const [decor, setDecor] = useState<(typeof DECOR_TIERS)[number]["id"]>("signature");
  const [guests, setGuests] = useState(450);
  const [discount, setDiscount] = useState(true);
  const reduce = useReducedMotion();
  const guestsId = useId();

  const m = MENU_TIERS.find((t) => t.id === menu)!;
  const d = DECOR_TIERS.find((t) => t.id === decor)!;
  const q = calculateTeaser({ guests, perPlate: m.perPlate, decor: d.price, discount });

  return (
    <section aria-labelledby="showcase-title" className="on-dark noise relative isolate overflow-hidden bg-midnight py-24 text-white sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,107,255,0.18),transparent)]" />
        <div className="grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
      </div>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            className="lg:col-span-7"
            tone="dark"
            eyebrow="Software preview"
            index="04"
            title={
              <span id="showcase-title">
                Watch a quotation <span className="accent-serif text-electric-300">build itself.</span>
              </span>
            }
            description="Change the menu, the décor or the headcount. Catering, staffing, discount and tax recalculate instantly — the same logic powers the full interactive demo."
          />
          <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:pl-10">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-electric-300 ring-1 ring-inset ring-white/10">
                  <f.icon className="size-4" aria-hidden strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-[0.95rem] font-medium text-white">{f.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-haze-muted">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Product frame */}
        <div className="relative mt-14 rounded-[1.75rem] bg-gradient-to-b from-white/[0.10] to-white/[0.02] p-px shadow-[0_60px_120px_-40px_rgba(56,107,255,0.45)]">
          <div className="overflow-hidden rounded-[calc(1.75rem-1px)] bg-[#0d1325]">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-3.5">
              <div className="flex items-center gap-2" aria-hidden>
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </div>
              <p className="truncate font-mono text-[0.7rem] tracking-wider text-haze-subtle">
                eventos / quotations / <span className="text-haze-muted">rao-iyer-reception</span>
              </p>
              <DemoDataTag tone="dark" className="hidden sm:inline-flex" />
            </div>

            <div className="grid lg:grid-cols-[1fr_1.05fr]">
              {/* Controls */}
              <div className="space-y-8 p-6 sm:p-9">
                <Segmented
                  label="Menu"
                  value={menu}
                  onChange={setMenu}
                  options={MENU_TIERS.map((t) => ({ id: t.id, label: t.label, meta: `${formatINR(t.perPlate)}/plate` }))}
                />
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor={guestsId} className="eyebrow text-haze-subtle">
                      Guests
                    </label>
                    <output htmlFor={guestsId} className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                      {formatNumber(guests)}
                    </output>
                  </div>
                  <input
                    id={guestsId}
                    type="range"
                    min={50}
                    max={1000}
                    step={10}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-electric [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(56,107,255,0.45)]"
                    style={{
                      background: `linear-gradient(90deg, #386bff 0%, #865dff ${((guests - 50) / 950) * 100}%, rgba(255,255,255,0.1) ${((guests - 50) / 950) * 100}%)`,
                    }}
                  />
                  <div className="mt-2 flex justify-between font-mono text-[0.68rem] text-haze-subtle">
                    <span>50</span>
                    <span>1,000</span>
                  </div>
                </div>
                <Segmented
                  label="Décor package"
                  value={decor}
                  onChange={setDecor}
                  options={DECOR_TIERS.map((t) => ({ id: t.id, label: t.label, meta: formatINR(t.price) }))}
                />
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white/[0.04] px-4 py-3.5 ring-1 ring-inset ring-white/[0.08] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric-300">
                  <span>
                    <span className="block text-sm font-medium">Early-booking discount</span>
                    <span className="block text-[0.78rem] text-haze-subtle">5% on the subtotal</span>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={discount}
                    onChange={(e) => setDiscount(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className="relative h-6 w-11 shrink-0 rounded-full bg-white/15 transition-colors peer-checked:bg-electric after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
                  />
                </label>
              </div>

              {/* Quote document */}
              <div className="bg-[radial-gradient(120%_80%_at_50%_0%,rgba(56,107,255,0.14),transparent)] p-4 sm:p-9 lg:border-l lg:border-white/[0.07]">
                <motion.div
                  layout={!reduce}
                  className="rounded-2xl bg-white p-6 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-ink-subtle">Quotation · Q-1048</p>
                      <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">Rao–Iyer Reception</p>
                      <p className="text-sm text-ink-muted">Fictional client · Sample prices</p>
                    </div>
                    <span className="rounded-full bg-warning-soft px-2.5 py-1 text-[0.7rem] font-semibold text-warning">Draft</span>
                  </div>
                  <dl className="mt-6 divide-y divide-line border-y border-line">
                    <Line label={`Catering · ${formatNumber(guests)} × ${formatINR(m.perPlate)}`} value={formatINR(q.catering)} />
                    <Line label={`Décor · ${d.label} package`} value={formatINR(q.decor)} />
                    <Line label={`Service staff · ${q.staffCount}`} value={formatINR(q.staff)} />
                    {discount && <Line label="Discount · 5%" value={`−${formatINR(q.discount)}`} accent="green" />}
                    <Line label={`GST ${Math.round(TAX_RATE * 100)}% · illustrative`} value={formatINR(q.tax)} />
                  </dl>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-ink-muted">Total</p>
                      <p className="text-[0.78rem] text-ink-subtle tabular-nums">≈ {formatINR(q.perGuest)} per guest</p>
                    </div>
                    <p
                      aria-live="polite"
                      className="text-[1.9rem] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[2.2rem]"
                    >
                      {formatINR(q.total)}
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-mist px-3.5 py-2.5">
                      <p className="text-[0.75rem] text-ink-subtle">Advance · 30%</p>
                      <p className="font-medium tabular-nums">{formatINR(q.advance)}</p>
                    </div>
                    <div className="rounded-xl bg-mist px-3.5 py-2.5">
                      <p className="text-[0.75rem] text-ink-subtle">Balance</p>
                      <p className="font-medium tabular-nums">{formatINR(q.balance)}</p>
                    </div>
                  </div>
                </motion.div>
                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[0.8rem] text-haze-subtle">Sample prices and an illustrative tax rate.</p>
                  <ButtonLink href="/demo#quotation" variant="secondary" size="sm" arrow>
                    Open the full quotation builder
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
