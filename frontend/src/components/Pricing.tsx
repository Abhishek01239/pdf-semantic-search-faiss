import React from "react";

interface PricingProps {
  onNavigateToDashboard: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigateToDashboard }) => {
  return (
    <section id="pricing" className="py-xl">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className="text-center mb-lg">
          <h2 className="font-display text-[32px] text-primary mb-sm font-semibold tracking-tight">
            Choose Your Intelligence Level
          </h2>
          <p className="text-on-surface-variant text-[15px]">
            Simple, transparent pricing for teams of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-[960px] mx-auto">
          {/* Basic */}
          <div className="p-lg border border-outline-variant bg-surface-container-lowest/30 rounded-xl flex flex-col justify-between text-left">
            <div>
              <div className="font-mono text-[11px] text-on-surface-variant mb-sm uppercase tracking-wider">
                Personal
              </div>
              <div className="text-[36px] font-bold text-primary mb-md">
                $0<span className="text-[14px] font-normal text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-sm mb-lg text-[13px] text-on-surface-variant">
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> 5 PDFs per month
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Basic semantic search
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> AI chat interface
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="w-full border border-outline py-[8px] font-mono text-[11px] uppercase hover:bg-surface-container-low transition-all rounded tracking-wider text-primary"
            >
              Start Free
            </button>
          </div>
          
          {/* Pro */}
          <div className="p-lg border-2 border-primary bg-surface-container-lowest/60 rounded-xl relative flex flex-col justify-between shadow-xl text-left">
            <div className="absolute -top-3 right-4 bg-primary text-background px-sm py-[2px] font-mono text-[9px] uppercase font-bold tracking-wider rounded">
              Most Popular
            </div>
            <div>
              <div className="font-mono text-[11px] text-on-surface-variant mb-sm uppercase tracking-wider">
                Pro
              </div>
              <div className="text-[36px] font-bold text-primary mb-md">
                $49<span className="text-[14px] font-normal text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-sm mb-lg text-[13px] text-on-surface-variant">
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> 500 PDFs per month
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Advanced vector indexing
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Knowledge Graph access
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> API Access
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="w-full bg-primary text-background py-[8px] font-mono text-[11px] uppercase hover:opacity-90 transition-opacity rounded font-bold tracking-wider"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="p-lg border border-outline-variant bg-surface-container-lowest/30 rounded-xl flex flex-col justify-between text-left">
            <div>
              <div className="font-mono text-[11px] text-on-surface-variant mb-sm uppercase tracking-wider">
                Enterprise
              </div>
              <div className="text-[36px] font-bold text-primary mb-md">
                Custom
              </div>
              <ul className="space-y-sm mb-lg text-[13px] text-on-surface-variant">
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Unlimited storage
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Custom model fine-tuning
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Dedicated deployment
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span> Dedicated support
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="w-full border border-outline py-[8px] font-mono text-[11px] uppercase hover:bg-surface-container-low transition-all rounded tracking-wider text-primary"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
