import type { PanelId } from "./panel-textures";
import { PANELS } from "./panel-textures";

/** World units per logical texture pixel. */
export const PX = 1 / 200;

export type PanelPlacement = {
  id: PanelId;
  pos: [number, number, number];
  rot: [number, number, number];
  dark: boolean;
  /** stagger order for the intro */
  order: number;
};

/** Composition shared by the WebGL scene and the 2D fallback. */
export const PLACEMENTS: PanelPlacement[] = [
  { id: "overview", pos: [0, 0.05, 0], rot: [0, 0, 0], dark: true, order: 0 },
  { id: "calendar", pos: [-2.55, 1.0, 0.7], rot: [0, 0.1, 0.02], dark: false, order: 2 },
  { id: "booking", pos: [2.45, 1.38, 0.9], rot: [0, -0.08, -0.015], dark: true, order: 1 },
  { id: "menu", pos: [-2.3, -1.05, 1.2], rot: [0, 0.12, -0.02], dark: false, order: 3 },
  { id: "quotation", pos: [2.5, -0.95, 1.35], rot: [0, -0.1, 0.015], dark: false, order: 4 },
  { id: "toast", pos: [0.25, -1.82, 1.75], rot: [0, 0, 0], dark: false, order: 5 },
];

export function panelSize(id: PanelId): [number, number] {
  const p = PANELS[id];
  return [p.w * PX, p.h * PX];
}

/** Extents of the composition, used for responsive camera fitting + 2D mapping. */
export const WORLD = { halfW: 4.45, halfH: 2.75 };
