import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { LostVenueVisual, StatusShell } from "@/components/pages/status-shell";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <StatusShell
      code="404"
      eyebrow="Venue not found"
      title={
        <>
          This page has <span className="accent-serif text-gradient pr-1">left</span> the venue.
        </>
      }
      description={
        <p>
          The link may be old, or the address mistyped. The run-of-show continues elsewhere — pick up from one of these
          cues.
        </p>
      }
      actions={
        <>
          <ButtonLink href="/" size="lg" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/demo" size="lg" variant="secondary">
            Explore the demo
          </ButtonLink>
          <ButtonLink href="/solutions" size="lg" variant="secondary">
            View solutions
          </ButtonLink>
        </>
      }
      visual={<LostVenueVisual />}
    />
  );
}
