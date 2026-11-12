import type { DecorTier, Dish, DishCategory, EventStatus, EventType, ViewId } from "./types";
import type { AddOnPricing } from "./quote";

/** The demo runs on a fixed clock so every visitor sees the same story. */
export const DEMO_TODAY = "2026-11-16";
export const DEMO_NOW = "2026-11-16T10:30";

export const BUSINESS = {
  name: "Saffron & Sage Events",
  tagline: "Catering · Décor · Wedding planning",
  address: "Illustrative address · Pune, Maharashtra",
  gstin: "GSTIN 27XXXXX0000X0ZX (sample)",
  email: "hello@saffronsage.example",
} as const;

export const CURRENT_USER = { name: "Aanya Rao", role: "Admin", initials: "AR" } as const;

export const SERVICE_STAFF_RATE = 1200;
export const DEFAULT_TAX_PCT = 18;
export const ADVANCE_PCT = 30;
export const GUESTS_MIN = 10;
export const GUESTS_MAX = 5000;

export const VIEW_LABELS: Record<ViewId, string> = {
  overview: "Overview",
  calendar: "Calendar",
  events: "Events",
  menu: "Menu builder",
  quotation: "Quotation",
  team: "Team & tasks",
  customer: "Customer app",
  feedback: "Guest feedback",
};

export const EVENT_TYPES: EventType[] = ["wedding", "reception", "sangeet", "corporate", "birthday"];

export const EVENT_TYPE_META: Record<
  EventType,
  { label: string; short: string; dot: string; chip: string; bar: string }
> = {
  wedding: {
    label: "Wedding",
    short: "Wedding",
    dot: "bg-[#D6457A]",
    chip: "bg-[#FCEBF1] text-[#8E1F4A] hover:bg-[#F9DCE7]",
    bar: "bg-[#D6457A]",
  },
  reception: {
    label: "Reception",
    short: "Reception",
    dot: "bg-violet",
    chip: "bg-[#F0EBFF] text-[#4B2FB0] hover:bg-[#E6DEFF]",
    bar: "bg-violet",
  },
  sangeet: {
    label: "Sangeet / Mehendi",
    short: "Sangeet",
    dot: "bg-[#E08A1E]",
    chip: "bg-[#FDF1E1] text-[#8A4B05] hover:bg-[#FBE6CA]",
    bar: "bg-[#E08A1E]",
  },
  corporate: {
    label: "Corporate",
    short: "Corporate",
    dot: "bg-electric",
    chip: "bg-[#E9EFFF] text-[#1F44B8] hover:bg-[#DCE6FF]",
    bar: "bg-electric",
  },
  birthday: {
    label: "Birthday",
    short: "Birthday",
    dot: "bg-[#0F9F8F]",
    chip: "bg-[#E2F6F3] text-[#0B6157] hover:bg-[#D2F0EB]",
    bar: "bg-[#0F9F8F]",
  },
};

export const EVENT_STATUSES: EventStatus[] = ["enquiry", "tentative", "confirmed", "completed", "cancelled"];

export const STATUS_META: Record<EventStatus, { label: string; badge: string; dot: string }> = {
  enquiry: { label: "Enquiry", badge: "bg-[#F1ECFF] text-[#5532C9] ring-[#865DFF]/20", dot: "bg-violet" },
  tentative: { label: "Tentative", badge: "bg-warning-soft text-[#8C5A0E] ring-warning/20", dot: "bg-warning" },
  confirmed: { label: "Confirmed", badge: "bg-[#EAF0FF] text-electric-600 ring-electric/20", dot: "bg-electric" },
  completed: { label: "Completed", badge: "bg-success-soft text-[#0B7A50] ring-success/20", dot: "bg-success" },
  cancelled: { label: "Cancelled", badge: "bg-[#F1F3F7] text-ink-subtle ring-ink/10", dot: "bg-[#9AA3B5]" },
};

export const DISH_CATEGORIES: { id: DishCategory; label: string }[] = [
  { id: "welcome", label: "Welcome drinks" },
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Mains" },
  { id: "breads", label: "Breads & Rice" },
  { id: "desserts", label: "Desserts" },
  { id: "live", label: "Live counters" },
];

