"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { DEMO_TODAY, EVENT_TYPE_META, EVENT_TYPES, GUESTS_MAX, GUESTS_MIN } from "@/lib/demo/catalog";
import { formatMediumDate } from "@/lib/demo/dates";
import type { EventType } from "@/lib/demo/types";
import { nextEventId, useDemo } from "./store";
import { Btn, Field, Modal, Select, TextInput } from "./ui";

type FormState = { clientName: string; type: EventType; date: string; guests: string; venue: string; city: string };
type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { clientName: "", type: "wedding", date: "", guests: "150", venue: "", city: "Pune" };

function validate(f: FormState): Errors {
  const errors: Errors = {};
  if (f.clientName.trim().length < 2) errors.clientName = "Enter the client's name (at least 2 characters).";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) errors.date = "Choose an event date.";
  else if (f.date < DEMO_TODAY) errors.date = `Date must be on or after the demo date (${formatMediumDate(DEMO_TODAY)}).`;
  else if (f.date > "2028-12-31") errors.date = "Choose a date before 2029.";
  const guests = Number(f.guests);
  if (!Number.isInteger(guests) || guests < GUESTS_MIN || guests > GUESTS_MAX)
    errors.guests = `Guests must be a whole number between ${GUESTS_MIN} and ${GUESTS_MAX.toLocaleString("en-IN")}.`;
  if (f.venue.trim().length < 2) errors.venue = "Enter a venue (a placeholder is fine).";
  return errors;
}

export function NewEnquiryModal() {
  const { enquiryOpen, setEnquiryOpen } = useDemo();
  return (
    <Modal
      open={enquiryOpen}
      onClose={() => setEnquiryOpen(false)}
      title="New enquiry"
      description="Capture a lead in seconds. It's added to this demo with status Enquiry."
    >
      <EnquiryForm onDone={() => setEnquiryOpen(false)} />
    </Modal>
  );
}

function EnquiryForm({ onDone }: { onDone: () => void }) {
  const { data, dispatch, toast, navigate, openEvent } = useDemo();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (k: keyof FormState) => `${uid}-${k}`;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    const firstInvalid = (Object.keys(errs) as (keyof FormState)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(firstInvalid))}`)?.focus();
      return;
    }
    const newId = nextEventId(data);
    dispatch({
      type: "addEnquiry",
      enquiry: {
        clientName: form.clientName.trim(),
        type: form.type,
        date: form.date,
        guests: Number(form.guests),
        venue: form.venue.trim(),
        city: form.city.trim(),
      },
    });
    toast(`Enquiry ${newId} added for ${form.clientName.trim()} — saved in this browser only.`);
    setForm(EMPTY);
    setErrors({});
    setSubmitted(false);
    onDone();
    navigate("events");
    openEvent(newId);
  };

  const describedBy = (k: keyof FormState) => (errors[k] ? `${id(k)}-error` : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Client name" htmlFor={id("clientName")} error={errors.clientName} className="sm:col-span-2">
        <TextInput
          id={id("clientName")}
          data-autofocus
          autoComplete="off"
          placeholder="e.g. Kavya & Rehan Mistry"
          value={form.clientName}
          onChange={(e) => update("clientName", e.target.value)}
          aria-invalid={Boolean(errors.clientName) || undefined}
          aria-describedby={describedBy("clientName")}
          required
        />
      </Field>
      <Field label="Event type" htmlFor={id("type")}>
        <Select id={id("type")} value={form.type} onChange={(e) => update("type", e.target.value as EventType)} className="w-full">
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_META[t].label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Event date" htmlFor={id("date")} error={errors.date}>
        <TextInput
          id={id("date")}
          type="date"
          min={DEMO_TODAY}
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          aria-invalid={Boolean(errors.date) || undefined}
          aria-describedby={describedBy("date")}
          required
        />
      </Field>
      <Field label="Expected guests" htmlFor={id("guests")} error={errors.guests} hint={`${GUESTS_MIN}–${GUESTS_MAX.toLocaleString("en-IN")}`}>
        <TextInput
          id={id("guests")}
          type="number"
          inputMode="numeric"
          min={GUESTS_MIN}
          max={GUESTS_MAX}
          value={form.guests}
          onChange={(e) => update("guests", e.target.value)}
          aria-invalid={Boolean(errors.guests) || undefined}
          aria-describedby={describedBy("guests") ?? `${id("guests")}-hint`}
          className="tabular-nums"
          required
        />
      </Field>
      <Field label="City" htmlFor={id("city")}>
        <TextInput id={id("city")} value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Pune" />
      </Field>
      <Field label="Venue" htmlFor={id("venue")} error={errors.venue} className="sm:col-span-2">
        <TextInput
          id={id("venue")}
          placeholder="e.g. Amaltas Lawns"
          value={form.venue}
          onChange={(e) => update("venue", e.target.value)}
          aria-invalid={Boolean(errors.venue) || undefined}
          aria-describedby={describedBy("venue")}
          required
        />
      </Field>
      <div className="flex flex-col-reverse gap-2 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-subtle">Sample only — no message is sent to anyone.</p>
        <div className="flex gap-2">
          <Btn onClick={onDone}>Cancel</Btn>
          <Btn type="submit" variant="primary">
            <Plus aria-hidden className="size-3.5" /> Add enquiry
          </Btn>
        </div>
      </div>
    </form>
  );
}
