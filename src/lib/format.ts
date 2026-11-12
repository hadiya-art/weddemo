const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const num = new Intl.NumberFormat("en-IN");

/** ₹1,25,000 — Indian digit grouping, no decimals. */
export function formatINR(value: number): string {
  return inr.format(Math.round(value));
}
/** ₹1,25,000.50 — two decimals. */
export function formatINRPrecise(value: number): string {
  return inrPrecise.format(value);
}
/** 1,25,000 */
export function formatNumber(value: number): string {
  return num.format(value);
}
/** ₹12.4L / ₹1.2Cr style compact amounts. */
export function formatINRCompact(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.?0+$/, "")}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1).replace(/\.0$/, "")}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return formatINR(value);
}
