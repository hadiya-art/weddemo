"use client";

import { useId } from "react";
import { Check, Info, Pencil, Printer, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR, formatINRPrecise } from "@/lib/format";
import {
  ADD_ONS,
  ADVANCE_PCT,
  BUSINESS,
  DECOR_TIERS,
  DEMO_TODAY,
  EVENT_TYPE_META,
  GUESTS_MAX,
  GUESTS_MIN,
  SERVICE_STAFF_RATE,
} from "@/lib/demo/catalog";
import { addDays, formatLongDate, formatMediumDate, formatTime } from "@/lib/demo/dates";
import { menuDishes, perPlate, quoteForEvent } from "@/lib/demo/derive";
import { DISCOUNT_MAX, type QuoteLine } from "@/lib/demo/quote";
import { useDemo } from "../store";
import { Btn, Card, Pill, Stepper, Switch, ViewHeader, inputClass } from "../ui";
import { EventPicker, useFocusEvent } from "./menu";

function unitLabel(line: QuoteLine): string {
  switch (line.unit) {
    case "plate":
      return `${line.quantity.toLocaleString("en-IN")} plates`;
    case "guest":
      return `${line.quantity.toLocaleString("en-IN")} guests`;
    case "staff":
      return `${line.quantity} staff`;
    default:
      return "1";
  }
}

