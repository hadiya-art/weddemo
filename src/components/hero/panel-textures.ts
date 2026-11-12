/**
 * Procedurally drawn software panels for the 3D hero.
 * Everything is drawn with the Canvas 2D API so there are no image assets to
 * download, the UI stays crisp at any DPR, and copy can be edited in code.
 * All figures are fictional sample data; quotation math is internally correct.
 */

export type PanelSpec = {
  id: string;
  /** logical px; texture is drawn at SCALE× for crispness */
  w: number;
  h: number;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, f: Fonts) => void;
};

export type Fonts = { sans: string; mono: string };

const SCALE = 2.5;

const C = {
  midnight: "#0b1020",
  panelDark: "#0f1527",
  panelDark2: "#151c31",
  lineDark: "rgba(255,255,255,0.08)",
  textDark: "#f5f7fb",
  mutedDark: "#9aa4bd",
  subtleDark: "#6b7592",
  white: "#ffffff",
  mist: "#f5f7fb",
  line: "#e6e9f1",
  ink: "#0b1020",
  inkMuted: "#5a6378",
  inkSubtle: "#8890a3",
  blue: "#386bff",
  blueSoft: "rgba(56,107,255,0.12)",
  violet: "#865dff",
  green: "#12a26b",
  greenSoft: "rgba(18,162,107,0.12)",
  amber: "#c98a1b",
  amberSoft: "rgba(201,138,27,0.14)",
  rose: "#e0566b",
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  opts: { size: number; weight?: number; color: string; family: string; align?: CanvasTextAlign; track?: number },
) {
  ctx.font = `${opts.weight ?? 400} ${opts.size}px ${opts.family}`;
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align ?? "left";
  ctx.textBaseline = "alphabetic";
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${opts.track ?? 0}px`;
  }
  ctx.fillText(s, x, y);
}

function pill(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  bg: string,
  fg: string,
  f: Fonts,
  size = 11,
) {
  ctx.font = `600 ${size}px ${f.sans}`;
  const w = ctx.measureText(label).width + 18;
  rr(ctx, x, y, w, size + 11, (size + 11) / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  text(ctx, label, x + 9, y + size + 4, { size, weight: 600, color: fg, family: f.sans });
  return w;
}

function panelBase(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean, r = 26) {
  rr(ctx, 0, 0, w, h, r);
  if (dark) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#131a30");
    g.addColorStop(1, "#0c1222");
    ctx.fillStyle = g;
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#f7f8fc");
    ctx.fillStyle = g;
  }
  ctx.fill();
  ctx.save();
  rr(ctx, 0.75, 0.75, w - 1.5, h - 1.5, r);
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.10)" : "rgba(11,16,32,0.08)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function vegMark(ctx: CanvasRenderingContext2D, x: number, y: number, veg: boolean) {
  ctx.save();
  ctx.strokeStyle = veg ? C.green : "#a2432f";
  ctx.lineWidth = 1.4;
  ctx.strokeRect(x, y, 11, 11);
  ctx.fillStyle = veg ? C.green : "#a2432f";
  ctx.beginPath();
  if (veg) ctx.arc(x + 5.5, y + 5.5, 2.6, 0, Math.PI * 2);
  else {
    ctx.moveTo(x + 5.5, y + 2.4);
    ctx.lineTo(x + 8.8, y + 8.4);
    ctx.lineTo(x + 2.2, y + 8.4);
  }
  ctx.fill();
  ctx.restore();
}

/* ─────────────────────────── Overview dashboard ─────────────────────────── */
const overview: PanelSpec = {
  id: "overview",
  w: 880,
  h: 560,
  draw(ctx, w, h, f) {
    panelBase(ctx, w, h, true, 30);

    // Sidebar
    ctx.save();
    rr(ctx, 0, 0, 74, h, 30);
    ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.025)";
    ctx.fillRect(0, 0, 74, h);
    ctx.restore();
    ctx.fillStyle = C.lineDark;
    ctx.fillRect(74, 0, 1, h);
    // logo
    rr(ctx, 21, 24, 32, 32, 9);
    const lg = ctx.createLinearGradient(21, 24, 53, 56);
    lg.addColorStop(0, "#5b86ff");
    lg.addColorStop(1, C.violet);
    ctx.fillStyle = lg;
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      rr(ctx, 25, 90 + i * 46, 24, 24, 7);
      ctx.fillStyle = i === 0 ? C.blue : "rgba(255,255,255,0.07)";
      ctx.fill();
      if (i === 0) {
        ctx.fillStyle = "rgba(56,107,255,0.25)";
        rr(ctx, 15, 82 + i * 46, 44, 40, 11);
        ctx.fill();
        rr(ctx, 25, 90 + i * 46, 24, 24, 7);
        ctx.fillStyle = C.blue;
        ctx.fill();
      }
    }

    const x0 = 104;
    text(ctx, "Overview", x0, 62, { size: 26, weight: 600, color: C.textDark, family: f.sans, track: -0.6 });
    text(ctx, "WED · 16 DEC 2026 · WEDDING SEASON", x0, 88, {
      size: 11,
      weight: 500,
      color: C.subtleDark,
      family: f.mono,
      track: 1.4,
    });
    pill(ctx, "● Sample data", w - 160, 44, "rgba(255,255,255,0.06)", C.mutedDark, f, 11);

    // KPI tiles
    const kpis = [
      { k: "Events this month", v: "24", d: "8 this week" },
      { k: "Confirmed bookings", v: "18", d: "3 awaiting advance" },
      { k: "Open quotations", v: "₹48.6L", d: "11 quotations" },
    ];
    const kw = (w - x0 - 30 - 2 * 16) / 3;
    kpis.forEach((kp, i) => {
      const x = x0 + i * (kw + 16);
      rr(ctx, x, 112, kw, 104, 18);
      ctx.fillStyle = "rgba(255,255,255,0.035)";
      ctx.fill();
      ctx.strokeStyle = C.lineDark;
      ctx.lineWidth = 1;
      ctx.stroke();
      text(ctx, kp.k, x + 18, 142, { size: 13, color: C.mutedDark, family: f.sans });
      text(ctx, kp.v, x + 18, 184, { size: 32, weight: 600, color: C.textDark, family: f.sans, track: -1 });
      text(ctx, kp.d, x + 18, 204, { size: 11.5, color: C.subtleDark, family: f.sans });
    });

    // Chart card
    const cy = 236;
    const cw = 430;
    rr(ctx, x0, cy, cw, h - cy - 30, 18);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fill();
    ctx.strokeStyle = C.lineDark;
    ctx.stroke();
    text(ctx, "Bookings by month", x0 + 20, cy + 34, { size: 14, weight: 600, color: C.textDark, family: f.sans });
    text(ctx, "Jul – Feb", x0 + cw - 20, cy + 34, { size: 12, color: C.subtleDark, family: f.sans, align: "right" });
    const bars = [9, 7, 11, 16, 22, 26, 24, 19];
    const months = ["J", "A", "S", "O", "N", "D", "J", "F"];
    const chartH = 170;
    const baseY = cy + 66 + chartH;
    const bw = 30;
    const gap = (cw - 40 - bars.length * bw) / (bars.length - 1);
    // gridlines
    for (let g = 0; g < 4; g++) {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(x0 + 20, baseY - (g * chartH) / 3, cw - 40, 1);
    }
    bars.forEach((b, i) => {
      const bh = (b / 28) * chartH;
      const bx = x0 + 20 + i * (bw + gap);
      const grad = ctx.createLinearGradient(0, baseY - bh, 0, baseY);
      if (i === 5) {
        grad.addColorStop(0, "#9d7bff");
        grad.addColorStop(1, "rgba(134,93,255,0.35)");
      } else {
        grad.addColorStop(0, "rgba(91,134,255,0.95)");
        grad.addColorStop(1, "rgba(56,107,255,0.18)");
      }
      rr(ctx, bx, baseY - bh, bw, bh, 7);
      ctx.fillStyle = grad;
      ctx.fill();
      text(ctx, months[i], bx + bw / 2, baseY + 20, {
        size: 11,
        color: C.subtleDark,
        family: f.mono,
        align: "center",
      });
    });

    // Upcoming list
    const lx = x0 + cw + 16;
    const lw = w - lx - 30;
    rr(ctx, lx, cy, lw, h - cy - 30, 18);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fill();
    ctx.strokeStyle = C.lineDark;
    ctx.stroke();
    text(ctx, "Upcoming", lx + 20, cy + 34, { size: 14, weight: 600, color: C.textDark, family: f.sans });
    const rows = [
      { n: "Mehta Sangeet", m: "18 Dec · 320 guests", c: C.violet, s: "Confirmed", ok: true },
      { n: "Rao–Iyer Reception", m: "19 Dec · 450 guests", c: C.blue, s: "Confirmed", ok: true },
      { n: "Northwind Offsite", m: "21 Dec · 120 guests", c: "#3fb9c9", s: "Tentative", ok: false },
      { n: "Kapoor Mehendi", m: "23 Dec · 180 guests", c: "#e39b4f", s: "Confirmed", ok: true },
    ];
    rows.forEach((r, i) => {
      const ry = cy + 58 + i * 58;
      ctx.fillStyle = r.c;
      rr(ctx, lx + 20, ry + 6, 4, 34, 2);
      ctx.fill();
      text(ctx, r.n, lx + 36, ry + 20, { size: 13.5, weight: 600, color: C.textDark, family: f.sans });
      text(ctx, r.m, lx + 36, ry + 38, { size: 11.5, color: C.mutedDark, family: f.sans });
      ctx.font = `600 10.5px ${f.sans}`;
      const pw = ctx.measureText(r.s).width + 18;
      pill(
        ctx,
        r.s,
        lx + lw - 20 - pw,
        ry + 10,
        r.ok ? "rgba(18,162,107,0.16)" : "rgba(201,138,27,0.18)",
        r.ok ? "#4fd3a0" : "#f0b85a",
        f,
        10.5,
      );
    });
  },
};

/* ─────────────────────────────── Calendar ─────────────────────────────── */
const calendar: PanelSpec = {
  id: "calendar",
  w: 400,
  h: 372,
  draw(ctx, w, h, f) {
    panelBase(ctx, w, h, false, 24);
    text(ctx, "December 2026", 26, 46, { size: 19, weight: 600, color: C.ink, family: f.sans, track: -0.4 });
    // arrows
    [w - 74, w - 42].forEach((x, i) => {
      rr(ctx, x, 26, 26, 26, 8);
      ctx.fillStyle = C.mist;
      ctx.fill();
      ctx.strokeStyle = C.inkMuted;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const cx = x + 13;
      if (i === 0) {
        ctx.moveTo(cx + 2, 34);
        ctx.lineTo(cx - 3, 39);
        ctx.lineTo(cx + 2, 44);
      } else {
        ctx.moveTo(cx - 2, 34);
        ctx.lineTo(cx + 3, 39);
        ctx.lineTo(cx - 2, 44);
      }
      ctx.stroke();
    });
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const cell = (w - 52) / 7;
    days.forEach((d, i) =>
      text(ctx, d, 26 + i * cell + cell / 2, 88, {
        size: 11,
        weight: 500,
        color: C.inkSubtle,
        family: f.mono,
        align: "center",
      }),
    );
    // Dec 2026 starts on Tuesday
    const start = 1;
    const events: Record<number, string[]> = {
      4: [C.blue],
      5: [C.violet, C.blue],
      11: ["#e39b4f"],
      12: [C.blue, C.violet],
      13: [C.violet],
      18: [C.violet],
      19: [C.blue, "#e39b4f"],
      21: ["#3fb9c9"],
      23: ["#e39b4f"],
      26: [C.blue, C.violet],
      27: [C.blue],
      31: ["#3fb9c9"],
    };
    for (let d = 1; d <= 31; d++) {
      const idx = start + d - 1;
      const col = idx % 7;
      const row = Math.floor(idx / 7);
      const cx = 26 + col * cell + cell / 2;
      const cy = 120 + row * 46;
      if (d === 16) {
        ctx.beginPath();
        ctx.arc(cx, cy - 5, 16, 0, Math.PI * 2);
        ctx.fillStyle = C.blue;
        ctx.fill();
      }
      text(ctx, String(d), cx, cy, {
        size: 13,
        weight: d === 16 ? 600 : 500,
        color: d === 16 ? C.white : col >= 5 ? C.inkMuted : C.ink,
        family: f.sans,
        align: "center",
      });
      const ev = events[d];
      if (ev) {
        ev.forEach((c, i) => {
          ctx.beginPath();
          ctx.arc(cx - (ev.length - 1) * 3.5 + i * 7, cy + 14, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.fill();
        });
      }
    }
  },
};

/* ─────────────────────────────── Booking ─────────────────────────────── */
const booking: PanelSpec = {
  id: "booking",
  w: 420,
  h: 214,
  draw(ctx, w, h, f) {
    panelBase(ctx, w, h, true, 24);
    text(ctx, "BOOKING · EV-2412", 26, 40, { size: 11, weight: 500, color: C.subtleDark, family: f.mono, track: 1.4 });
    pill(ctx, "Confirmed", w - 120, 22, "rgba(18,162,107,0.16)", "#4fd3a0", f, 11);
    text(ctx, "Rao–Iyer Wedding Reception", 26, 78, {
      size: 20,
      weight: 600,
      color: C.textDark,
      family: f.sans,
      track: -0.4,
    });
    text(ctx, "19 Dec · Lotus Courtyard · 450 guests", 26, 104, { size: 13, color: C.mutedDark, family: f.sans });
    text(ctx, "Planning progress", 26, 146, { size: 12, color: C.mutedDark, family: f.sans });
    text(ctx, "72%", w - 26, 146, { size: 12, weight: 600, color: C.textDark, family: f.sans, align: "right" });
    rr(ctx, 26, 156, w - 52, 7, 4);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fill();
    const pg = ctx.createLinearGradient(26, 0, 26 + (w - 52) * 0.72, 0);
    pg.addColorStop(0, C.blue);
    pg.addColorStop(1, C.violet);
    rr(ctx, 26, 156, (w - 52) * 0.72, 7, 4);
    ctx.fillStyle = pg;
    ctx.fill();
    const av = ["#5b86ff", "#865dff", "#e39b4f", "#3fb9c9"];
    const ini = ["AR", "VK", "SM", "+5"];
    av.forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(40 + i * 22, 188, 13, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.strokeStyle = "#111830";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      text(ctx, ini[i], 40 + i * 22, 192, { size: 9.5, weight: 600, color: "#fff", family: f.sans, align: "center" });
    });
    text(ctx, "Team assigned", 136, 192, { size: 12, color: C.mutedDark, family: f.sans });
  },
};

/* ─────────────────────────────── Menu card ─────────────────────────────── */
const menu: PanelSpec = {
  id: "menu",
  w: 340,
  h: 404,
  draw(ctx, w, h, f) {
    panelBase(ctx, w, h, false, 24);
    text(ctx, "MENU · RECEPTION DINNER", 24, 38, { size: 10.5, weight: 500, color: C.inkSubtle, family: f.mono, track: 1.3 });
    text(ctx, "Signature menu", 24, 70, { size: 20, weight: 600, color: C.ink, family: f.sans, track: -0.4 });
    const sections: { t: string; items: [string, boolean, string][] }[] = [
      {
        t: "Starters",
        items: [
          ["Tandoori paneer tikka", true, "₹160"],
          ["Amritsari fish fry", false, "₹210"],
          ["Corn & spinach galouti", true, "₹140"],
        ],
      },
      {
        t: "Mains",
        items: [
          ["Dal makhani", true, "₹120"],
          ["Subz dum biryani", true, "₹180"],
          ["Laal maas", false, "₹260"],
        ],
      },
      { t: "Dessert", items: [["Gulab jamun, rabri", true, "₹170"]] },
    ];
    let y = 104;
    sections.forEach((s) => {
      text(ctx, s.t.toUpperCase(), 24, y, { size: 10, weight: 600, color: C.blue, family: f.mono, track: 1.2 });
      y += 22;
      s.items.forEach(([n, v, p]) => {
        vegMark(ctx, 24, y - 10, v);
        text(ctx, n, 44, y, { size: 13, weight: 500, color: C.ink, family: f.sans });
        text(ctx, p, w - 24, y, { size: 12.5, color: C.inkMuted, family: f.sans, align: "right" });
        y += 26;
      });
      y += 8;
    });
    ctx.fillStyle = C.line;
    ctx.fillRect(24, h - 62, w - 48, 1);
    text(ctx, "Per plate", 24, h - 30, { size: 13, color: C.inkMuted, family: f.sans });
    text(ctx, "₹1,240", w - 24, h - 28, { size: 20, weight: 600, color: C.ink, family: f.sans, align: "right", track: -0.4 });
  },
};

/* ─────────────────────────────── Quotation ─────────────────────────────── */
// 450 × ₹1,240 = ₹5,58,000 · décor ₹1,85,000 · staff ₹42,000 → ₹7,85,000
// discount 5% = ₹39,250 → taxable ₹7,45,750 · GST 18% = ₹1,34,235 → ₹8,79,985
const quotation: PanelSpec = {
  id: "quotation",
  w: 380,
  h: 352,
  draw(ctx, w, h, f) {
    panelBase(ctx, w, h, false, 24);
    text(ctx, "QUOTATION · Q-1048", 24, 38, { size: 10.5, weight: 500, color: C.inkSubtle, family: f.mono, track: 1.3 });
    pill(ctx, "Draft", w - 76, 20, C.amberSoft, C.amber, f, 10.5);
    text(ctx, "Rao–Iyer Reception", 24, 70, { size: 19, weight: 600, color: C.ink, family: f.sans, track: -0.4 });
    const lines: [string, string, string?][] = [
      ["Catering · 450 × ₹1,240", "₹5,58,000"],
      ["Décor · Signature package", "₹1,85,000"],
      ["Service staff · 14", "₹42,000"],
      ["Discount 5%", "−₹39,250", C.green],
      ["GST 18% (illustrative)", "₹1,34,235"],
    ];
    let y = 108;
    lines.forEach(([l, v, c]) => {
      text(ctx, l, 24, y, { size: 13, color: C.inkMuted, family: f.sans });
      text(ctx, v, w - 24, y, { size: 13, weight: 500, color: c ?? C.ink, family: f.sans, align: "right" });
      y += 30;
    });
    ctx.fillStyle = C.line;
    ctx.fillRect(24, y - 8, w - 48, 1);
    text(ctx, "Total", 24, y + 26, { size: 14, weight: 600, color: C.ink, family: f.sans });
    text(ctx, "₹8,79,985", w - 24, y + 28, { size: 24, weight: 600, color: C.ink, family: f.sans, align: "right", track: -0.6 });
    rr(ctx, 24, h - 58, w - 48, 38, 19);
    const bg = ctx.createLinearGradient(24, 0, w - 24, 0);
    bg.addColorStop(0, "#2f5ef0");
    bg.addColorStop(1, "#5a6dff");
    ctx.fillStyle = bg;
    ctx.fill();
    text(ctx, "Send to client", w / 2, h - 34, { size: 13, weight: 600, color: "#fff", family: f.sans, align: "center" });
  },
};

/* ─────────────────────────────── Toast ─────────────────────────────── */
const toast: PanelSpec = {
  id: "toast",
  w: 330,
  h: 84,
  draw(ctx, w, h, f) {
    panelBase(ctx, w, h, false, 20);
    ctx.beginPath();
    ctx.arc(40, h / 2, 17, 0, Math.PI * 2);
    ctx.fillStyle = C.greenSoft;
    ctx.fill();
    ctx.strokeStyle = C.green;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(32, h / 2);
    ctx.lineTo(38, h / 2 + 6);
    ctx.lineTo(48, h / 2 - 5);
    ctx.stroke();
    text(ctx, "Décor team checked in", 70, 37, { size: 14, weight: 600, color: C.ink, family: f.sans });
    text(ctx, "Lotus Courtyard · Gate 2 · just now", 70, 57, { size: 12, color: C.inkMuted, family: f.sans });
  },
};

export const PANELS = { overview, calendar, booking, menu, quotation, toast };
export type PanelId = keyof typeof PANELS;

export function renderPanel(spec: PanelSpec, fonts: Fonts): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(spec.w * SCALE);
  canvas.height = Math.round(spec.h * SCALE);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(SCALE, SCALE);
  spec.draw(ctx, spec.w, spec.h, fonts);
  return canvas;
}
