/**
 * Pure, dependency-free form validation used by the concept forms
 * (Book a Demo, Contact). Kept free of path aliases so it can be unit-tested
 * directly with `node --experimental-strip-types --test`.
 */

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const MESSAGE_MAX = 1000;
export const NAME_MAX = 80;

/* ── Primitive checks ──────────────────────────────────────────────────── */

export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

const EMAIL_RE =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

/** Pragmatic email check: one @, no spaces, dotted domain with a real-looking TLD. */
export function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (v.length > 254) return false;
  const local = v.split("@")[0] ?? "";
  if (local.length > 64) return false;
  return EMAIL_RE.test(v);
}

/** Removes the separators people commonly type: spaces, dashes, dots and brackets. */
export function normalizePhone(value: string): string {
  return value.trim().replace(/[\s\-.()]/g, "");
}

const INDIAN_MOBILE_RE = /^(?:\+91|0091|91|0)?[6-9]\d{9}$/;
const INTERNATIONAL_RE = /^(?:\+|00)[1-9]\d{7,14}$/;

export type PhoneKind = "india" | "international";

/**
 * Accepts
 *  - Indian mobiles: 10 digits starting 6–9, optionally prefixed by +91, 0091, 91 or 0
 *  - International numbers: + (or 00) followed by 8–15 digits (E.164-style)
 * Spaces, dashes, dots and brackets are ignored. Returns null when invalid.
 */
export function classifyPhone(value: string): PhoneKind | null {
  const v = normalizePhone(value);
  if (!/^\+?\d+$/.test(v)) return null;
  if (INDIAN_MOBILE_RE.test(v)) return "india";
  // A number written with the Indian country code must be a valid Indian mobile.
  if (v.startsWith("+91") || v.startsWith("0091")) return null;
  if (INTERNATIONAL_RE.test(v)) return "international";
  return null;
}

export function isValidPhone(value: string): boolean {
  return classifyPhone(value) !== null;
}

/* ── Field rules ───────────────────────────────────────────────────────── */

export function validateName(value: string, label = "Name"): string | undefined {
  const v = value.trim();
  if (!v) return `Please enter your ${label.toLowerCase()}.`;
  if (v.length < 2) return `${label} looks too short.`;
  if (v.length > NAME_MAX) return `${label} must be ${NAME_MAX} characters or fewer.`;
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (isBlank(value)) return "Please enter your email address.";
  if (!isValidEmail(value)) return "Enter a valid email address, like name@business.com.";
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (isBlank(value)) return "Please enter a phone number.";
  if (!isValidPhone(value))
    return "Enter a 10-digit Indian mobile (e.g. 98765 43210) or an international number starting with +.";
  return undefined;
}

export function validateChoice(
  value: string,
  label: string,
  allowed?: readonly string[],
): string | undefined {
  if (isBlank(value)) return `Please choose ${label}.`;
  if (allowed && !allowed.includes(value)) return `Please choose a valid option for ${label}.`;
  return undefined;
}

export function validateMessage(
  value: string,
  { required = false, max = MESSAGE_MAX }: { required?: boolean; max?: number } = {},
): string | undefined {
  const v = value.trim();
  if (required && !v) return "Please add a short message.";
  if (required && v.length < 10) return "Please add a little more detail (at least 10 characters).";
  if (value.length > max) return `Message must be ${max} characters or fewer.`;
  return undefined;
}

/* ── Form schemas ──────────────────────────────────────────────────────── */

export type BookDemoValues = {
  fullName: string;
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  module: string;
  message: string;
};

export type BookDemoOptions = { industries?: readonly string[]; modules?: readonly string[] };

export const bookDemoFieldOrder: (keyof BookDemoValues)[] = [
  "fullName",
  "businessName",
  "industry",
  "email",
  "phone",
  "module",
  "message",
];

export function validateBookDemoField(
  field: keyof BookDemoValues,
  values: BookDemoValues,
  options: BookDemoOptions = {},
): string | undefined {
  switch (field) {
    case "fullName":
      return validateName(values.fullName, "Full name");
    case "businessName":
      return validateName(values.businessName, "Business name");
    case "industry":
      return validateChoice(values.industry, "your industry", options.industries);
    case "email":
      return validateEmail(values.email);
    case "phone":
      return validatePhone(values.phone);
    case "module":
      return validateChoice(values.module, "a module", options.modules);
    case "message":
      return validateMessage(values.message);
  }
}

export function validateBookDemo(
  values: BookDemoValues,
  options: BookDemoOptions = {},
): FieldErrors<BookDemoValues> {
  return collect(bookDemoFieldOrder, (f) => validateBookDemoField(f, values, options));
}

export type ContactValues = { name: string; email: string; message: string };

export const contactFieldOrder: (keyof ContactValues)[] = ["name", "email", "message"];

export function validateContactField(field: keyof ContactValues, values: ContactValues): string | undefined {
  switch (field) {
    case "name":
      return validateName(values.name, "Name");
    case "email":
      return validateEmail(values.email);
    case "message":
      return validateMessage(values.message, { required: true });
  }
}

export function validateContact(values: ContactValues): FieldErrors<ContactValues> {
  return collect(contactFieldOrder, (f) => validateContactField(f, values));
}

/** True when an errors object has no messages. */
export function isValid<T>(errors: FieldErrors<T>): boolean {
  return Object.values(errors).every((e) => !e);
}

/** First field (in display order) that has an error — used to move focus on submit. */
export function firstInvalidField<T>(order: (keyof T)[], errors: FieldErrors<T>): keyof T | undefined {
  return order.find((f) => Boolean(errors[f]));
}

function collect<K extends string>(order: K[], check: (f: K) => string | undefined): Partial<Record<K, string>> {
  const out: Partial<Record<K, string>> = {};
  for (const f of order) {
    const e = check(f);
    if (e) out[f] = e;
  }
  return out;
}
