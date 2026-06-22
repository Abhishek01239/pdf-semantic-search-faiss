import React from "react";

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-xl border-b border-outline-variant bg-surface-container-lowest/40">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className="mb-lg text-center max-w-2xl mx-auto">
          <h2 className="font-display text-[32px] text-primary mb-md font-semibold tracking-tight">
            Seamless Intelligence Pipeline
          </h2>
          <p className="text-on-surface-variant text-[15px]">
            From raw unstructured data to high-dimensional semantic insights in four automated steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="relative">
            <div className="font-mono text-[48px] text-primary/10 mb-xs font-bold leading-none">01</div>
            <div className="text-[18px] font-bold text-primary mb-sm">Upload</div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Ingest PDF documents. Our processing pipeline parses text and structured details.
            </p>
            <div className="hidden md:block absolute top-8 -right-4 w-8 h-[1px] bg-outline-variant"></div>
          </div>
          <div className="relative">
            <div className="font-mono text-[48px] text-primary/10 mb-xs font-bold leading-none">02</div>
            <div className="text-[18px] font-bold text-primary mb-sm">Embed</div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Chunks are transformed into high-dimensional vector embeddings using SentenceTransformers.
            </p>
            <div className="hidden md:block absolute top-8 -right-4 w-8 h-[1px] bg-outline-variant"></div>
          </div>
          <div className="relative">
            <div className="font-mono text-[48px] text-primary/10 mb-xs font-bold leading-none">03</div>
            <div className="text-[18px] font-bold text-primary mb-sm">Index</div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Vector databases index chunks, ensuring sub-second similarity lookups.
            </p>
            <div className="hidden md:block absolute top-8 -right-4 w-8 h-[1px] bg-outline-variant"></div>
          </div>
          <div>
            <div className="font-mono text-[48px] text-primary/10 mb-xs font-bold leading-none">04</div>
            <div className="text-[18px] font-bold text-primary mb-sm">Search</div>
            <p className="text-[13px] text-on-surface-variant leading-relaxed">
              Natural language queries generate context-informed answers backed by source citations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
