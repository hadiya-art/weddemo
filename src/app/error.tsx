"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusShell } from "@/components/pages/status-shell";

export default function Error({ error, retry }: { error: unknown; reset: () => void; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error && typeof error === "object" && "digest" in error && typeof error.digest === "string" ? error.digest : null;

  return (
    <StatusShell
      code="500"
      eyebrow="Cue missed"
      title={
        <>
          Something went <span className="accent-serif text-gradient pr-1">off-script</span>.
        </>
      }
      description={
        <>
          <p>An unexpected error interrupted this page. Trying again usually gets the show back on track.</p>
          {digest && <p className="mt-3 font-mono text-[0.75rem] text-haze-subtle">Reference: {digest}</p>}
        </>
      }
      actions={
        <>
          <Button size="lg" onClick={() => retry()}>
            <RotateCcw aria-hidden className="size-4" />
            Try again
          </Button>
          <ButtonLink href="/" size="lg" variant="secondary">
            Back to home
          </ButtonLink>
        </>
      }
    />
  );
}
