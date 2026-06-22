import React from "react";

export const SecurityInfo: React.FC = () => {
  return (
    <section id="security" className="py-xl bg-surface-container-low border-b border-outline-variant">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className="flex flex-col md:flex-row gap-lg items-center">
          <div className="flex-1 text-left">
            <div className="font-mono text-[11px] text-outline mb-xs uppercase tracking-widest">
              Enterprise Ready
            </div>
            <h2 className="font-display text-[32px] text-primary mb-md font-semibold tracking-tight">
              Secure & Isolated Data
            </h2>
            <ul className="space-y-sm">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">
                  verified_user
                </span>
                <span className="text-on-surface-variant text-[14px]">
                  Isolated vector collections and workspace isolation policies.
                </span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">
                  enhanced_encryption
                </span>
                <span className="text-on-surface-variant text-[14px]">
                  Runs on your local local system (Ollama, SQLite, ChromaDB).
                </span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">
                  shield
                </span>
                <span className="text-on-surface-variant text-[14px]">
                  Private document processing ensuring no external LLM data training leak.
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-md">
            <div className="p-md glass-panel rounded-xl text-left">
              <div className="text-[24px] font-bold text-primary mb-xs">4.9/5</div>
              <div className="text-[9px] font-mono text-on-surface-variant mb-md tracking-wider">
                G2 RATINGS
              </div>
              <p className="text-[12px] italic opacity-85 leading-relaxed">
                "The semantic search capabilities are light years ahead of traditional PDF readers. A complete game changer for research."
              </p>
              <div className="mt-md font-mono text-[9px] text-primary">
                DR. ELIAS VORNE, MIT AI LAB
              </div>
            </div>
            <div className="p-md glass-panel rounded-xl text-left">
              <div className="text-[24px] font-bold text-primary mb-xs">1M+</div>
              <div className="text-[9px] font-mono text-on-surface-variant mb-md tracking-wider">
                DOCS INDEXED
              </div>
              <p className="text-[12px] italic opacity-85 leading-relaxed">
                "The FAISS integration makes our library of 50k research papers searchable in real-time. Absolute precision."
              </p>
              <div className="mt-md font-mono text-[9px] text-primary">
                SARAH CHEN, DATA SCIENTIST
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
