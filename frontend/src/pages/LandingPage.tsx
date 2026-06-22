import React from "react";
import { ReactLenis } from "lenis/react";
import { LandingHeader } from "../components/LandingHeader";
import { LandingHero } from "../components/LandingHero";
import { HowItWorks } from "../components/HowItWorks";
import { FeaturesGrid } from "../components/FeaturesGrid";
import { SecurityInfo } from "../components/SecurityInfo";
import { Pricing } from "../components/Pricing";
import { LandingFooter } from "../components/LandingFooter";

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard }) => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen bg-background text-on-background font-body relative overflow-x-hidden">
        <LandingHeader onNavigateToDashboard={onNavigateToDashboard} />
        <LandingHero onNavigateToDashboard={onNavigateToDashboard} />
        <HowItWorks />
        <FeaturesGrid />
        <SecurityInfo />
        <Pricing onNavigateToDashboard={onNavigateToDashboard} />
        <LandingFooter />
      </div>
    </ReactLenis>
  );
};
