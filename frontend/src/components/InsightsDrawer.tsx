import React from "react";

interface Source {
  source: string;
  chunk_id: number;
  distance: number;
}

interface InsightsDrawerProps {
  sources: Source[];
}

export const InsightsDrawer: React.FC<InsightsDrawerProps> = ({ sources }) => {
  return (
    <aside className="w-80 border-l border-outline-variant bg-surface-container-low overflow-y-auto custom-scrollbar p-md flex flex-col gap-md shrink-0 hidden xl:flex text-left">
      {/* Metric Summary */}
      <section className="space-y-sm">
        <h5 className="font-mono text-[11px] uppercase text-primary tracking-wider border-b border-outline-variant pb-xs">
          Semantic Insights
        </h5>
        <div className="space-y-sm">
          <div className="p-sm bg-background border border-outline-variant rounded-lg">
            <div className="flex justify-between items-center mb-xs">
              <span className="text-[11px] font-mono text-on-surface-variant">Top Chunk Distance</span>
              <span className="text-[11px] font-mono text-primary font-bold">
                {sources.length > 0
                  ? sources[0].distance.toFixed(4)
                  : "n/a"}
              </span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${
                    sources.length > 0
                      ? Math.max(0, Math.min(100, (1 - sources[0].distance) * 100))
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Source citations list */}
      <section className="flex-1 overflow-y-auto custom-scrollbar space-y-sm">
        <h5 className="font-mono text-[11px] uppercase text-primary tracking-wider border-b border-outline-variant pb-xs">
          Retrieved Citations
        </h5>
        {sources.length === 0 ? (
          <p className="text-[12px] text-on-surface-variant italic opacity-75">
            Citations from the last query will appear here.
          </p>
        ) : (
          <div className="space-y-sm">
            {sources.map((source, index) => (
              <article
                key={index}
                className="p-sm bg-background border border-outline-variant rounded-lg hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between mb-xs">
                  <span className="px-xs py-[1px] bg-primary-container text-on-primary-container text-[9px] font-mono rounded">
                    SOURCE {index + 1}
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">
                    Dist: {source.distance.toFixed(3)}
                  </span>
                </div>
                <h4 className="text-[12px] font-bold text-primary truncate" title={source.source}>
                  {source.source}
                </h4>
                <p className="text-[10px] font-mono text-on-surface-variant mt-[2px]">
                  Chunk ID: {source.chunk_id}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* AI RAG context summary */}
      <section className="pt-md border-t border-outline-variant shrink-0">
        <div className="flex items-center gap-sm mb-sm text-primary">
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span className="font-mono text-[10px] uppercase tracking-wider">Context Summary</span>
        </div>
        <div className="p-sm bg-primary-container text-on-primary-container rounded-xl text-[11px] leading-relaxed italic border border-outline-variant">
          {sources.length > 0
            ? `Retrieved ${sources.length} semantic chunks from ${
                Array.from(new Set(sources.map((s) => s.source))).length
              } documents. Highest vector match corresponds to chunk ${
                sources[0].chunk_id
              } in ${sources[0].source}.`
            : "Awaiting search query to summarize high-dimensional cosine relations."}
        </div>
      </section>
    </aside>
  );
};
