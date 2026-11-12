import { Hero } from "@/components/hero/hero";
import { Problems } from "@/components/home/problems";
import { Audiences } from "@/components/home/audiences";
import { Modules } from "@/components/home/modules";
import { Showcase } from "@/components/home/showcase";
import { Benefits } from "@/components/home/benefits";
import { HowItWorks } from "@/components/home/how-it-works";
import { HomeFaq } from "@/components/home/home-faq";
import { FinalCta } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <Audiences />
      <Modules />
      <Showcase />
      <Benefits />
      <HowItWorks />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
