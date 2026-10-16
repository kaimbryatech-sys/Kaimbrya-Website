import type { Metadata } from "next";
import { PricingTeaser } from "@/components/blocks";
import { SignatureStory } from "@/components/SignatureStory";
import { Audiences, Community, Convergence, Credibility, FinalCta, Finance, GuestAccess, Hero, Operations, Roles } from "@/components/sections";

export const metadata: Metadata = {
  title: { absolute: "Kaimbrya · Community management, reimagined" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureStory />
      <Credibility />
      <Convergence />
      <Finance />
      <GuestAccess />
      <Roles />
      <Operations />
      <Community />
      <Audiences />
      <PricingTeaser />
      <FinalCta />
    </>
  );
}