export function QuotationView() {
  const { dispatch, toast, navigate } = useDemo();
  const event = useFocusEvent();
  const q = quoteForEvent(event);
  const dishes = menuDishes(event);
  const discountId = useId();
  const discountNumId = useId();
  const taxId = useId();
  const quoteNo = `Q-2026-${event.id.replace("EV-", "")}`;
  const sent = event.quote.status === "sent";

  const setQuote = (patch: Parameters<typeof dispatch>[0] extends infer A ? (A extends { type: "setQuote"; patch: infer P } ? P : never) : never) =>
    dispatch({ type: "setQuote", eventId: event.id, patch });

  return (
    <div>
      <div className="print:hidden">
        <ViewHeader
          title="Quotation"
          description="Built live from the event's menu and guest count. Adjust décor, add-ons, staffing and discount — every figure recalculates with paisa-accurate maths."
          actions={
            <>
              <Btn onClick={() => window.print()}>
                <Printer aria-hidden className="size-3.5" /> Print / Save as PDF
              </Btn>
              <Btn
                variant={sent ? "secondary" : "primary"}
                disabled={sent}
                onClick={() => {
                  dispatch({ type: "markQuoteSent", eventId: event.id });
                  toast("Marked as sent in this demo — nothing was emailed.");
                }}
              >
                {sent ? <Check aria-hidden className="size-3.5" /> : <Send aria-hidden className="size-3.5" />}
                {sent ? "Marked as sent" : "Mark as sent"}
              </Btn>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)] print:block">
        {/* Controls */}
        <Card as="div" className="self-start print:hidden">
          <div className="border-b border-line p-4">
            <EventPicker label="Quotation for event" />
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium text-ink-muted">Guests</span>
              <Stepper
                label="Guest count"
                value={event.guests}
                min={GUESTS_MIN}
                max={GUESTS_MAX}
                step={10}
                onChange={(n) => dispatch({ type: "setGuests", eventId: event.id, guests: n })}
              />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-mist px-3 py-2.5 text-[12.5px] ring-1 ring-line/70 ring-inset">
              <span className="text-ink-muted">
                Menu · {dishes.length} dishes · <span className="font-medium text-ink tabular-nums">{formatINR(perPlate(event))}</span>/plate
              </span>
              <button type="button" onClick={() => navigate("menu")} className="inline-flex items-center gap-1 font-medium text-electric-600 hover:underline">
                <Pencil aria-hidden className="size-3" /> Edit
              </button>
            </div>
          </div>

          <fieldset className="border-b border-line p-4">
            <legend className="float-left mb-2.5 w-full text-[12px] font-medium text-ink-muted">Décor package</legend>
            <div className="clear-both grid grid-cols-2 gap-2">
              {DECOR_TIERS.map((t) => {
                const active = event.quote.decorTier === t.id;
                return (
                  <label
                    key={t.id}
                    className={cn(
                      "relative cursor-pointer rounded-lg border p-2.5 transition-[border-color,box-shadow,background-color] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-electric",
                      active ? "border-electric bg-electric/[0.04] shadow-[0_0_0_1px_var(--color-electric)]" : "border-line hover:border-line-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="decor-tier"
                      value={t.id}
                      checked={active}
                      onChange={() => setQuote({ decorTier: t.id })}
                      className="sr-only"
                    />
                    <span className="block text-[12.5px] font-semibold text-ink">{t.label}</span>
                    <span className="block text-[12px] text-ink-muted tabular-nums">{t.price ? formatINR(t.price) : "—"}</span>
                    <span className="mt-1 block text-[11px] leading-snug text-ink-subtle">{t.description}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="border-b border-line p-4">
            <legend className="float-left mb-3 w-full text-[12px] font-medium text-ink-muted">Add-on services</legend>
            <div className="clear-both flex flex-col gap-3">
              {ADD_ONS.map((a) => (
                <Switch
                  key={a.id}
                  id={`addon-${a.id}`}
                  checked={event.quote.addOns.includes(a.id)}
                  onChange={() => dispatch({ type: "toggleAddOn", eventId: event.id, addOnId: a.id })}
                  label={a.label}
                  description={`${formatINR(a.rate)} ${a.pricing === "perGuest" ? "per guest" : "flat"} · ${a.description}`}
                />
              ))}
            </div>
          </fieldset>

          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-[12px] font-medium text-ink-muted">Service staff</span>
                <span className="block text-[11.5px] text-ink-subtle">{formatINR(SERVICE_STAFF_RATE)} per person</span>
              </span>
              <Stepper
                label="Service staff count"
                value={event.quote.staffCount}
                min={0}
                max={200}
                onChange={(n) => setQuote({ staffCount: n })}
              />
            </div>
          </div>

          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between">
              <label htmlFor={discountId} className="text-[12px] font-medium text-ink-muted">
                Discount
              </label>
              <span className="flex items-center gap-1">
                <label htmlFor={discountNumId} className="sr-only">
                  Discount percentage
                </label>
                <input
                  id={discountNumId}
                  type="number"
                  min={0}
                  max={DISCOUNT_MAX}
                  step={0.5}
                  value={event.quote.discountPct}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setQuote({ discountPct: Number.isFinite(n) ? Math.min(DISCOUNT_MAX, Math.max(0, n)) : 0 });
                  }}
                  className={cn(inputClass, "h-8 w-16 px-2 text-right tabular-nums")}
                />
                <span className="text-[12.5px] text-ink-muted">%</span>
              </span>
            </div>
            <input
              id={discountId}
              type="range"
              min={0}
              max={DISCOUNT_MAX}
              step={0.5}
              value={event.quote.discountPct}
              onChange={(e) => setQuote({ discountPct: Number(e.target.value) })}
              aria-valuetext={`${event.quote.discountPct}% discount`}
              className="mt-3 w-full cursor-pointer accent-[#2F5EF0]"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-subtle" aria-hidden>
              <span>0%</span>
              <span>{DISCOUNT_MAX}% max</span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor={taxId} className="text-[12px] font-medium text-ink-muted">
                GST rate
              </label>
              <span className="flex items-center gap-1">
                <input
                  id={taxId}
                  type="number"
                  min={0}
                  max={28}
                  step={0.5}
                  value={event.quote.taxPct}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setQuote({ taxPct: Number.isFinite(n) ? Math.min(28, Math.max(0, n)) : 0 });
                  }}
                  aria-describedby={`${taxId}-note`}
                  className={cn(inputClass, "h-8 w-16 px-2 text-right tabular-nums")}
                />
                <span className="text-[12.5px] text-ink-muted">%</span>
              </span>
            </div>
            <p id={`${taxId}-note`} className="mt-2 flex items-start gap-1.5 rounded-md bg-warning-soft px-2.5 py-2 text-[11.5px] leading-snug text-[#7A4D0C]">
              <Info aria-hidden className="mt-px size-3.5 shrink-0" />
              Illustrative tax rate — configurable. Confirm the applicable GST treatment with a tax professional.
            </p>
          </div>
        </Card>

        {/* Document preview */}
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between px-1 print:hidden">
            <p className="font-mono text-[10.5px] tracking-[0.14em] text-ink-subtle uppercase">Document preview</p>
            <Pill className={sent ? "bg-success-soft text-[#0B7A50]" : undefined}>{sent ? "Sent" : "Draft"}</Pill>
          </div>
          <article
            id="quote-document"
            aria-label={`Quotation ${quoteNo}`}
            className="relative overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgb(11_16_32/0.04),0_24px_48px_-28px_rgb(11_16_32/0.25)] print:rounded-none print:border-0 print:shadow-none"
          >
            <div aria-hidden className="h-1.5 bg-gradient-to-r from-[#E08A1E] via-[#D6457A] to-violet" />
            <div className="p-5 sm:p-8 lg:p-10">
              <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FDF1E1] font-serif text-[20px] text-[#8A4B05] italic">
                    S&amp;S
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.015em] text-ink">{BUSINESS.name}</p>
                    <p className="text-[12px] text-ink-subtle">{BUSINESS.tagline}</p>
                    <p className="mt-1 text-[11.5px] text-ink-subtle">{BUSINESS.address}</p>
                    <p className="text-[11.5px] text-ink-subtle">{BUSINESS.gstin}</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="accent-serif text-[30px] leading-none text-ink">Quotation</p>
                  <dl className="mt-3 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-[12px] sm:justify-end">
                    <dt className="text-ink-subtle">Quote no.</dt>
                    <dd className="font-mono text-ink">{quoteNo}</dd>
                    <dt className="text-ink-subtle">Issued</dt>
                    <dd className="text-ink tabular-nums">{formatMediumDate(DEMO_TODAY)}</dd>
                    <dt className="text-ink-subtle">Valid until</dt>
                    <dd className="text-ink tabular-nums">{formatMediumDate(addDays(DEMO_TODAY, 15))}</dd>
                  </dl>
                </div>
              </header>

              <div className="mt-8 grid grid-cols-1 gap-6 rounded-lg bg-mist/70 p-4 sm:grid-cols-2 print:bg-transparent print:p-0">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-ink-subtle uppercase">Prepared for</p>
                  <p className="mt-1.5 text-[13.5px] font-semibold text-ink">{event.client.name}</p>
                  <p className="font-mono text-[11.5px] text-ink-subtle">{event.client.phone}</p>
                  <p className="font-mono text-[11.5px] text-ink-subtle">{event.client.email}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-ink-subtle uppercase">Event</p>
                  <p className="mt-1.5 text-[13.5px] font-semibold text-ink">{event.title}</p>
                  <p className="text-[12px] text-ink-muted">
                    {EVENT_TYPE_META[event.type].label} · {formatLongDate(event.date)} · {formatTime(event.startTime)}
                  </p>
                  <p className="text-[12px] text-ink-muted">
                    {event.venue}, {event.city} · {event.guests.toLocaleString("en-IN")} guests
                  </p>
                </div>
              </div>

              <div className="scrollbar-thin mt-8 overflow-x-auto">
                <table className="w-full border-collapse text-[13px] sm:min-w-[520px]">
                  <caption className="sr-only">Quotation line items</caption>
                  <thead>
                    <tr className="border-b border-ink/80 text-left text-[10.5px] tracking-[0.1em] text-ink-subtle uppercase">
                      <th scope="col" className="pb-2 font-medium">Description</th>
                      <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">Qty</th>
                      <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">Rate</th>
                      <th scope="col" className="pb-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.lines.map((line) => (
                      <tr key={line.id} className="border-b border-line align-top">
                        <td className="py-3 pr-4">
                          <span className="font-medium text-ink">{line.label}</span>
                          <span className="mt-0.5 block text-[12px] text-ink-muted tabular-nums sm:hidden">
                            {unitLabel(line)} × {formatINRPrecise(line.unitPrice)}
                          </span>
                          {line.id === "catering" && (
                            <span className="mt-1 block max-w-md text-[11.5px] leading-relaxed text-ink-subtle">
                              {dishes.length ? dishes.map((d) => d.name).join(" · ") : "Menu to be finalised"}
                            </span>
                          )}
                        </td>
                        <td className="hidden py-3 text-right whitespace-nowrap text-ink-muted tabular-nums sm:table-cell">{unitLabel(line)}</td>
                        <td className="hidden py-3 pl-4 text-right whitespace-nowrap text-ink-muted tabular-nums sm:table-cell">{formatINRPrecise(line.unitPrice)}</td>
                        <td className="py-3 pl-4 text-right whitespace-nowrap font-medium text-ink tabular-nums">{formatINRPrecise(line.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="order-2 max-w-xs text-[11.5px] leading-relaxed text-ink-subtle sm:order-1">
                  <p className="font-medium text-ink-muted">Payment schedule</p>
                  <p className="mt-1">
                    {ADVANCE_PCT}% advance on confirmation · balance due 7 days before the event. Prices hold until the validity date.
                  </p>
                </div>
                <dl className="order-1 w-full space-y-2 text-[13px] sm:order-2 sm:w-80">
                  <Row label="Subtotal" value={formatINRPrecise(q.subtotal)} />
                  <Row label={`Discount (${q.discountPct}%)`} value={q.discount ? `− ${formatINRPrecise(q.discount)}` : formatINRPrecise(0)} />
                  <Row label="Taxable value" value={formatINRPrecise(q.taxable)} />
                  <Row label={`GST @ ${q.taxPct}% (illustrative)`} value={formatINRPrecise(q.tax)} />
                  <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
                    <dt className="text-[13px] font-semibold text-ink">Grand total</dt>
                    <dd className="text-[22px] font-semibold tracking-[-0.025em] text-ink tabular-nums" aria-live="polite">
                      {formatINRPrecise(q.total)}
                    </dd>
                  </div>
                  <Row label="Effective cost per guest" value={formatINRPrecise(q.perGuest)} muted />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-electric/[0.06] px-3 py-2.5 ring-1 ring-electric/15 ring-inset">
                      <dt className="text-[11px] text-electric-600">Advance ({q.advancePct}%)</dt>
                      <dd className="mt-0.5 text-[14px] font-semibold text-ink tabular-nums">{formatINRPrecise(q.advance)}</dd>
                    </div>
                    <div className="rounded-lg bg-mist px-3 py-2.5 ring-1 ring-line ring-inset">
                      <dt className="text-[11px] text-ink-subtle">Balance ({100 - q.advancePct}%)</dt>
                      <dd className="mt-0.5 text-[14px] font-semibold text-ink tabular-nums">{formatINRPrecise(q.balance)}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <footer className="mt-10 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-subtle">
                Sample quotation generated in the EVENTOS concept demo for a fictional business. Not a tax invoice; tax rate shown
                is illustrative and configurable.
              </footer>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={cn(muted ? "text-ink-subtle" : "text-ink-muted")}>{label}</dt>
      <dd className={cn("tabular-nums", muted ? "text-ink-muted" : "font-medium text-ink")}>{value}</dd>
    </div>
  );
}
