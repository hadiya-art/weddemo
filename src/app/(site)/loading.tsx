import { Container } from "@/components/ui/primitives";

/** Route-level skeleton: mirrors the dark hero + light content rhythm of every page. */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <section className="on-dark noise relative isolate overflow-hidden bg-midnight pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div aria-hidden className="grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -z-10 h-[30rem] w-[44rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(56_107_255/0.35),transparent)] blur-[110px]"
        />
        <Container>
          <div aria-hidden className="max-w-3xl">
            <Bar dark className="h-3 w-28" />
            <Bar dark className="mt-8 h-12 w-[85%] sm:h-16" />
            <Bar dark className="mt-3 h-12 w-[60%] sm:h-16" />
            <Bar dark className="mt-8 h-4 w-[70%]" />
            <Bar dark className="mt-3 h-4 w-[55%]" />
            <div className="mt-10 flex gap-3">
              <Bar dark className="h-12 w-40 rounded-full" />
              <Bar dark className="h-12 w-32 rounded-full" />
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-mist py-20">
        <Container>
          <div aria-hidden className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-ink/[0.06]">
                <div className="skeleton size-9 rounded-lg" />
                <div className="skeleton mt-6 h-4 w-1/2 rounded-full" />
                <div className="skeleton mt-4 h-3 w-full rounded-full" />
                <div className="skeleton mt-2 h-3 w-4/5 rounded-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

function Bar({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <div
      className={`rounded-lg ${dark ? "animate-shimmer bg-[linear-gradient(90deg,rgb(255_255_255/0.05)_0%,rgb(255_255_255/0.11)_50%,rgb(255_255_255/0.05)_100%)] bg-[length:200%_100%]" : "skeleton"} ${className ?? ""}`}
    />
  );
}