export const DISHES: Dish[] = [
  // Welcome drinks
  { id: "d01", name: "Masala chaas", category: "welcome", diet: "veg", price: 45, note: "Spiced buttermilk, roasted cumin" },
  { id: "d02", name: "Aam panna", category: "welcome", diet: "veg", price: 55, note: "Raw mango, black salt, mint" },
  { id: "d03", name: "Kokum sherbet", category: "welcome", diet: "jain", price: 50, note: "Konkan kokum, rock sugar" },
  { id: "d04", name: "Rose falooda shots", category: "welcome", diet: "veg", price: 70, note: "Sabja, vermicelli, rose milk" },
  { id: "d05", name: "Jaljeera fizz", category: "welcome", diet: "jain", price: 40, note: "Tangy cumin cooler" },
  { id: "d06", name: "Kesar thandai", category: "welcome", diet: "veg", price: 85, note: "Saffron, almond, fennel" },
  // Starters
  { id: "d07", name: "Paneer tikka", category: "starters", diet: "veg", price: 140, note: "Tandoor-charred, hung-curd marinade" },
  { id: "d08", name: "Hara bhara kebab", category: "starters", diet: "veg", price: 110, note: "Spinach, peas, green chilli" },
  { id: "d09", name: "Dahi ke kebab", category: "starters", diet: "veg", price: 120, note: "Hung curd, crisp crust" },
  { id: "d10", name: "Corn & spinach tikki", category: "starters", diet: "jain", price: 100, note: "No onion, no garlic" },
  { id: "d11", name: "Tandoori broccoli", category: "starters", diet: "jain", price: 130, note: "Cheese & cardamom glaze" },
  { id: "d12", name: "Mini kachori, three chutneys", category: "starters", diet: "veg", price: 90, note: "Moong dal filling" },
  { id: "d13", name: "Amritsari fish tikka", category: "starters", diet: "nonveg", price: 190, note: "Ajwain batter, lemon" },
  { id: "d14", name: "Chicken malai tikka", category: "starters", diet: "nonveg", price: 175, note: "Cream, cheese, white pepper" },
  { id: "d15", name: "Mutton seekh kebab", category: "starters", diet: "nonveg", price: 220, note: "Charcoal-grilled, mint chutney" },
  // Mains
  { id: "d16", name: "Dal makhani", category: "mains", diet: "veg", price: 120, note: "Slow-cooked overnight" },
  { id: "d17", name: "Paneer lababdar", category: "mains", diet: "veg", price: 150, note: "Tomato-cashew gravy" },
  { id: "d18", name: "Subz miloni", category: "mains", diet: "jain", price: 115, note: "Seasonal greens, no root veg" },
  { id: "d19", name: "Kadhai mushroom", category: "mains", diet: "veg", price: 130, note: "Bell peppers, kadhai masala" },
  { id: "d20", name: "Kashmiri dum aloo", category: "mains", diet: "veg", price: 120, note: "Yoghurt, fennel, Kashmiri chilli" },
  { id: "d21", name: "Undhiyu", category: "mains", diet: "veg", price: 140, note: "Gujarati winter vegetables" },
  { id: "d22", name: "Jain paneer makhanwala", category: "mains", diet: "jain", price: 150, note: "Rich, onion-garlic free" },
  { id: "d23", name: "Butter chicken", category: "mains", diet: "nonveg", price: 200, note: "Smoked tomato makhani" },
  { id: "d24", name: "Laal maas", category: "mains", diet: "nonveg", price: 260, note: "Rajasthani mathania chilli" },
  { id: "d25", name: "Malabar prawn curry", category: "mains", diet: "nonveg", price: 280, note: "Coconut, kokum, curry leaf" },
  // Breads & rice
  { id: "d26", name: "Butter naan", category: "breads", diet: "veg", price: 35, note: "Tandoor-fresh" },
  { id: "d27", name: "Laccha paratha", category: "breads", diet: "veg", price: 40, note: "Flaky, layered" },
  { id: "d28", name: "Missi roti", category: "breads", diet: "jain", price: 30, note: "Gram flour, ajwain" },
  { id: "d29", name: "Bajra roti, white butter", category: "breads", diet: "veg", price: 35, note: "Rustic millet bread" },
  { id: "d30", name: "Jeera rice", category: "breads", diet: "jain", price: 60, note: "Basmati, cumin tempering" },
  { id: "d31", name: "Hyderabadi veg biryani", category: "breads", diet: "veg", price: 160, note: "Dum-cooked, mirchi salan" },
  { id: "d32", name: "Chicken dum biryani", category: "breads", diet: "nonveg", price: 210, note: "Kachchi style, burani raita" },
  // Desserts
  { id: "d33", name: "Gulab jamun with rabri", category: "desserts", diet: "veg", price: 95, note: "Warm, saffron rabri" },
  { id: "d34", name: "Moong dal halwa", category: "desserts", diet: "veg", price: 110, note: "Ghee-roasted, winter special" },
  { id: "d35", name: "Kesar phirni", category: "desserts", diet: "jain", price: 85, note: "Set in clay kulhads" },
  { id: "d36", name: "Shahi tukda", category: "desserts", diet: "veg", price: 100, note: "Bread pudding, rabri, pistachio" },
  { id: "d37", name: "Rasmalai", category: "desserts", diet: "veg", price: 105, note: "Cardamom milk, almonds" },
  { id: "d38", name: "Kulfi falooda", category: "desserts", diet: "veg", price: 115, note: "Malai kulfi, rose syrup" },
  // Live counters
  { id: "d39", name: "Live chaat counter", category: "live", diet: "veg", price: 180, note: "Pani puri, papdi, tikki" },
  { id: "d40", name: "Live dosa counter", category: "live", diet: "veg", price: 160, note: "Ghee roast, podi, chutneys" },
  { id: "d41", name: "Pasta & risotto station", category: "live", diet: "veg", price: 190, note: "Made to order" },
  { id: "d42", name: "Kathi roll station", category: "live", diet: "nonveg", price: 170, note: "Chicken & paneer rolls" },
  { id: "d43", name: "Jalebi & rabri live", category: "live", diet: "veg", price: 120, note: "Fried fresh at the counter" },
  { id: "d44", name: "Paan station", category: "live", diet: "jain", price: 65, note: "Meetha & chocolate paan" },
];

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(DISHES.map((d) => [d.id, d]));

