"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type ComponentPropsWithRef,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
  type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, CircleAlert, Info, Minus, Plus, Star, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { EVENT_TYPE_META, STATUS_META } from "@/lib/demo/catalog";
import { initials } from "@/lib/demo/derive";
import type { Diet, EventStatus, EventType, StaffMember } from "@/lib/demo/types";
import { useDemo } from "./store";

/* ───────────────────────────── Hooks ───────────────────────────── */

const noopSubscribe = () => () => {};
/** True only on the client after hydration — safe guard for portals. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Moves focus into `ref` on mount, traps Tab, closes on Escape, restores focus on unmount. */
/** Open dialogs, innermost last — only the top one reacts to Escape / Tab. */
const dialogStack: HTMLElement[] = [];

/** Moves focus into `ref` on mount, traps Tab, closes on Escape, restores focus on unmount. */
export function useDialogFocus(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  initialFocus?: RefObject<HTMLElement | null>,
) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    if (!node) return;
    dialogStack.push(node);
    const target =
      initialFocus?.current ?? node.querySelector<HTMLElement>("[data-autofocus]") ?? node.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? node).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (dialogStack[dialogStack.length - 1] !== node) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!node.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Capture phase on the document so Escape works wherever focus currently is.
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      const idx = dialogStack.indexOf(node);
      if (idx >= 0) dialogStack.splice(idx, 1);
      // Only hand focus back if it is still inside this dialog (or lost) — another
      // overlay may have legitimately taken it in the meantime.
      const current = document.activeElement;
      const focusLost = !current || current === document.body || node.contains(current);
      if (focusLost && previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [ref, initialFocus]);
}

/** Closes a popover on outside pointer-down and on Escape. */
export function useDismiss(
  open: boolean,
  refs: RefObject<HTMLElement | null>[],
  onClose: () => void,
) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      closeRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // refs are stable ref objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

/* ───────────────────────────── Buttons ───────────────────────────── */

type BtnVariant = "primary" | "secondary" | "ghost" | "dark" | "danger" | "subtle";
type BtnSize = "xs" | "sm" | "md";

const btnBase =
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium tracking-[-0.005em] transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";
const btnVariants: Record<BtnVariant, string> = {
  primary:
    "bg-electric-600 text-white shadow-[0_1px_0_rgb(255_255_255/0.2)_inset,0_1px_2px_rgb(11_16_32/0.12),0_4px_12px_-4px_rgb(47_94_240/0.5)] hover:bg-[#2652d9]",
  secondary:
    "bg-white text-ink-2 ring-1 ring-inset ring-line-strong/80 shadow-[0_1px_2px_rgb(11_16_32/0.05)] hover:bg-mist hover:text-ink",
  ghost: "text-ink-muted hover:bg-ink/[0.045] hover:text-ink",
  subtle: "bg-ink/[0.045] text-ink-2 hover:bg-ink/[0.08]",
  dark: "bg-midnight text-white shadow-[0_1px_2px_rgb(11_16_32/0.2)] hover:bg-charcoal",
  danger: "bg-danger text-white hover:bg-[#bd3446]",
};
const btnSizes: Record<BtnSize, string> = {
  xs: "h-7 px-2.5 text-[12px]",
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-3.5 text-[13px]",
};

export function btnClass(variant: BtnVariant = "secondary", size: BtnSize = "md", className?: string) {
  return cn(btnBase, btnVariants[variant], btnSizes[size], className);
}

export function Btn({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ComponentPropsWithRef<"button"> & { variant?: BtnVariant; size?: BtnSize }) {
  return <button type={type} className={btnClass(variant, size, className)} {...rest} />;
}

export function IconBtn({
  label,
  className,
  children,
  tone = "light",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: "light" | "dark" }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        tone === "dark"
          ? "text-haze-muted hover:bg-white/[0.07] hover:text-white"
          : "text-ink-subtle hover:bg-ink/[0.05] hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ───────────────────────────── Surfaces ───────────────────────────── */

export function Card({ className, children, as: Tag = "section", ...rest }: { className?: string; children: ReactNode; as?: "section" | "div" | "article"; "aria-labelledby"?: string }) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-line bg-white shadow-[0_1px_2px_rgb(11_16_32/0.04),0_1px_1px_rgb(11_16_32/0.02)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  id,
  description,
  action,
  className,
}: {
  title: ReactNode;
  id?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-4 pb-3", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-[12.5px] text-ink-subtle">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-1.5">{action}</div>}
    </div>
  );
}

export function ViewHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-[22px] leading-tight font-semibold tracking-[-0.025em] text-ink sm:text-[24px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 no-print">{actions}</div>}
    </div>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-electric/[0.07] px-1.5 py-0.5 font-mono text-[9.5px] font-medium tracking-[0.1em] text-electric-600 uppercase",
        className,
      )}
    >
      Sample
    </span>
  );
}

