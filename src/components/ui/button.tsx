import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /* Electric blue — main conversion action */
  primary:
    "bg-electric-600 text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_24px_-8px_rgb(56_107_255/0.7)] hover:bg-electric hover:shadow-[0_1px_0_rgb(255_255_255/0.3)_inset,0_12px_32px_-8px_rgb(56_107_255/0.85)]",
  /* Quiet translucent action on dark backgrounds */
  secondary:
    "bg-white/[0.06] text-white ring-1 ring-inset ring-white/15 backdrop-blur-sm hover:bg-white/[0.11] hover:ring-white/25",
  ghost: "text-current hover:bg-black/[0.04]",
  /* Dark solid action on light backgrounds */
  light:
    "bg-midnight text-white shadow-[0_8px_24px_-12px_rgb(11_16_32/0.6)] hover:bg-charcoal hover:shadow-[0_12px_28px_-12px_rgb(11_16_32/0.7)]",
  outline:
    "bg-white text-ink ring-1 ring-inset ring-line-strong hover:ring-ink/30 hover:bg-mist",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.94rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Show the animated arrow affordance. */
  arrow?: boolean;
};

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  arrow,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  arrow,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
