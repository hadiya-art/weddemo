import { ADD_ONS, ADVANCE_PCT, DECOR_TIERS, DEMO_TODAY, DISH_BY_ID, SERVICE_STAFF_RATE } from "./catalog";
import { daysFromToday, isoMonth, monthOf } from "./dates";
import { calculateQuote, type QuoteBreakdown, type QuoteInput } from "./quote";
import type { DemoData, DemoEvent, Dish, Task } from "./types";

export function menuDishes(event: DemoEvent): Dish[] {
  return event.menu.map((id) => DISH_BY_ID[id]).filter((d): d is Dish => Boolean(d));
}

export function perPlate(event: DemoEvent): number {
  return menuDishes(event).reduce((sum, d) => sum + d.price, 0);
}

export function quoteInputForEvent(event: DemoEvent): QuoteInput {
  const tier = DECOR_TIERS.find((t) => t.id === event.quote.decorTier) ?? DECOR_TIERS[0];
  return {
    perPlate: perPlate(event),
    guests: event.guests,
    decorPrice: tier.price,
    decorLabel: tier.id === "none" ? undefined : `${tier.label} package`,
    addOns: ADD_ONS.filter((a) => event.quote.addOns.includes(a.id)).map((a) => ({
      id: a.id,
      label: a.label,
      pricing: a.pricing,
      rate: a.rate,
    })),
    staffCount: event.quote.staffCount,
    staffRate: SERVICE_STAFF_RATE,
    discountPct: event.quote.discountPct,
    taxPct: event.quote.taxPct,
    advancePct: ADVANCE_PCT,
  };
}

export function quoteForEvent(event: DemoEvent): QuoteBreakdown {
  return calculateQuote(quoteInputForEvent(event));
}

export function eventValue(event: DemoEvent): number {
  return quoteForEvent(event).total;
}

export function taskProgress(tasks: Task[], eventId: string) {
  const list = tasks.filter((t) => t.eventId === eventId);
  const done = list.filter((t) => t.status === "done").length;
  return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
}

export function isUpcoming(event: DemoEvent): boolean {
  return daysFromToday(event.date) >= 0 && event.status !== "cancelled" && event.status !== "completed";
}

export function computeKpis(data: DemoData) {
  const { year, month } = monthOf(DEMO_TODAY);
  const thisMonth = isoMonth(year, month);
  const live = data.events.filter((e) => e.status !== "cancelled");
  const upcoming = live.filter(isUpcoming);
  const upcomingThisMonth = upcoming.filter((e) => e.date.startsWith(thisMonth));
  const nextSevenDays = upcoming.filter((e) => daysFromToday(e.date) <= 7);
  const confirmed = upcoming.filter((e) => e.status === "confirmed");
  const confirmedValue = confirmed.reduce((s, e) => s + eventValue(e), 0);
  const enquiries = data.events.filter((e) => e.status === "enquiry");
  const tentative = data.events.filter((e) => e.status === "tentative");
  const pipeline = [...enquiries, ...tentative];
  const pipelineValue = pipeline.reduce((s, e) => s + eventValue(e), 0);
  const ratings = data.feedback.map((f) => f.rating);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  return {
    upcomingThisMonth: upcomingThisMonth.length,
    nextSevenDays: nextSevenDays.length,
    confirmed: confirmed.length,
    confirmedValue,
    enquiries: enquiries.length,
    tentative: tentative.length,
    pipelineCount: pipeline.length,
    pipelineValue,
    avgRating,
    ratingsCount: ratings.length,
  };
}

export function initials(name: string): string {
  const parts = name.replace(/[^A-Za-z\s&'-]/g, "").split(/\s+/).filter((p) => p && p !== "&");
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