/* ───────────────────────────── Badges ───────────────────────────── */

export function StatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium whitespace-nowrap ring-1 ring-inset",
        meta.badge,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function TypeTag({ type, className }: { type: EventType; className?: string }) {
  const meta = EVENT_TYPE_META[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] whitespace-nowrap text-ink-muted", className)}>
      <span aria-hidden className={cn("size-2 rounded-[3px]", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-ink/[0.05] px-2 py-0.5 text-[11.5px] font-medium whitespace-nowrap text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Indian food-labelling style marker: square outline with a dot (veg) or triangle (non-veg). */
export function DietMark({ diet, className }: { diet: Diet; className?: string }) {
  const label = diet === "nonveg" ? "Non-vegetarian" : diet === "jain" ? "Jain (vegetarian)" : "Vegetarian";
  const color = diet === "nonveg" ? "#A4372B" : "#138A4B";
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1", className)} title={label}>
      <svg viewBox="0 0 12 12" className="size-3" role="img" aria-label={label}>
        <rect x="0.75" y="0.75" width="10.5" height="10.5" rx="1.5" fill="white" stroke={color} strokeWidth="1.3" />
        {diet === "nonveg" ? <path d="M6 3.2 8.6 8.2H3.4Z" fill={color} /> : <circle cx="6" cy="6" r="2.4" fill={color} />}
      </svg>
      {diet === "jain" && (
        <span aria-hidden className="rounded-[3px] bg-[#E7F5EC] px-1 font-mono text-[9px] leading-[14px] font-semibold text-[#138A4B]">
          JAIN
        </span>
      )}
    </span>
  );
}

/* ───────────────────────────── Avatars ───────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}
/** Opaque tint (so overlapping avatars don't show through each other). */
function mixWithWhite(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => Math.round(255 - (255 - c) * amount);
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}
function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const d = (c: number) => Math.round(c * (1 - amount));
  return `rgb(${d(r)} ${d(g)} ${d(b)})`;
}

export function Avatar({
  name,
  tint = "#386BFF",
  size = "md",
  className,
  ring,
}: {
  name: string;
  tint?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  ring?: boolean;
}) {
  const sizes = { xs: "size-5 text-[8.5px]", sm: "size-6 text-[9.5px]", md: "size-8 text-[11px]", lg: "size-10 text-[13px]" };
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide",
        sizes[size],
        ring && "ring-2 ring-white",
        className,
      )}
      style={{ backgroundColor: mixWithWhite(tint, 0.14), color: darken(tint, 0.38) }}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ people, max = 4 }: { people: StaffMember[]; max?: number }) {
  if (people.length === 0) return <span className="text-[12px] text-ink-subtle">Unassigned</span>;
  const shown = people.slice(0, max);
  return (
    <span className="flex items-center" aria-label={people.map((p) => p.name).join(", ")} role="img">
      {shown.map((p, i) => (
        <Avatar key={p.id} name={p.name} tint={p.tint} size="sm" ring className={cn(i > 0 && "-ml-1.5")} />
      ))}
      {people.length > max && (
        <span className="-ml-1.5 inline-flex size-6 items-center justify-center rounded-full bg-mist text-[9.5px] font-semibold text-ink-muted ring-2 ring-white">
          +{people.length - max}
        </span>
      )}
    </span>
  );
}

/* ───────────────────────────── Form controls ───────────────────────────── */

export const inputClass =
  "h-9 w-full rounded-lg border border-line bg-white px-3 text-[13px] text-ink shadow-[0_1px_1px_rgb(11_16_32/0.03)] transition-[border-color,box-shadow] placeholder:text-ink-subtle/80 hover:border-line-strong focus:border-electric focus:shadow-[0_0_0_3px_rgb(56_107_255/0.15)] focus-visible:outline-none aria-invalid:border-danger aria-invalid:focus:shadow-[0_0_0_3px_rgb(212_61_81/0.15)]";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ink-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="flex items-center gap-1 text-[12px] text-danger">
          <CircleAlert aria-hidden className="size-3.5" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-[12px] text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...rest} />;
}

