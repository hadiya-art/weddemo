import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTeaser } from "./teaser-quote.ts";

test("reference scenario matches the hero quotation panel", () => {
  const q = calculateTeaser({ guests: 450, perPlate: 1240, decor: 185000, discount: true });
  assert.equal(q.catering, 558000);
  assert.equal(q.staffCount, 14);
  assert.equal(q.staff, 42000);
  assert.equal(q.subtotal, 785000);
  assert.equal(q.discount, 39250);
  assert.equal(q.taxable, 745750);
  assert.equal(q.tax, 134235);
  assert.equal(q.total, 879985);
  assert.equal(q.advance, 263996);
  assert.equal(q.balance, 615989);
  assert.equal(q.advance + q.balance, q.total);
});

test("no discount and minimum staff", () => {
  const q = calculateTeaser({ guests: 50, perPlate: 950, decor: 85000, discount: false });
  assert.equal(q.catering, 47500);
  assert.equal(q.staffCount, 4);
  assert.equal(q.discount, 0);
  assert.equal(q.subtotal, 47500 + 85000 + 12000);
  assert.equal(q.tax, Math.round(q.subtotal * 0.18));
  assert.equal(q.total, q.subtotal + q.tax);
});

test("totals always reconcile across the slider range", () => {
  for (let g = 50; g <= 1000; g += 10) {
    const q = calculateTeaser({ guests: g, perPlate: 1650, decor: 340000, discount: g % 20 === 0 });
    assert.equal(q.taxable, q.subtotal - q.discount);
    assert.equal(q.total, q.taxable + q.tax);
    assert.equal(q.advance + q.balance, q.total);
  }
});

test("zero guests is safe", () => {
  const q = calculateTeaser({ guests: 0, perPlate: 1240, decor: 0, discount: true });
  assert.equal(q.total, 0);
  assert.equal(q.perGuest, 0);
});
