import { CalendarDays, Clock, MapPin } from "lucide-react";
import { DemoDataTag } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { PhoneFrame } from "./frames";

/* Fictional sample data — illustrative only. */
const tabs = ["Welcome", "Mains", "Desserts"];
const dishes = [
  { name: "Dal makhani", note: "Slow-cooked overnight", veg: true },
  { name: "Paneer lababdar", note: "Tomato, cashew, fenugreek", veg: true },
  { name: "Laal maas", note: "Rajasthani, smoked chilli", veg: false },
];

export function CustomerPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Illustrative Customer App preview on a phone with sample data: a digital wedding invitation for Meera and Kabir with date and venue, a digital menu with tabs, and an RSVP button."
      className={cn("w-full", className)}
    >
      <PhoneFrame tone="light">
        <div className="px-3.5 pb-2">
          {/* Invitation */}
          <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-[#f3eee6] to-[#fbfaf7] px-4 pt-5 pb-4 text-center ring-1 ring-[#e8e0d2]">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-violet/15 blur-3xl"
            />
            <Ornament />
            <p className="relative mt-2 font-mono text-[10px] tracking-[0.22em] text-[#6b5a40] uppercase">
              Together with their families
            </p>
            <p className="relative mt-2 font-serif text-[30px] leading-[1] tracking-[-0.01em] text-ink">
              Meera <span className="italic text-[#9b7b4c]">&amp;</span> Kabir
            </p>
            <p className="relative mt-2 text-[10px] text-ink-muted">request the pleasure of your company</p>
            <div className="relative mx-auto mt-3 flex max-w-[15rem] items-center justify-center gap-3 border-y border-[#e3d9c8] py-2 text-[10px] text-ink-2">
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3 text-[#9b7b4c]" /> Sat, 13 Feb 2027
              </span>
              <span aria-hidden className="h-3 w-px bg-[#e3d9c8]" />
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-[#9b7b4c]" /> 7 pm
              </span>
            </div>
            <p className="relative mt-2 flex items-center justify-center gap-1 text-[10px] text-ink-muted">
              <MapPin className="size-3 text-[#9b7b4c]" /> Sitara Gardens, Udaipur
            </p>
          </div>

          {/* Menu */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <p className="font-serif text-[16px] italic text-ink">Dinner menu</p>
              <DemoDataTag />
            </div>
            <div className="mt-2 flex gap-1 rounded-full bg-[#f1ede6] p-0.5 text-[10px]">
              {tabs.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "flex-1 rounded-full py-1 text-center",
                    t === "Mains" ? "bg-white font-medium text-ink shadow-sm" : "text-ink-subtle",
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
            <ul className="mt-2 divide-y divide-[#ece6dc]">
              {dishes.map((d) => (
                <li key={d.name} className="flex items-center gap-2 py-1.5">
                  <VegMark veg={d.veg} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-ink">{d.name}</p>
                    <p className="truncate text-[10px] text-ink-subtle">{d.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RSVP */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="flex h-9 flex-1 items-center justify-center rounded-full bg-midnight text-[11px] font-medium text-white shadow-[0_8px_18px_-8px_rgb(11_16_32/0.6)]">
              RSVP · 2 guests
            </span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink ring-1 ring-[#e3d9c8]">
              <CalendarDays className="size-3.5" />
            </span>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-ink-subtle">Kindly respond by 20 January</p>
        </div>
      </PhoneFrame>
    </div>
  );
}

function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "grid size-3 shrink-0 place-items-center rounded-[2px] border",
        veg ? "border-success" : "border-[#a3412f]",
      )}
    >
      <span className={cn("size-1.5 rounded-full", veg ? "bg-success" : "bg-[#a3412f]")} />
    </span>
  );
}

function Ornament() {
  return (
    <svg aria-hidden viewBox="0 0 120 16" className="relative mx-auto h-3 w-24 text-[#b99665]" fill="none">
      <path d="M0 8h44M76 8h44" stroke="currentColor" strokeWidth="0.8" />
      <path d="M60 2l6 6-6 6-6-6z" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="60" cy="8" r="1.4" fill="currentColor" />
      <circle cx="49" cy="8" r="1" fill="currentColor" />
      <circle cx="71" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
