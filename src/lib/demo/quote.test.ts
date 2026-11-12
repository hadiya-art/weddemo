import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateQuote, toPaise, type QuoteInput } from "./quote.ts";

const base: QuoteInput = {
  perPlate: 420,
  guests: 250,
  decorPrice: 85000,
  decorLabel: "Essential",
  addOns: [
    { id: "valet", label: "Valet parking", pricing: "flat", rate: 18000 },
    { id: "crockery", label: "Premium crockery", pricing: "perGuest", rate: 45 },
  ],
  staffCount: 12,
  staffRate: 1200,
  discountPct: 10,
  taxPct: 18,
};

test("full quote: line items, discount, tax, totals and advance split", () => {
  const q = calculateQuote(base);
  assert.deepEqual(
    q.lines.map((l) => [l.id, l.quantity, l.unitPrice, l.amount]),
    [
      ["catering", 250, 420, 105000],
      ["decor", 1, 85000, 85000],
      ["addon-valet", 1, 18000, 18000],
      ["addon-crockery", 250, 45, 11250],
      ["staff", 12, 1200, 14400],
    ],
  );
  assert.equal(q.subtotal, 233650);
  assert.equal(q.discount, 23365);
  assert.equal(q.taxable, 210285);
  assert.equal(q.tax, 37851.3);
  assert.equal(q.total, 248136.3);
  assert.equal(q.perGuest, 992.55);
  assert.equal(q.advancePct, 30);
  assert.equal(q.advance, 74440.89);
  assert.equal(q.balance, 173695.41);
});

test("rounds half-up to the paisa at every money boundary", () => {
  const q = calculateQuote({
    perPlate: 99.99,
    guests: 3,
    decorPrice: 0,
    addOns: [],
    staffCount: 0,
    staffRate: 1200,
    discountPct: 12.5,
    taxPct: 18,
  });
  assert.equal(q.lines.length, 1, "no décor or staff lines when zero");
  assert.equal(q.subtotal, 299.97);
  assert.equal(q.discount, 37.5); // 37.49625 → 37.50
  assert.equal(q.taxable, 262.47);
  assert.equal(q.tax, 47.24); // 47.2446 → 47.24
  assert.equal(q.total, 309.71);
  assert.equal(q.perGuest, 103.24); // 103.2367 → 103.24
  assert.equal(q.advance, 92.91);
  assert.equal(q.balance, 216.8);
});

test("invariants hold: subtotal = Σ lines, taxable + tax = total, advance + balance = total", () => {
  for (const discountPct of [0, 3.3, 7.5, 12, 25]) {
    for (const guests of [10, 137, 999, 5000]) {
      const q = calculateQuote({ ...base, perPlate: 333.33, guests, discountPct, taxPct: 18 });
      const sum = q.lines.reduce((s, l) => s + toPaise(l.amount), 0);
      assert.equal(toPaise(q.subtotal), sum);
      assert.equal(toPaise(q.subtotal) - toPaise(q.discount), toPaise(q.taxable));
      assert.equal(toPaise(q.taxable) + toPaise(q.tax), toPaise(q.total));
      assert.equal(toPaise(q.advance) + toPaise(q.balance), toPaise(q.total));
      for (const v of [q.subtotal, q.discount, q.tax, q.total, q.perGuest, q.advance, q.balance]) {
        assert.equal(Math.round(v * 100) / 100, v, `${v} has more than 2 decimals`);
      }
    }
  }
});

test("clamps discount to 25%, ignores negative / NaN inputs", () => {
  const q = calculateQuote({ ...base, discountPct: 40 });
  assert.equal(q.discountPct, 25);
  assert.equal(q.discount, 58412.5); // 25% of 233,650

  const neg = calculateQuote({ ...base, discountPct: -5, guests: -20, staffCount: Number.NaN });
  assert.equal(neg.discountPct, 0);
  assert.equal(neg.discount, 0);
  assert.equal(neg.lines.find((l) => l.id === "catering")?.amount, 0);
  assert.equal(neg.lines.find((l) => l.id === "staff"), undefined);
  assert.equal(neg.perGuest, 0, "no division by zero guests");
});

test("zero tax and custom advance percentage", () => {
  const q = calculateQuote({ ...base, taxPct: 0, discountPct: 0, advancePct: 50 });
  assert.equal(q.tax, 0);
  assert.equal(q.total, 233650);
  assert.equal(q.advance, 116825);
  assert.equal(q.balance, 116825);
});

test("toPaise converts rupees without binary drift", () => {
  assert.equal(toPaise(1.005), 101);
  assert.equal(toPaise(0.1 + 0.2), 30);
  assert.equal(toPaise(-4), 0);
});
