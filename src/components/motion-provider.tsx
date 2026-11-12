"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Respect the OS "reduce motion" setting everywhere: Motion skips transform
 * and layout animations for those users (opacity fades remain), without
 * changing the rendered tree — which keeps SSR hydration stable.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
