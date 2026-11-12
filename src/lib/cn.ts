import { twMerge } from "tailwind-merge";

/** Join class names and resolve Tailwind conflicts (later classes win). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
