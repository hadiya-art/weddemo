"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { CircleCheck, LoaderCircle, Lock } from "lucide-react";
import { industries, modules } from "@/config/site";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  MESSAGE_MAX,
  bookDemoFieldOrder,
  firstInvalidField,
  isValid,
  validateBookDemo,
  validateBookDemoField,
  type BookDemoValues,
  type FieldErrors,
} from "@/lib/validation";
import { ErrorSummary, FieldError, FieldLabel, SelectField, TextAreaField, TextField } from "./form-fields";

type Field = keyof BookDemoValues;
type Status = "idle" | "submitting" | "success";
type FormState = {
  status: Status;
  values: Omit<BookDemoValues, "module">;
  errors: FieldErrors<BookDemoValues>;
  showSummary: boolean;
  submitted: BookDemoValues | null;
};

const emptyValues: FormState["values"] = {
  fullName: "",
  businessName: "",
  industry: "",
  email: "",
  phone: "",
  message: "",
};
const initialState: FormState = { status: "idle", values: emptyValues, errors: {}, showSummary: false, submitted: null };

const moduleIds = modules.map((m) => m.id) as string[];
const options = { industries: industries as readonly string[], modules: moduleIds };
const DEFAULT_MODULE = "all";

const labels: Record<Field, string> = {
  fullName: "Full name",
  businessName: "Business name",
  industry: "Business industry",
  email: "Work email",
  phone: "Phone",
  module: "Interested module",
  message: "Message",
};

const fieldId = (f: Field) => `bd-${f}`;

/* Location search as an external store: read on the client only (no useSearchParams
   Suspense requirement) and re-read when the route is revealed again by <Activity>. */
const subscribeLocation = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
const getSearch = () => window.location.search;
const getServerSearch = () => "";

function moduleFromSearch(search: string): string | null {
  const id = new URLSearchParams(search).get("module");
  return id && moduleIds.includes(id) ? id : null;
}

