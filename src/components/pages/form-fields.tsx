"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import { CircleAlert, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/** Shared input styling for the concept forms. */
export const controlClasses = (invalid?: boolean) =>
  cn(
    "w-full rounded-xl bg-white px-4 text-[0.97rem] text-ink placeholder:text-ink-subtle/80 ring-1 ring-inset transition-[box-shadow,background-color] duration-200",
    "focus:outline-none focus-visible:outline-none focus:ring-2",
    invalid
      ? "bg-danger-soft/40 ring-danger/55 focus:ring-danger/70"
      : "ring-line-strong hover:ring-ink/25 focus:ring-electric-600/70",
  );

export function describedBy(id: string, opts: { error?: string; hint?: boolean }) {
  return [opts.hint ? `${id}-hint` : null, opts.error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

export function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
  as: Tag = "label",
  id,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  as?: "label" | "legend";
  id?: string;
}) {
  return (
    <Tag
      id={id}
      {...(Tag === "label" ? { htmlFor } : {})}
      className="mb-2 flex items-baseline gap-1.5 text-[0.86rem] font-medium text-ink-2"
    >
      {children}
      {required && (
        <span aria-hidden className="text-electric-600">
          *
        </span>
      )}
      {optional && <span className="text-[0.78rem] font-normal text-ink-subtle">(optional)</span>}
    </Tag>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-[0.82rem] leading-snug text-[#c02d42]">
      <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
      {error}
    </p>
  );
}

export function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={`${id}-hint`} className="mt-2 text-[0.8rem] leading-snug text-ink-subtle">
      {children}
    </p>
  );
}

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  optional?: boolean;
  className?: string;
};

export function TextField({
  id,
  label,
  error,
  hint,
  required,
  optional,
  className,
  inputRef,
  ...rest
}: BaseProps & { inputRef?: Ref<HTMLInputElement> } & Omit<ComponentProps<"input">, "id" | "className" | "ref">) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <input
        ref={inputRef}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, { error, hint: Boolean(hint) })}
        className={cn(controlClasses(Boolean(error)), "h-12")}
        {...rest}
      />
      {hint && <FieldHint id={id}>{hint}</FieldHint>}
      <FieldError id={id} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  optional,
  className,
  selectRef,
  placeholder,
  options,
  ...rest
}: BaseProps & {
  selectRef?: Ref<HTMLSelectElement>;
  placeholder: string;
  options: readonly { value: string; label: string }[];
} & Omit<ComponentProps<"select">, "id" | "className" | "ref" | "children">) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          ref={selectRef}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy(id, { error, hint: Boolean(hint) })}
          className={cn(controlClasses(Boolean(error)), "h-12 appearance-none pr-10", !rest.value && "text-ink-subtle")}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        />
      </div>
      {hint && <FieldHint id={id}>{hint}</FieldHint>}
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  required,
  optional,
  className,
  textareaRef,
  max,
  value,
  ...rest
}: BaseProps & {
  textareaRef?: Ref<HTMLTextAreaElement>;
  max: number;
  value: string;
} & Omit<ComponentProps<"textarea">, "id" | "className" | "ref" | "value">) {
  const count = value.length;
  const near = count > max * 0.9;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel htmlFor={id} required={required} optional={optional}>
          {label}
        </FieldLabel>
        <span
          aria-hidden
          className={cn(
            "font-mono text-[0.7rem] tabular-nums",
            count > max ? "text-[#c02d42]" : near ? "text-warning" : "text-ink-subtle",
          )}
        >
          {count.toLocaleString("en-IN")} / {max.toLocaleString("en-IN")}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(id, { error, hint: Boolean(hint) })}
        className={cn(controlClasses(Boolean(error)), "min-h-32 resize-y py-3 leading-relaxed")}
        {...rest}
      />
      {hint && <FieldHint id={id}>{hint}</FieldHint>}
      <FieldError id={id} error={error} />
    </div>
  );
}

/** Screen-reader-friendly error summary rendered above a form after a failed submit. */
export function ErrorSummary({
  items,
  onJump,
}: {
  /** Fields in display order; only those with an error are listed. */
  items: { key: string; id: string; label: string; error?: string }[];
  onJump: (key: string) => void;
}) {
  const list = items.filter((i) => i.error);
  if (!list.length) return null;
  return (
    <div role="alert" className="mb-7 rounded-2xl bg-danger-soft/70 p-4 ring-1 ring-inset ring-danger/25">
      <p className="flex items-center gap-2 text-[0.92rem] font-semibold text-[#a52438]">
        <CircleAlert aria-hidden className="size-4" />
        {list.length === 1 ? "1 field needs attention" : `${list.length} fields need attention`}
      </p>
      <ul className="mt-2 space-y-1 pl-6 text-[0.86rem]">
        {list.map((f) => (
          <li key={f.key}>
            <a
              href={`#${f.id}`}
              onClick={(e) => {
                e.preventDefault();
                onJump(f.key);
              }}
              className="text-[#a52438] underline decoration-[#a52438]/30 underline-offset-2 hover:decoration-[#a52438]"
            >
              {f.label}: {f.error}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
