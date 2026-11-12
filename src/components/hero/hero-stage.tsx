"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { HeroFallback2D } from "./hero-fallback";
import { usePanelCanvases } from "./use-panel-canvases";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

type Mode = "pending" | "webgl" | "fallback";

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

function prefersLightweight(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 2) return true;
  return false;
}

/** If the WebGL scene throws, quietly switch to the 2D composition. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroStage({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const canvases = usePanelCanvases();
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok = supportsWebGL() && !prefersLightweight();
    // Defer slightly so the headline paints first.
    const id = window.setTimeout(() => setMode(ok ? "webgl" : "fallback"), 60);
    return () => window.clearTimeout(id);
  }, []);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showFallback = mode === "fallback";

  return (
    <div ref={host} className={className} data-hero-mode={mode} data-hero-ready={ready || undefined}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[12%_8%_10%_14%] rounded-full bg-[radial-gradient(closest-side,rgba(56,107,255,0.26),rgba(134,93,255,0.08)_60%,transparent)] blur-2xl"
      />
      <HeroFallback2D
        canvases={canvases}
        className={cn(
          "transition-opacity duration-700",
          showFallback && canvases ? "opacity-100" : "opacity-0",
          mode === "webgl" && "pointer-events-none",
        )}
      />
      {mode === "webgl" && canvases && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <SceneBoundary onError={() => setMode("fallback")}>
            <HeroScene
              canvases={canvases}
              reducedMotion={reduce}
              active={visible}
              onReady={() => setReady(true)}
            />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