export function BookDemoForm() {
  const [state, setState] = useState<FormState>(initialState);
  const search = useSyncExternalStore(subscribeLocation, getSearch, getServerSearch);
  // A user's choice is remembered only for the URL it was made on, so arriving
  // later with a different ?module= prefills that module instead.
  const [picked, setPicked] = useState<{ value: string; search: string } | null>(null);
  const moduleValue = picked && picked.search === search ? picked.value : (moduleFromSearch(search) ?? DEFAULT_MODULE);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);

  const allValues = (): BookDemoValues => ({ ...state.values, module: moduleValue });

  // Route kept alive by <Activity>: when it is hidden, cancel the simulated
  // request and clear a finished submission so a return visit starts fresh.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      setState((s) => (s.status === "success" ? initialState : s.status === "submitting" ? { ...s, status: "idle" } : s));
    };
  }, []);

  useEffect(() => {
    if (state.status === "success") successHeading.current?.focus();
  }, [state.status]);

  const setValue = (field: Exclude<Field, "module">, value: string) =>
    setState((s) => {
      const values = { ...s.values, [field]: value };
      // Re-validate live only once a field is already showing an error.
      const errors = s.errors[field]
        ? { ...s.errors, [field]: validateBookDemoField(field, { ...values, module: moduleValue }, options) }
        : s.errors;
      return { ...s, values, errors };
    });

  const blur = (field: Field) =>
    setState((s) => {
      const v = { ...s.values, module: moduleValue };
      // Don't nag about untouched empty fields on blur — only after the user typed.
      if (field !== "module" && !v[field] && !s.errors[field]) return s;
      return { ...s, errors: { ...s.errors, [field]: validateBookDemoField(field, v, options) } };
    });

  const focusField = (field: string) => {
    const el = document.getElementById(fieldId(field as Field));
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (state.status === "submitting") return;
    const values = allValues();
    const errors = validateBookDemo(values, options);
    if (!isValid(errors)) {
      setState((s) => ({ ...s, errors, showSummary: true }));
      const first = firstInvalidField(bookDemoFieldOrder, errors);
      if (first) focusField(first);
      return;
    }
    setState((s) => ({ ...s, errors: {}, showSummary: false, status: "submitting" }));
    // Simulated request — nothing leaves the browser.
    timer.current = setTimeout(() => {
      timer.current = null;
      setState((s) => ({ ...s, status: "success", submitted: values }));
    }, 1200);
  };

  const reset = () => {
    setState(initialState);
    setPicked(null);
    requestAnimationFrame(() => document.getElementById(fieldId("fullName"))?.focus());
  };

  if (state.status === "success" && state.submitted) {
    const sub = state.submitted;
    const summary: [string, string][] = [
      ["Name", sub.fullName],
      ["Business", sub.businessName],
      ["Industry", sub.industry],
      ["Email", sub.email],
      ["Phone", sub.phone],
      ["Module", modules.find((m) => m.id === sub.module)?.label ?? sub.module],
    ];
    if (sub.message.trim()) summary.push(["Message", sub.message.trim()]);
    return (
      <div className="p-6 sm:p-9" aria-live="polite">
        <span className="grid size-12 place-items-center rounded-2xl bg-success-soft text-success ring-1 ring-success/20">
          <CircleCheck aria-hidden className="size-6" />
        </span>
        <h2
          ref={successHeading}
          tabIndex={-1}
          className="mt-6 text-[1.7rem] leading-tight font-semibold tracking-[-0.03em] text-ink outline-none"
        >
          Request captured <span className="accent-serif">in this demo</span>
        </h2>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-muted">
          Nothing was sent. In the live version this would reach the team&apos;s inbox or CRM, and someone would
          follow up to schedule a walkthrough.
        </p>
        <dl className="mt-7 divide-y divide-line rounded-2xl bg-mist/70 px-5 ring-1 ring-line">
          {summary.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3 text-[0.9rem]">
              <dt className="text-ink-subtle">{k}</dt>
              <dd className="min-w-0 break-words whitespace-pre-line text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/demo" arrow>
            Explore the demo
          </ButtonLink>
          <Button variant="outline" onClick={reset}>
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  const { values, errors } = state;
  const submitting = state.status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={submitting} aria-describedby="bd-privacy" className="p-6 sm:p-9">
      {state.showSummary && (
        <ErrorSummary
          items={bookDemoFieldOrder.map((f) => ({ key: f, id: fieldId(f), label: labels[f], error: errors[f] }))}
          onJump={focusField}
        />
      )}

      <fieldset disabled={submitting} className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>
        <TextField
          id={fieldId("fullName")}
          label={labels.fullName}
          required
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => setValue("fullName", e.target.value)}
          onBlur={() => blur("fullName")}
          error={errors.fullName}
        />
        <TextField
          id={fieldId("businessName")}
          label={labels.businessName}
          required
          autoComplete="organization"
          value={values.businessName}
          onChange={(e) => setValue("businessName", e.target.value)}
          onBlur={() => blur("businessName")}
          error={errors.businessName}
        />
        <SelectField
          id={fieldId("industry")}
          label={labels.industry}
          required
          className="sm:col-span-2"
          placeholder="Select your industry"
          options={industries.map((i) => ({ value: i, label: i }))}
          value={values.industry}
          onChange={(e) => setValue("industry", e.target.value)}
          onBlur={() => blur("industry")}
          error={errors.industry}
        />
        <TextField
          id={fieldId("email")}
          label={labels.email}
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@business.com"
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          onBlur={() => blur("email")}
          error={errors.email}
        />
        <TextField
          id={fieldId("phone")}
          label={labels.phone}
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={(e) => setValue("phone", e.target.value)}
          onBlur={() => blur("phone")}
          error={errors.phone}
        />

        <fieldset
          className="sm:col-span-2"
          aria-describedby={errors.module ? `${fieldId("module")}-error` : undefined}
        >
          <FieldLabel as="legend" required>
            {labels.module}
          </FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {modules.map((m, i) => {
              const checked = moduleValue === m.id;
              const isAll = m.id === "all";
              return (
                <label
                  key={m.id}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-[0.9rem] ring-1 ring-inset transition-[background-color,box-shadow] duration-200",
                    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-electric",
                    isAll && "col-span-2",
                    checked
                      ? "bg-midnight text-white ring-midnight"
                      : "bg-white text-ink-2 ring-line-strong hover:ring-ink/25",
                  )}
                >
                  <input
                    id={i === 0 ? fieldId("module") : undefined}
                    type="radio"
                    name="module"
                    value={m.id}
                    checked={checked}
                    onChange={() => setPicked({ value: m.id, search })}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full ring-1 ring-inset",
                      checked ? "bg-white ring-white" : "ring-ink/25",
                    )}
                  >
                    {checked && <span className="size-1.5 rounded-full bg-midnight" />}
                  </span>
                  <span className="min-w-0 leading-snug">{m.label}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto hidden font-mono text-[0.66rem] sm:inline",
                      checked ? "text-electric-300" : "text-ink-subtle",
                    )}
                  >
                    {isAll ? "01–04" : `0${i + 1}`}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError id={fieldId("module")} error={errors.module} />
        </fieldset>

        <TextAreaField
          id={fieldId("message")}
          label={labels.message}
          optional
          className="sm:col-span-2"
          rows={4}
          max={MESSAGE_MAX}
          placeholder="Tell us about your events — typical guest counts, busy seasons, or what you'd like to see."
          hint={`Up to ${MESSAGE_MAX.toLocaleString("en-IN")} characters.`}
          value={values.message}
          onChange={(e) => setValue("message", e.target.value)}
          onBlur={() => blur("message")}
          error={errors.message}
        />
      </fieldset>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="bd-privacy" className="flex items-start gap-2 text-[0.8rem] leading-snug text-ink-subtle sm:max-w-[16rem]">
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Concept form — your details stay in this browser tab.
        </p>
        <Button type="submit" size="lg" disabled={submitting} arrow={!submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Request a walkthrough"
          )}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Submitting your request." : ""}
      </p>
    </form>
  );
}