export function Select({
  className,
  children,
  size = "md",
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { size?: "sm" | "md" }) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        className={cn(
          inputClass,
          "cursor-pointer appearance-none pr-8",
          size === "sm" && "h-8 text-[12.5px]",
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-ink-subtle" />
    </span>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  id?: string;
}) {
  const autoId = useId();
  const labelId = `${id ?? autoId}-label`;
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <span id={labelId} className="block text-[13px] font-medium text-ink-2">
          {label}
        </span>
        {description && <span className="mt-0.5 block text-[12px] text-ink-subtle">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
          checked ? "bg-electric-600" : "bg-ink/15 hover:bg-ink/20",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-4 rounded-full bg-white shadow-[0_1px_2px_rgb(11_16_32/0.25)] transition-transform duration-200 ease-[var(--ease-out-expo)]",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

/** Numeric stepper with +/- buttons and a free-typed value, clamped on blur. */
export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  id,
  bigStep,
}: {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  id?: string;
  bigStep?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  const commit = (raw: string) => {
    const n = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
    onChange(Number.isFinite(n) ? clamp(n) : value);
    setDraft(null);
  };
  const bump = (delta: number) => onChange(clamp(value + delta));
  return (
    <div className="inline-flex h-9 items-stretch overflow-hidden rounded-lg border border-line bg-white shadow-[0_1px_1px_rgb(11_16_32/0.03)] focus-within:border-electric focus-within:shadow-[0_0_0_3px_rgb(56_107_255/0.15)]">
      <button
        type="button"
        onClick={() => bump(-(bigStep ?? step))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        className="flex w-9 items-center justify-center text-ink-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-offset-[-2px] disabled:opacity-35"
      >
        <Minus aria-hidden className="size-3.5" />
      </button>
      <input
        id={id}
        inputMode="numeric"
        aria-label={label}
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
          if (e.key === "ArrowUp") {
            e.preventDefault();
            bump(step);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            bump(-step);
          }
        }}
        className="w-16 border-x border-line bg-transparent text-center text-[13px] font-medium text-ink tabular-nums focus-visible:outline-none"
      />
      <button
        type="button"
        onClick={() => bump(bigStep ?? step)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className="flex w-9 items-center justify-center text-ink-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-offset-[-2px] disabled:opacity-35"
      >
        <Plus aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}

/* ───────────────────────────── Segmented / Tabs ───────────────────────────── */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
  size = "md",
  idPrefix,
}: {
  tabs: { id: T; label: ReactNode; count?: number }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
  size?: "sm" | "md";
  idPrefix?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex((t) => t.id === value);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[next].id);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "scrollbar-thin inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-lg bg-ink/[0.045] p-0.5",
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${t.id}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel` : undefined}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-offset-0",
              size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]",
              active
                ? "bg-white text-ink shadow-[0_1px_2px_rgb(11_16_32/0.08),0_0_0_1px_rgb(11_16_32/0.04)]"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10.5px] leading-4 tabular-nums",
                  active ? "bg-electric/10 text-electric-600" : "bg-ink/[0.06] text-ink-subtle",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── Progress & stars ───────────────────────────── */

export function Progress({ value, className, tone = "electric", label }: { value: number; className?: string; tone?: "electric" | "success" | "violet"; label?: string }) {
  const tones = { electric: "bg-electric", success: "bg-success", violet: "bg-violet" };
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.07]", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-expo)]", tones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Stars({ value, size = "sm", className }: { value: number; size?: "xs" | "sm" | "md"; className?: string }) {
  const s = { xs: "size-3", sm: "size-3.5", md: "size-4.5" }[size];
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value.toFixed(1).replace(/\.0$/, "")} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className={cn("relative inline-block", s)} aria-hidden>
            <Star className={cn("absolute inset-0 text-ink/15", s)} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("text-[#F2A20C]", s)} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function StarInput({ value, onChange, name, label }: { value: number; onChange: (n: number) => void; name: string; label: string }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{label}</legend>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer rounded-md p-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-electric" onMouseEnter={() => setHover(n)}>
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} className="sr-only" />
            <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
            <Star
              aria-hidden
              className={cn("size-7 transition-transform duration-150", n <= shown ? "scale-105 text-[#F2A20C]" : "text-ink/15")}
              fill="currentColor"
              strokeWidth={0}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ───────────────────────────── Empty state ───────────────────────────── */

export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-mist text-ink-subtle ring-1 ring-line">{icon}</div>
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13px] text-ink-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ───────────────────────────── Overlays ───────────────────────────── */

function useOverlayMotion() {
  const reduce = useReducedMotion();
  return reduce;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  initialFocus,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  initialFocus?: RefObject<HTMLElement | null>;
}) {
  const isClient = useIsClient();
  const reduce = useOverlayMotion();
  if (!isClient) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6 print:hidden">
          <motion.div
            className="absolute inset-0 bg-midnight/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <ModalPanel
            onClose={onClose}
            title={title}
            description={description}
            footer={footer}
            size={size}
            reduce={!!reduce}
            initialFocus={initialFocus}
          >
            {children}
          </ModalPanel>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ModalPanel({
  onClose,
  title,
  description,
  children,
  footer,
  size,
  reduce,
  initialFocus,
}: {
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size: "sm" | "md" | "lg";
  reduce: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useDialogFocus(ref, onClose, initialFocus);
  const widths = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };
  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      tabIndex={-1}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
      transition={{ duration: reduce ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-[var(--shadow-float)] ring-1 ring-ink/5 focus-visible:outline-none sm:rounded-2xl",
        widths[size],
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 pt-5 pb-4">
        <div>
          <h2 id={titleId} className="text-[16px] font-semibold tracking-[-0.015em] text-ink">
            {title}
          </h2>
          {description && (
            <p id={descId} className="mt-1 text-[13px] text-ink-muted">
              {description}
            </p>
          )}
        </div>
        <IconBtn label="Close dialog" onClick={onClose} className="-mt-1 -mr-1.5">
          <X aria-hidden className="size-4" />
        </IconBtn>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-5">{children}</div>
      {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-mist/60 px-5 py-3.5">{footer}</div>}
    </motion.div>
  );
}

export function Drawer({
  open,
  onClose,
  label,
  children,
  side = "right",
  widthClass = "sm:max-w-[520px]",
  dark,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  side?: "right" | "left";
  widthClass?: string;
  dark?: boolean;
}) {
  const isClient = useIsClient();
  const reduce = useOverlayMotion();
  if (!isClient) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] print:hidden">
          <motion.div
            className="absolute inset-0 bg-midnight/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <DrawerPanel onClose={onClose} label={label} side={side} widthClass={widthClass} reduce={!!reduce} dark={dark}>
            {children}
          </DrawerPanel>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function DrawerPanel({
  onClose,
  label,
  children,
  side,
  widthClass,
  reduce,
  dark,
}: {
  onClose: () => void;
  label: string;
  children: ReactNode;
  side: "right" | "left";
  widthClass: string;
  reduce: boolean;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose);
  const offset = side === "right" ? "100%" : "-100%";
  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      initial={reduce ? { opacity: 0 } : { x: offset }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: offset }}
      transition={{ duration: reduce ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute top-0 bottom-0 flex w-full flex-col shadow-[var(--shadow-float)] focus-visible:outline-none",
        side === "right" ? "right-0" : "left-0",
        dark ? "on-dark bg-midnight" : "bg-white",
        widthClass,
      )}
    >
      {children}
    </motion.div>
  );
}

/** Lightweight anchored popover panel (menus, notifications). */
export function PopoverPanel({
  open,
  children,
  className,
  align = "right",
  label,
  id,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
  label: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="dialog"
          aria-label={label}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: reduce ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute top-[calc(100%+8px)] z-[60] origin-top rounded-xl border border-line bg-white shadow-[var(--shadow-float)]",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────────── Toasts ───────────────────────────── */

export function ToastRegion() {
  const { toasts, dismissToast } = useDemo();
  const reduce = useReducedMotion();
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:items-end print:hidden"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} tone={t.tone} message={t.message} onDismiss={dismissToast} reduce={!!reduce} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  id,
  message,
  tone,
  onDismiss,
  reduce,
}: {
  id: number;
  message: string;
  tone: "success" | "info" | "warning";
  onDismiss: (id: number) => void;
  reduce: boolean;
}) {
  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss]);
  useEffect(() => {
    const t = window.setTimeout(dismiss, 4200);
    return () => window.clearTimeout(t);
  }, [dismiss]);
  const icon =
    tone === "success" ? (
      <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-[#3FD69A]">
        <Check aria-hidden className="size-3" strokeWidth={3} />
      </span>
    ) : tone === "warning" ? (
      <CircleAlert aria-hidden className="size-4.5 text-[#FFC266]" />
    ) : (
      <Info aria-hidden className="size-4.5 text-electric-300" />
    );
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="on-dark pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-midnight/95 py-2.5 pr-2 pl-3.5 text-[13px] text-haze shadow-[var(--shadow-float)] ring-1 ring-white/10 backdrop-blur"
    >
      {icon}
      <p className="min-w-0 flex-1 leading-snug">{message}</p>
      <IconBtn label="Dismiss notification" tone="dark" onClick={dismiss} className="size-7">
        <X aria-hidden className="size-3.5" />
      </IconBtn>
    </motion.div>
  );
}

/** Visually-hidden helper. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
