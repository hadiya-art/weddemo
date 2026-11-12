import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
import { site } from "@/config/site";
import { MotionProvider } from "@/components/motion-provider";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.descriptor} (Concept Demo)`,
    template: `%s · ${site.name} Concept`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "event management software",
    "catering software",
    "wedding planner software",
    "decorator software",
    "event operations",
    "concept demo",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: `${site.name} Concept`,
    title: `${site.name} — ${site.descriptor}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.descriptor}`,
    description: site.description,
  },
  // Concept demos should not be indexed until the client approves launch.
  robots: site.isConceptDemo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="min-h-dvh">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
