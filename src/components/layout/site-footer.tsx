import Link from "next/link";
import { footerNav, site } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { ConceptBadge } from "./concept-badge";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="on-dark relative overflow-hidden bg-midnight text-haze-muted">
      <div aria-hidden className="hairline-dark absolute inset-x-0 top-0" />
      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="EVENTOS home" className="inline-flex rounded-lg">
              <Logo />
            </Link>
            <p className="mt-5 text-[0.95rem] leading-relaxed">{site.description}</p>
            <div className="mt-6">
              <ConceptBadge />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow text-haze-subtle">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[0.93rem] text-haze-muted transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-[0.8rem] text-haze-subtle sm:flex-row sm:items-start sm:justify-between">
          <p>
            © {site.copyrightYear} {site.name} concept. Fictional demonstration brand.
          </p>
          <p className="max-w-xl sm:text-right">{site.conceptNotice}</p>
        </div>
      </Container>

      {/* Oversized wordmark — quiet signature at the very end of every page */}
      <div aria-hidden className="pointer-events-none relative select-none overflow-hidden px-[2vw] [mask-image:linear-gradient(to_bottom,black_25%,transparent_95%)]">
        <svg viewBox="0 0 1000 170" className="block w-full" role="presentation">
          <text
            x="500"
            y="160"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            fill="rgba(255,255,255,0.05)"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 210, letterSpacing: "-0.03em" }}
          >
            EVENTOS
          </text>
        </svg>
      </div>
    </footer>
  );
}
