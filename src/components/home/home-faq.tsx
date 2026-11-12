import { FaqAccordion } from "@/components/pages/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { faqs, homeFaqIds } from "@/content/faq";

export function HomeFaq() {
  const items = homeFaqIds.map((id) => faqs.find((f) => f.id === id)!).filter(Boolean);
  return (
    <section aria-labelledby="faq-title" className="bg-white py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="FAQ"
            index="07"
            title={<span id="faq-title">Questions, answered honestly.</span>}
            description="What this concept is, what the demo does — and what it doesn’t."
          />
          <ButtonLink href="/faq" variant="outline" className="mt-8" arrow>
            See all questions
          </ButtonLink>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={items} defaultOpenId="what-is" />
        </div>
      </Container>
    </section>
  );
}
