"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole
 * document, so it ships its own <html>/<body> and inline styles (global CSS
 * and fonts may not be available here).
 */
export default function GlobalError({ error, retry }: { error: unknown; reset: () => void; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <head>
        <title>Something went wrong · EVENTOS Concept</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(56,107,255,0.28), transparent 70%), radial-gradient(ellipse 40% 40% at 80% 10%, rgba(134,93,255,0.18), transparent 70%), #0b1020",
          color: "#f5f7fb",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main style={{ maxWidth: 520, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#a7b0c6",
              margin: 0,
            }}
          >
            EVENTOS · Concept Demo
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 2.8rem)", lineHeight: 1.08, letterSpacing: "-0.035em", margin: "20px 0 0", fontWeight: 600 }}>
            The show hit an unexpected pause.
          </h1>
          <p style={{ color: "#a7b0c6", fontSize: 17, lineHeight: 1.6, margin: "16px 0 0" }}>
            Something went wrong while loading the site. Please try again.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                height: 48,
                padding: "0 24px",
                borderRadius: 999,
                border: 0,
                background: "#2f5ef0",
                color: "#fff",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* A full page load is intended here: the app shell itself failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                height: 48,
                padding: "0 24px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                color: "#fff",
                textDecoration: "none",
                fontSize: 16,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
              }}
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
