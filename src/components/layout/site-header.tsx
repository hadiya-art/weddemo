"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ctas, mainNav } from "@/config/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { ConceptBadge } from "./concept-badge";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu whenever the route changes (routes are kept alive
  // by React <Activity>, so state would otherwise persist).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      // Minimal focus trap inside the mobile panel
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="on-dark fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <a
        href="#main"
        className="sr-only rounded-full bg-white px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-full pr-2 pl-4 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:pl-5",
          scrolled || open
            ? "bg-midnight/[0.92] shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_20px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-midnight/40 shadow-[0_0_0_1px_rgb(255_255_255/0.06)] backdrop-blur-md",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Link href="/" aria-label="EVENTOS home" className="rounded-lg">
            <Logo />
          </Link>
          <ConceptBadge />
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.9rem] transition-colors duration-200",
                    isActive(item.href) ? "text-white" : "text-haze-muted hover:text-white",
                  )}
                >
                  {isActive(item.href) && (
                    <motion.span
                      layoutId={reduce ? undefined : "nav-pill"}
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={ctas.secondary.href} variant="secondary" size="sm" className="hidden md:inline-flex">
            {ctas.secondary.label}
          </ButtonLink>
          <ButtonLink href={ctas.primary.href} size="sm" className="hidden sm:inline-flex">
            {ctas.primary.label}
          </ButtonLink>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full text-white ring-1 ring-inset ring-white/12 transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-[1240px] overflow-hidden rounded-[1.6rem] bg-midnight/95 p-3 shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_40px_80px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {[{ label: "Home", href: "/" }, ...mainNav].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg tracking-[-0.02em] transition-colors",
                        isActive(item.href) ? "bg-white/[0.07] text-white" : "text-haze-muted hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {item.label}
                      <span aria-hidden className="font-mono text-xs text-haze-subtle">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <ButtonLink href={ctas.secondary.href} variant="secondary" onClick={() => setOpen(false)}>
                {ctas.secondary.label}
              </ButtonLink>
              <ButtonLink href={ctas.primary.href} onClick={() => setOpen(false)}>
                {ctas.primary.label}
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
