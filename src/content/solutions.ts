/**
 * Module descriptions for /solutions. All capabilities describe an
 * ILLUSTRATIVE concept — nothing here is a shipped product claim.
 */
import type { ModuleId } from "@/config/site";

export type IndustryKey = "caterer" | "decorator" | "planner" | "organiser";

export const industryLabels: Record<IndustryKey, string> = {
  caterer: "Caterer",
  decorator: "Decorator",
  planner: "Wedding planner",
  organiser: "Event organiser",
};

export type Capability = { title: string; body: string };

export type SolutionModule = {
  id: Exclude<ModuleId, "all">;
  index: string;
  name: string;
  shortName: string;
  audience: string;
  surface: string;
  /** Headline split so the middle word can take the serif accent. */
  title: [string, string, string];
  job: string;
  capabilities: Capability[];
  useCases: Record<IndustryKey, string>;
  demoHref: string;
};

export const solutionModules: SolutionModule[] = [
  {
    id: "admin",
    index: "01",
    name: "Admin Dashboard",
    shortName: "Admin",
    audience: "Owners, directors & finance leads",
    surface: "Desktop · Web",
    title: ["See the whole business ", "at a glance", "."],
    job: "The control room. Every booking, menu, quotation and payment in one view, so owners stop stitching the business together from spreadsheets, notebooks and chat threads.",
    capabilities: [
      { title: "Event orders", body: "Every booking with guest count, services, venue and status — from first enquiry to final settlement." },
      { title: "Menus & packages", body: "Per-plate menus and décor packages built once and reused across quotations." },
      { title: "Quotations", body: "Itemised quotes with add-ons, discounts and tax lines that recalculate as you edit." },
      { title: "Billing preview", body: "Deposits, balances and what's due — visible before an invoice ever goes out." },
      { title: "Event calendar", body: "Week and month views that surface clashes, venue load and crew availability." },
      { title: "Vendor overview", body: "Florists, lighting, rentals and transport, with costs attached to each event." },
    ],
    useCases: {
      caterer: "Price a 450-guest wedding by plate count and live counters, then track the deposit.",
      decorator: "Turn an approved mood board into a costed package of florals, lighting and rentals.",
      planner: "Hold every vendor, payment milestone and family approval for a multi-day wedding.",
      organiser: "Balance concurrent corporate events against venue and crew capacity.",
    },
    demoHref: "/demo#overview",
  },
  {
    id: "staff",
    index: "02",
    name: "Staff Dashboard",
    shortName: "Staff",
    audience: "Coordinators, sales & operations teams",
    surface: "Desktop · Tablet",
    title: ["Every enquiry answered. ", "Every", " task owned."],
    job: "A clear day for every team member: what's assigned to them, which clients are waiting, and the full conversation behind each booking — kept with the business, not on one person's phone.",
    capabilities: [
      { title: "Assignments", body: "Personal task lists with venue, time and the event each task belongs to." },
      { title: "Client enquiries", body: "One queue for new leads, with event date, guest count and budget captured upfront." },
      { title: "Follow-ups", body: "Due-date reminders so a warm enquiry never quietly goes cold." },
      { title: "Notes & history", body: "Client conversations and internal notes stored against the client record." },
      { title: "Handovers", body: "Reassign work when someone is on leave, without losing the context." },
    ],
    useCases: {
      caterer: "Schedule tastings and confirm final guest counts with the kitchen lead.",
      decorator: "Coordinate site recces and brief installation crews before the day.",
      planner: "Track each family's requests across haldi, mehendi and sangeet.",
      organiser: "Follow up on corporate proposals and keep approvals moving.",
    },
    demoHref: "/demo#team",
  },
  {
    id: "manager",
    index: "03",
    name: "Manager App",
    shortName: "Manager",
    audience: "On-ground event managers & captains",
    surface: "Mobile",
    title: ["Run the event from the floor, ", "not", " the office."],
    job: "The run-of-show in the pocket of whoever leads the event — progress, live alerts and guest feedback, updated as the evening unfolds.",
    capabilities: [
      { title: "Event progress", body: "A live run-of-show with each cue checked off as it happens." },
      { title: "Live notifications", body: "Alerts for stock, arrivals and delays, routed to the right person." },
      { title: "Guest feedback", body: "Quick ratings and comments gathered at the table or after the event." },
      { title: "Crew check-in", body: "Who has arrived, and which station or zone they're covering." },
    ],
    useCases: {
      caterer: "Watch counter stock and service timings through dinner.",
      decorator: "Confirm installation sign-off before the first guest arrives.",
      planner: "Keep ceremony cues on time across more than one venue.",
      organiser: "Coordinate stage, AV and hospitality from a single timeline.",
    },
    demoHref: "/demo#feedback",
  },
  {
    id: "customer",
    index: "04",
    name: "Customer App",
    shortName: "Customer",
    audience: "Hosts, couples & their guests",
    surface: "Mobile · Shareable link",
    title: ["A guest experience that ", "feels", " like your brand."],
    job: "The business, extended to its clients — elegant invitations, digital menus and event information that hosts are proud to share and guests can actually use.",
    capabilities: [
      { title: "Digital invitations", body: "Shareable invites in the business's own style, with RSVPs that flow back to the team." },
      { title: "Digital menus", body: "Course-by-course menus with dietary markers, readable right at the table." },
      { title: "Event information", body: "Schedules, venue directions and dress codes behind one link." },
      { title: "RSVP tracking", body: "Guest counts that could feed straight into catering and seating plans." },
    ],
    useCases: {
      caterer: "Share a digital menu with dietary markers at every table.",
      decorator: "Show hosts their approved look and colour story before the day.",
      planner: "Send invitations and collect RSVPs function by function.",
      organiser: "Publish agendas, venue details and live updates to attendees.",
    },
    demoHref: "/demo#customer",
  },
];
