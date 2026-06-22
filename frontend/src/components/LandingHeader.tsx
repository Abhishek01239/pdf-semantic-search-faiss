import React from "react";

interface LandingHeaderProps {
  onNavigateToDashboard: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigateToDashboard }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-background/80 backdrop-blur-md flex items-center justify-between px-md border-b border-outline-variant">
      <div className="flex items-center gap-base">
        <span className="font-display text-[20px] font-semibold text-primary">
          PDF Semantic Search
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-lg">
        <a className="font-mono text-[12px] uppercase text-primary tracking-wider" href="#home">
          Home
        </a>
        <a
          className="font-mono text-[12px] uppercase text-on-surface-variant hover:text-primary transition-colors tracking-wider"
          href="#features"
        >
          Features
        </a>
        <a
          className="font-mono text-[12px] uppercase text-on-surface-variant hover:text-primary transition-colors tracking-wider"
          href="#pricing"
        >
          Pricing
        </a>
        <a
          className="font-mono text-[12px] uppercase text-on-surface-variant hover:text-primary transition-colors tracking-wider"
          href="#security"
        >
          Security
        </a>
      </nav>
      <div className="flex items-center gap-md">
        <button
          onClick={onNavigateToDashboard}
          className="bg-primary text-background px-md py-[6px] rounded font-mono uppercase text-[12px] hover:opacity-90 transition-opacity font-medium"
        >
          Launch Console
        </button>
      </div>
    </header>
  );
};
