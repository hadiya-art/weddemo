"use client";

import { useEffect, useState } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { PANELS, renderPanel, type PanelId } from "./panel-textures";

export type PanelCanvases = Record<PanelId, HTMLCanvasElement>;

/** Draw every panel once fonts are ready. Shared by the 3D scene and 2D fallback. */
export function usePanelCanvases(): PanelCanvases | null {
  const [canvases, setCanvases] = useState<PanelCanvases | null>(null);

  useEffect(() => {
    let cancelled = false;
    const sans = GeistSans.style.fontFamily;
    const mono = GeistMono.style.fontFamily;
    const loads = [
      `400 16px ${sans}`,
      `500 16px ${sans}`,
      `600 16px ${sans}`,
      `500 16px ${mono}`,
    ].map((f) => document.fonts.load(f).catch(() => []));
    // Never block on fonts for more than 1.5s.
    const timeout = new Promise((r) => setTimeout(r, 1500));
    Promise.race([Promise.all(loads), timeout]).then(() => {
      if (cancelled) return;
      const fonts = { sans, mono };
      const out = {} as PanelCanvases;
      (Object.keys(PANELS) as PanelId[]).forEach((id) => {
        out[id] = renderPanel(PANELS[id], fonts);
      });
      setCanvases(out);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return canvases;
}
