import React from "react";

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-xl border-b border-outline-variant">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className="mb-lg text-center max-w-2xl mx-auto">
          <h2 className="font-display text-[32px] text-primary mb-md font-semibold tracking-tight">
            Built for Enterprise Deep Focus
          </h2>
          <p className="text-on-surface-variant text-[15px]">
            Engineered with custom analytics tools to speed up document auditing and verification.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="p-lg border border-outline-variant bg-surface-container-low hover:border-primary transition-all group rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-md text-primary block">
              search_insights
            </span>
            <h3 className="text-[18px] font-bold text-primary mb-sm">Semantic Retrieval</h3>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-80">
              Traditional keyword indexing misses context. We parse concepts and sentence intents.
            </p>
          </div>
          <div className="p-lg border border-outline-variant bg-surface-container-low hover:border-primary transition-all group rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-md text-primary block">
              hub
            </span>
            <h3 className="text-[18px] font-bold text-primary mb-sm">Vector Embedding Store</h3>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-80">
              Embed your knowledge base and perform multi-document cosine queries in real time.
            </p>
          </div>
          <div className="p-lg border border-outline-variant bg-surface-container-low hover:border-primary transition-all group rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-md text-primary block">
              auto_awesome
            </span>
            <h3 className="text-[18px] font-bold text-primary mb-sm">RAG AI Summaries</h3>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-80">
              Generate dynamic context-aware summaries of long research papers or service agreements.
            </p>
          </div>
          <div className="p-lg border border-outline-variant bg-surface-container-low hover:border-primary transition-all group rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-md text-primary block">
              fact_check
            </span>
            <h3 className="text-[18px] font-bold text-primary mb-sm">Strict Citations</h3>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-80">
              Say goodbye to hallucinations. Answers reference specific chunk IDs and documents.
            </p>
          </div>
          <div className="p-lg border border-outline-variant bg-surface-container-low hover:border-primary transition-all group rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-md text-primary block">
              library_books
            </span>
            <h3 className="text-[18px] font-bold text-primary mb-sm">Multi-Document Chat</h3>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-80">
              Ask questions that cross-reference data points scattered across separate files.
            </p>
          </div>
          <div className="p-lg border border-outline-variant bg-surface-container-low hover:border-primary transition-all group rounded-xl">
            <span className="material-symbols-outlined text-[32px] mb-md text-primary block">
              query_stats
            </span>
            <h3 className="text-[18px] font-bold text-primary mb-sm">Knowledge Topology</h3>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-80">
              Map relations between different documents visually to identify cluster insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
