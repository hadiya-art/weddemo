/**
 * Pure quotation engine for the EVENTOS concept demo.
 *
 * All money is converted to integer paise at the boundary, every intermediate
 * value is an integer number of paise, and results are converted back to
 * rupees (2 decimals) on the way out. Percentages are converted to integer
 * basis points so that multiplication never accumulates float error; each
 * percentage application rounds half-up to the nearest paisa.
 *
 * This module is intentionally dependency-free (no path aliases, no TS-only
 * runtime syntax) so it can be tested with `node --experimental-strip-types`.
 */

export type AddOnPricing = "flat" | "perGuest";

export interface QuoteAddOnInput {
  id: string;
  label: string;
  pricing: AddOnPricing;
  /** Rupees. Flat amount, or amount per guest. */
  rate: number;
}

export interface QuoteInput {
  /** Catering price per plate, in rupees. */
  perPlate: number;
  guests: number;
  /** Décor package price, in rupees (0 for none). */
  decorPrice: number;
  decorLabel?: string;
  addOns: QuoteAddOnInput[];
  staffCount: number;
  /** Rupees per service staff member for the event. */
  staffRate: number;
  /** Discount percentage, clamped to 0–25. */
  discountPct: number;
  /** Illustrative tax rate percentage, clamped to 0–100. */
  taxPct: number;
  /** Advance percentage, clamped to 0–100. Defaults to 30. */
  advancePct?: number;
}

export interface QuoteLine {
  id: string;
  label: string;
  /** Human-readable working, e.g. "₹420 × 250 guests". Formatting left to UI. */
  quantity: number;
  unitPrice: number;
  unit: "plate" | "package" | "event" | "guest" | "staff";
  amount: number;
}

export interface QuoteBreakdown {
  lines: QuoteLine[];
  subtotal: number;
  discountPct: number;
  discount: number;
  taxable: number;
  taxPct: number;
  tax: number;
  total: number;
  perGuest: number;
  advancePct: number;
  advance: number;
  balance: number;
}

export const DISCOUNT_MAX = 25;
export const DEFAULT_ADVANCE_PCT = 30;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rupees → integer paise (half-up for positive values). Negative inputs → 0. */
export function toPaise(rupees: number): number {
  const safe = Math.max(0, finiteOr(rupees, 0));
  // toPrecision(15) strips binary noise such as 1.005 * 100 = 100.49999999999999.
  return Math.round(Number.parseFloat((safe * 100).toPrecision(15)));
}

/** Integer paise → rupees with at most 2 decimals. */
export function fromPaise(paise: number): number {
  return paise / 100;
}

/** Percentage → integer basis points (18 → 1800, 12.5 → 1250). */
function toBasisPoints(pct: number): number {
  return Math.round(pct * 100);
}

/** Apply basis points to an integer paise amount, rounding half-up. */
function applyBasisPoints(paise: number, bps: number): number {
  // Both operands are integers, so the product is exact for any realistic quote.
  return Math.round((paise * bps) / 10_000);
}

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const guests = Math.max(0, Math.floor(finiteOr(input.guests, 0)));
  const staffCount = Math.max(0, Math.floor(finiteOr(input.staffCount, 0)));
  const discountPct = clamp(finiteOr(input.discountPct, 0), 0, DISCOUNT_MAX);
  const taxPct = clamp(finiteOr(input.taxPct, 0), 0, 100);
  const advancePct = clamp(finiteOr(input.advancePct ?? DEFAULT_ADVANCE_PCT, DEFAULT_ADVANCE_PCT), 0, 100);

  const linesPaise: Array<Omit<QuoteLine, "amount" | "unitPrice"> & { unitPaise: number; amountPaise: number }> = [];

  const perPlatePaise = toPaise(input.perPlate);
  linesPaise.push({
    id: "catering",
    label: "Catering",
    quantity: guests,
    unit: "plate",
    unitPaise: perPlatePaise,
    amountPaise: perPlatePaise * guests,
  });

  const decorPaise = toPaise(input.decorPrice);
  if (decorPaise > 0) {
    linesPaise.push({
      id: "decor",
      label: input.decorLabel ? `Décor — ${input.decorLabel}` : "Décor package",
      quantity: 1,
      unit: "package",
      unitPaise: decorPaise,
      amountPaise: decorPaise,
    });
  }

  for (const addOn of input.addOns) {
    const ratePaise = toPaise(addOn.rate);
    const perGuest = addOn.pricing === "perGuest";
    linesPaise.push({
      id: `addon-${addOn.id}`,
      label: addOn.label,
      quantity: perGuest ? guests : 1,
      unit: perGuest ? "guest" : "event",
      unitPaise: ratePaise,
      amountPaise: perGuest ? ratePaise * guests : ratePaise,
    });
  }

  const staffRatePaise = toPaise(input.staffRate);
  if (staffCount > 0) {
    linesPaise.push({
      id: "staff",
      label: "Service staff",
      quantity: staffCount,
      unit: "staff",
      unitPaise: staffRatePaise,
      amountPaise: staffRatePaise * staffCount,
    });
  }

  const subtotalPaise = linesPaise.reduce((sum, line) => sum + line.amountPaise, 0);
  const discountPaise = applyBasisPoints(subtotalPaise, toBasisPoints(discountPct));
  const taxablePaise = subtotalPaise - discountPaise;
  const taxPaise = applyBasisPoints(taxablePaise, toBasisPoints(taxPct));
  const totalPaise = taxablePaise + taxPaise;
  const perGuestPaise = guests > 0 ? Math.round(totalPaise / guests) : 0;
  const advancePaise = applyBasisPoints(totalPaise, toBasisPoints(advancePct));
  const balancePaise = totalPaise - advancePaise;

  return {
    lines: linesPaise.map(({ unitPaise, amountPaise, ...rest }) => ({
      ...rest,
      unitPrice: fromPaise(unitPaise),
      amount: fromPaise(amountPaise),
    })),
    subtotal: fromPaise(subtotalPaise),
    discountPct,
    discount: fromPaise(discountPaise),
    taxable: fromPaise(taxablePaise),
    taxPct,
    tax: fromPaise(taxPaise),
    total: fromPaise(totalPaise),
    perGuest: fromPaise(perGuestPaise),
    advancePct,
    advance: fromPaise(advancePaise),
    balance: fromPaise(balancePaise),
  };
}
