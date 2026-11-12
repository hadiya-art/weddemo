/**
 * Homepage quotation teaser — a deliberately small, pure calculator.
 * Prices and the tax rate are illustrative sample values, not real pricing.
 */

export const MENU_TIERS = [
  { id: "classic", label: "Classic", perPlate: 950 },
  { id: "signature", label: "Signature", perPlate: 1240 },
  { id: "royal", label: "Royal", perPlate: 1650 },
] as const;

export const DECOR_TIERS = [
  { id: "essential", label: "Essential", price: 85000 },
  { id: "signature", label: "Signature", price: 185000 },
  { id: "grand", label: "Grand", price: 340000 },
] as const;

export const STAFF_RATE = 3000;
export const GUESTS_PER_STAFF = 32;
export const MIN_STAFF = 4;
export const TAX_RATE = 0.18;
export const DISCOUNT_RATE = 0.05;
export const ADVANCE_RATE = 0.3;

export type TeaserInput = {
  guests: number;
  perPlate: number;
  decor: number;
  discount: boolean;
};

export type TeaserBreakdown = {
  catering: number;
  decor: number;
  staffCount: number;
  staff: number;
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
  perGuest: number;
  advance: number;
  balance: number;
};

/** Round to whole rupees (half away from zero). */
const rupees = (n: number) => Math.round(n);

export function calculateTeaser({ guests, perPlate, decor, discount }: TeaserInput): TeaserBreakdown {
  const g = Math.max(0, Math.floor(guests));
  const catering = g * perPlate;
  const staffCount = g === 0 ? 0 : Math.max(MIN_STAFF, Math.round(g / GUESTS_PER_STAFF));
  const staff = staffCount * STAFF_RATE;
  const subtotal = catering + decor + staff;
  const discountAmt = discount ? rupees(subtotal * DISCOUNT_RATE) : 0;
  const taxable = subtotal - discountAmt;
  const tax = rupees(taxable * TAX_RATE);
  const total = taxable + tax;
  const advance = rupees(total * ADVANCE_RATE);
  return {
    catering,
    decor,
    staffCount,
    staff,
    subtotal,
    discount: discountAmt,
    taxable,
    tax,
    total,
    perGuest: g ? rupees(total / g) : 0,
    advance,
    balance: total - advance,
  };
}
