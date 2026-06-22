import React from "react";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full py-lg bg-background border-t border-outline-variant mt-xl">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center px-gutter gap-lg">
        <div className="flex flex-col items-center md:items-start text-left">
          <span className="font-display text-[18px] text-primary mb-xs font-bold">PDF AI</span>
          <p className="font-mono text-[11px] text-on-surface-variant">
            © {new Date().getFullYear()} Semantic AI Research Corp.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-md">
          <a className="text-[12px] text-on-surface-variant hover:text-primary transition-colors" href="#privacy">
            Privacy Policy
          </a>
          <a className="text-[12px] text-on-surface-variant hover:text-primary transition-colors" href="#terms">
            Terms of Service
          </a>
          <a className="text-[12px] text-on-surface-variant hover:text-primary transition-colors" href="#api">
            API Documentation
          </a>
        </div>
        <div className="flex gap-md text-on-surface-variant">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
            language
          </span>
          <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
            share
          </span>
        </div>
      </div>
    </footer>
  );
};
