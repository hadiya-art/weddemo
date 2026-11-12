"use client";

import { Children, type ReactNode } from "react";
import { motion } from "motion/react";

/** Staggered entrance for hero copy. Reduced motion is handled by MotionConfig. */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {Children.toArray(children).map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
