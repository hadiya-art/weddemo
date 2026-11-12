import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.descriptor} (Concept Demo)`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Original share image: midnight canvas, wordmark, soft blue/violet light. No external fonts. */
export default function OpengraphImage() {
  const modules = ["Admin", "Staff", "Manager", "Customer"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0b1020",
          backgroundImage:
            "radial-gradient(ellipse 55% 60% at 85% 0%, rgba(56,107,255,0.45), transparent 70%), radial-gradient(ellipse 45% 55% at 100% 70%, rgba(134,93,255,0.28), transparent 70%), linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 64px 64px, 64px 64px",
          color: "#f5f7fb",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: mark + wordmark + concept badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#0e1428",
                border: "1.5px solid rgba(255,255,255,0.14)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 6,
                padding: "0 14px",
              }}
            >
              <div style={{ height: 9, width: 36, borderRadius: 5, background: "linear-gradient(90deg,#5b86ff,#865dff)" }} />
              <div style={{ height: 9, width: 24, borderRadius: 5, background: "linear-gradient(90deg,#386bff,#6f7dff)" }} />
              <div style={{ height: 9, width: 36, borderRadius: 5, background: "#f5f7fb" }} />
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "0.16em" }}>{site.wordmark}</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              fontSize: 18,
              letterSpacing: "0.14em",
              color: "#a7b0c6",
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#865dff" }} />
            {site.conceptLabel}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
            {site.descriptor}
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#a7b0c6", marginTop: 18, letterSpacing: "-0.02em" }}>
            — Concept Demo for caterers, decorators & planners
          </div>
        </div>

        {/* Bottom: module pills + note */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {modules.map((m, i) => (
              <div
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 20px",
                  borderRadius: 14,
                  background: i === 0 ? "rgba(56,107,255,0.22)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === 0 ? "rgba(142,169,255,0.45)" : "rgba(255,255,255,0.1)"}`,
                  fontSize: 22,
                  color: "#f5f7fb",
                }}
              >
                <span style={{ color: "#8ea9ff", fontSize: 16 }}>{`0${i + 1}`}</span>
                {m}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 18, color: "#8a94ad" }}>Fictional brand · illustrative only</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
