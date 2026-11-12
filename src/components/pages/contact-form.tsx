"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CircleCheck, LoaderCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MESSAGE_MAX,
  contactFieldOrder,
  firstInvalidField,
  isValid,
  validateContact,
  validateContactField,
  type ContactValues,
  type FieldErrors,
} from "@/lib/validation";
import { ErrorSummary, TextAreaField, TextField } from "./form-fields";

type Field = keyof ContactValues;
type State = {
  status: "idle" | "submitting" | "success";
  values: ContactValues;
  errors: FieldErrors<ContactValues>;
  showSummary: boolean;
};
const initial: State = { status: "idle", values: { name: "", email: "", message: "" }, errors: {}, showSummary: false };
const labels: Record<Field, string> = { name: "Name", email: "Email", message: "Message" };
const fieldId = (f: Field) => `ct-${f}`;

/** Short general-enquiry form. Simulated: validates locally, sends nothing. */
export function ContactForm() {
  const [state, setState] = useState<State>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);

  // Route kept alive by <Activity>: reset transient submission state when hidden.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      setState((s) => (s.status === "success" ? initial : s.status === "submitting" ? { ...s, status: "idle" } : s));
    };
  }, []);

  useEffect(() => {
    if (state.status === "success") doneHeading.current?.focus();
  }, [state.status]);

  const setValue = (f: Field, v: string) =>
    setState((s) => {
      const values = { ...s.values, [f]: v };
      return { ...s, values, errors: s.errors[f] ? { ...s.errors, [f]: validateContactField(f, values) } : s.errors };
    });

  const blur = (f: Field) =>
    setState((s) =>
      !s.values[f] && !s.errors[f] ? s : { ...s, errors: { ...s.errors, [f]: validateContactField(f, s.values) } },
    );

  const focusField = (f: string) => document.getElementById(fieldId(f as Field))?.focus();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (state.status === "submitting") return;
    const errors = validateContact(state.values);
    if (!isValid(errors)) {
      setState((s) => ({ ...s, errors, showSummary: true }));
      const first = firstInvalidField(contactFieldOrder, errors);
      if (first) focusField(first);
      return;
    }
    setState((s) => ({ ...s, errors: {}, showSummary: false, status: "submitting" }));
    timer.current = setTimeout(() => {
      timer.current = null;
      setState((s) => ({ ...s, status: "success" }));
    }, 1200);
  };

  if (state.status === "success") {
    return (
      <div className="p-6 sm:p-8" aria-live="polite">
        <span className="grid size-11 place-items-center rounded-2xl bg-success-soft text-success ring-1 ring-success/20">
          <CircleCheck aria-hidden className="size-5" />
        </span>
        <h2 ref={doneHeading} tabIndex={-1} className="mt-5 text-[1.45rem] font-semibold tracking-[-0.03em] text-ink outline-none">
          Message captured <span className="accent-serif">in this demo</span>
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
          Nothing was sent, {state.values.name.trim().split(" ")[0]}. In the live version this message would reach the
          team&apos;s inbox, and a reply would go to <span className="font-medium text-ink">{state.values.email.trim()}</span>.
        </p>
        <Button
          variant="outline"
          className="mt-7"
          onClick={() => {
            setState(initial);
            requestAnimationFrame(() => focusField("name"));
          }}
        >
          Write another message
        </Button>
      </div>
    );
  }

  const { values, errors } = state;
  const submitting = state.status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="p-6 sm:p-8">
      {state.showSummary && (
        <ErrorSummary
          items={contactFieldOrder.map((f) => ({ key: f, id: fieldId(f), label: labels[f], error: errors[f] }))}
          onJump={focusField}
        />
      )}
      <fieldset disabled={submitting} className="grid grid-cols-1 gap-6">
        <legend className="sr-only">General enquiry</legend>
        <TextField
          id={fieldId("name")}
          label={labels.name}
          required
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValue("name", e.target.value)}
          onBlur={() => blur("name")}
          error={errors.name}
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
        <TextAreaField
          id={fieldId("message")}
          label={labels.message}
          required
          rows={5}
          max={MESSAGE_MAX}
          placeholder="How can we help?"
          value={values.message}
          onChange={(e) => setValue("message", e.target.value)}
          onBlur={() => blur("message")}
          error={errors.message}
        />
      </fieldset>
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[0.8rem] leading-snug text-ink-subtle sm:max-w-[15rem]">
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Concept form — nothing is sent anywhere.
        </p>
        <Button type="submit" size="lg" variant="light" disabled={submitting} arrow={!submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Submitting your message." : ""}
      </p>
    </form>
  );
}
