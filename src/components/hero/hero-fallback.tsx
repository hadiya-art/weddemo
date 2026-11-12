"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { PLACEMENTS, WORLD, panelSize } from "./layout";
import type { PanelCanvases } from "./use-panel-canvases";

/**
 * 2D fallback for devices without WebGL (or when 3D fails).
 * Uses the very same drawn panels, arranged with CSS 3D transforms.
 */
export function HeroFallback2D({ canvases, className }: { canvases: PanelCanvases | null; className?: string }) {
  return (
    <div className={cn("absolute inset-0 [perspective:1800px]", className)} aria-hidden>
      <div className="absolute inset-[6%] [transform-style:preserve-3d] [transform:rotateY(-15deg)_rotateX(7deg)]">
        {PLACEMENTS.map((p) => {
          const [w, h] = panelSize(p.id);
          const left = ((p.pos[0] - w / 2 + WORLD.halfW) / (WORLD.halfW * 2)) * 100;
          const top = ((WORLD.halfH - (p.pos[1] + h / 2)) / (WORLD.halfH * 2)) * 100;
          return (
            <div
              key={p.id}
              className="absolute rounded-[3%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.06)]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${(w / (WORLD.halfW * 2)) * 100}%`,
                aspectRatio: `${w} / ${h}`,
                transform: `translateZ(${p.pos[2] * 70}px)`,
              }}
            >
              {canvases ? <CanvasSlot canvas={canvases[p.id]} /> : <div className="size-full rounded-[inherit] bg-white/[0.04]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CanvasSlot({ canvas }: { canvas: HTMLCanvasElement }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // Clone so the same source canvas can also feed WebGL textures.
    const c = document.createElement("canvas");
    c.width = canvas.width;
    c.height = canvas.height;
    c.getContext("2d")?.drawImage(canvas, 0, 0);
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.display = "block";
    host.appendChild(c);
    return () => {
      host.removeChild(c);
    };
  }, [canvas]);
  return <div ref={ref} className="size-full overflow-hidden rounded-[inherit]" />;
}