export const DECOR_TIERS: { id: DecorTier; label: string; price: number; description: string }[] = [
  { id: "none", label: "No décor", price: 0, description: "Client arranges décor separately" },
  { id: "essential", label: "Essential", price: 85000, description: "Stage backdrop, entrance arch, table florals" },
  { id: "signature", label: "Signature", price: 175000, description: "Themed stage, floral ceiling, mood lighting" },
  { id: "luxe", label: "Luxe", price: 320000, description: "Full venue styling, installations, LED mapping" },
];

export const ADD_ONS: { id: string; label: string; pricing: AddOnPricing; rate: number; description: string }[] = [
  { id: "counter-staff", label: "Live counter chefs", pricing: "flat", rate: 12000, description: "Two chefs per live counter" },
  { id: "valet", label: "Valet parking", pricing: "flat", rate: 18000, description: "Up to 150 cars, 6 drivers" },
  { id: "photo", label: "Photography coordination", pricing: "flat", rate: 25000, description: "Shot list, vendor liaison" },
  { id: "mehendi", label: "Mehendi setup", pricing: "flat", rate: 15000, description: "Seating, bolsters, artist area" },
  { id: "crockery", label: "Premium crockery upgrade", pricing: "perGuest", rate: 45, description: "Bone china & brass cutlery" },
  { id: "favours", label: "Return favours", pricing: "perGuest", rate: 180, description: "Curated mithai boxes" },
];

/** Confirmed bookings per month — seed history for the overview chart. */
export const BOOKING_HISTORY: { month: string; label: string; bookings: number }[] = [
  { month: "2025-12", label: "Dec", bookings: 11 },
  { month: "2026-01", label: "Jan", bookings: 13 },
  { month: "2026-02", label: "Feb", bookings: 12 },
  { month: "2026-03", label: "Mar", bookings: 8 },
  { month: "2026-04", label: "Apr", bookings: 9 },
  { month: "2026-05", label: "May", bookings: 6 },
  { month: "2026-06", label: "Jun", bookings: 4 },
  { month: "2026-07", label: "Jul", bookings: 3 },
  { month: "2026-08", label: "Aug", bookings: 5 },
  { month: "2026-09", label: "Sep", bookings: 7 },
  { month: "2026-10", label: "Oct", bookings: 10 },
  { month: "2026-11", label: "Nov", bookings: 14 },
];
