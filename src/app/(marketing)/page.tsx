import * as React from "react";
import { HeroSection } from "@/components/screens/landing/hero-section";
import { ServicesSection } from "@/components/screens/landing/services-section";
import { PricingSection } from "@/components/screens/landing/pricing-section";
import { TrustAndReviewsSection } from "@/components/screens/landing/trust-reviews-section";
import { MissionAndCTASection } from "@/components/screens/landing/mission-cta-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <TrustAndReviewsSection />
      <MissionAndCTASection />
    </div>
  );
}
