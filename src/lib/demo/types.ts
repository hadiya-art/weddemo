export type ViewId =
  | "overview"
  | "calendar"
  | "events"
  | "menu"
  | "quotation"
  | "team"
  | "customer"
  | "feedback";

export type EventType = "wedding" | "reception" | "sangeet" | "corporate" | "birthday";
export type EventStatus = "enquiry" | "tentative" | "confirmed" | "completed" | "cancelled";
export type DecorTier = "none" | "essential" | "signature" | "luxe";
export type QuoteStatus = "draft" | "sent";

export interface QuoteConfig {
  decorTier: DecorTier;
  addOns: string[];
  staffCount: number;
  discountPct: number;
  taxPct: number;
  status: QuoteStatus;
}

export interface Client {
  name: string;
  /** Always masked — fictional sample contact. */
  phone: string;
  email: string;
}

export interface DemoEvent {
  id: string;
  title: string;
  client: Client;
  type: EventType;
  status: EventStatus;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, 24h */
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  guests: number;
  staffIds: string[];
  menu: string[];
  quote: QuoteConfig;
  notes: string;
  /** Host names for invitation copy, e.g. "Ishita & Kabir". */
  hosts: string;
}

export type Availability = "available" | "on-event" | "leave";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  kind: "team" | "vendor";
  availability: Availability;
  phone: string;
  /** Tailwind-free hex used for the avatar tint. */
  tint: string;
}

export type Diet = "veg" | "jain" | "nonveg";
export type DishCategory = "welcome" | "starters" | "mains" | "breads" | "desserts" | "live";

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  diet: Diet;
  price: number;
  note: string;
}

export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  eventId: string | null;
  assigneeId: string | null;
  status: TaskStatus;
  due: string;
  priority: "high" | "normal";
}

export interface FollowUp {
  id: string;
  eventId: string;
  staffId: string;
  note: string;
  due: string;
  channel: "Call" | "WhatsApp" | "Email" | "Site visit";
  done: boolean;
}

export interface Feedback {
  id: string;
  eventId: string;
  guest: string;
  rating: number;
  comment: string;
  date: string;
  reviewed: boolean;
  reply: string;
  source: "Customer app" | "Post-event survey";
}

export type NotificationKind = "enquiry" | "payment" | "task" | "feedback" | "rsvp" | "system";

export interface DemoNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** YYYY-MM-DDTHH:MM, demo clock */
  at: string;
  read: boolean;
  view: ViewId;
  eventId?: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  at: string;
  kind: "status" | "task" | "menu" | "quote" | "team" | "feedback" | "enquiry" | "rsvp";
}

export type RsvpResponse = "yes" | "maybe" | "no";

export interface Rsvp {
  response: RsvpResponse;
  party: number;
}

export interface DemoData {
  version: 1;
  seq: number;
  events: DemoEvent[];
  staff: StaffMember[];
  tasks: Task[];
  followUps: FollowUp[];
  feedback: Feedback[];
  notifications: DemoNotification[];
  activity: ActivityItem[];
  rsvps: Record<string, Rsvp>;
  /** Event the menu builder / quotation / customer app are focused on. */
  focusEventId: string;
}
