import { Check, Clock, MapPin, Paperclip, Phone, Send, StickyNote } from "lucide-react";
import { DemoDataTag } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { BrowserFrame } from "./frames";

/* Fictional sample data — illustrative only. */
const assignments = [
  { time: "10:30", title: "Tasting — Mehta Mehendi", place: "Studio kitchen", done: true },
  { time: "13:00", title: "Venue walkthrough", place: "Sitara Gardens", done: false, now: true },
  { time: "16:45", title: "Brief décor crew · Sangeet", place: "Warehouse 2", done: false },
];

const followUps = [
  { name: "Ananya R.", topic: "Engagement · 120 guests", due: "Today", tone: "now" },
  { name: "Vikram & Co.", topic: "Product launch dinner", due: "Overdue 1d", tone: "late" },
  { name: "Farah S.", topic: "Haldi décor quote", due: "Thu", tone: "later" },
] as const;

const dueStyle = {
  now: "bg-electric/[0.09] text-electric-600",
  late: "bg-danger-soft text-danger",
  later: "bg-ink/[0.05] text-ink-muted",
} as const;

export function StaffPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Illustrative Staff Dashboard preview with sample data: today's assignments, enquiry follow-ups with due-date labels, and a client conversation with an internal note."
      className={cn("w-full", className)}
    >
      <BrowserFrame title="Staff · My day" toolbar={<span className="hidden @sm:flex"><DemoDataTag /></span>}>
        <div className="bg-white p-3 text-ink @md:p-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-electric-300 text-[10px] font-semibold text-midnight">
                RK
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold tracking-[-0.02em]">Good morning, Riya</p>
                <p className="truncate text-[10px] text-ink-subtle">Event coordinator · 3 tasks · 3 follow-ups</p>
              </div>
            </div>
            <div className="hidden shrink-0 rounded-lg bg-mist p-0.5 text-[10px] ring-1 ring-line @md:flex">
              <span className="rounded-md bg-white px-2 py-1 font-medium shadow-sm ring-1 ring-line">Today</span>
              <span className="px-2 py-1 text-ink-subtle">Enquiries</span>
              <span className="px-2 py-1 text-ink-subtle">Clients</span>
            </div>
          </div>

          <div className="mt-3 grid gap-2.5 @xl:grid-cols-2">
            {/* Assignments */}
            <section className="rounded-xl bg-mist/70 p-2.5 ring-1 ring-line/70">
              <p className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.14em] text-ink-subtle uppercase">Assignments</span>
                <span className="text-[10px] text-ink-subtle tabular-nums">1 / 3</span>
              </p>
              <ol className="relative mt-2 space-y-1.5">
                {assignments.map((a) => (
                  <li
                    key={a.title}
                    className={cn(
                      "flex items-center gap-2 rounded-lg bg-white p-2 ring-1",
                      a.now ? "ring-electric/30 shadow-[0_6px_16px_-10px_rgb(56_107_255/0.6)]" : "ring-line/80",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-[5px]",
                        a.done ? "bg-success text-white" : "ring-1 ring-line-strong",
                      )}
                    >
                      {a.done && <Check className="size-2.5" strokeWidth={3} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-[11px] font-medium", a.done && "text-ink-subtle line-through")}>
                        {a.title}
                      </p>
                      <p className="flex items-center gap-1 truncate text-[10px] text-ink-subtle">
                        <MapPin className="size-2.5 shrink-0" /> {a.place}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] tabular-nums",
                        a.now ? "text-electric-600" : "text-ink-subtle",
                      )}
                    >
                      {a.time}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Follow-ups */}
            <section className="rounded-xl p-2.5 ring-1 ring-line/80">
              <p className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.14em] text-ink-subtle uppercase">
                  Enquiry follow-ups
                </span>
                <Clock className="size-3 text-ink-subtle" />
              </p>
              <ul className="mt-2 divide-y divide-line/80">
                {followUps.map((f) => (
                  <li key={f.name} className="flex items-center gap-2 py-1.5">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mist text-[10px] font-semibold text-ink-muted ring-1 ring-line">
                      {f.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium">{f.name}</p>
                      <p className="truncate text-[10px] text-ink-subtle">{f.topic}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
                        dueStyle[f.tone],
                      )}
                    >
                      {f.due}
                    </span>
                    <span className="hidden size-5 shrink-0 place-items-center rounded-md text-ink-subtle ring-1 ring-line @sm:grid">
                      <Phone className="size-2.5" />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Conversation */}
          <section className="mt-2.5 rounded-xl ring-1 ring-line/80">
            <div className="flex items-center justify-between border-b border-line/80 px-2.5 py-2">
              <p className="truncate text-[11px] font-semibold">
                Ananya R. <span className="font-normal text-ink-subtle">· Engagement enquiry</span>
              </p>
              <span className="flex items-center gap-1 text-[10px] text-success">
                <span className="size-1.5 rounded-full bg-success" /> Active
              </span>
            </div>
            <div className="space-y-1.5 p-2.5">
              <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-mist px-2.5 py-1.5 text-[10px] leading-snug text-ink-2">
                Could we add a live chaat counter for around 120 guests?
              </p>
              <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-electric-600 px-2.5 py-1.5 text-[10px] leading-snug text-white">
                Absolutely — I&apos;ll add it to your revised quote by this evening.
              </p>
              <p className="flex items-start gap-1.5 rounded-lg border border-dashed border-warning/40 bg-warning-soft/70 px-2 py-1.5 text-[10px] leading-snug text-[#8a5a12]">
                <StickyNote className="mt-px size-3 shrink-0" />
                <span>
                  <span className="font-semibold">Internal note:</span> confirm counter staffing with kitchen lead.
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-line/80 px-2.5 py-1.5">
              <Paperclip className="size-3 shrink-0 text-ink-subtle" />
              <span className="min-w-0 flex-1 truncate text-[10px] text-ink-subtle">Write a reply…</span>
              <span className="grid size-5 shrink-0 place-items-center rounded-md bg-midnight text-white">
                <Send className="size-2.5" />
              </span>
            </div>
          </section>
          <DemoDataTag className="mt-2.5 @sm:hidden" />
        </div>
      </BrowserFrame>
    </div>
  );
}
