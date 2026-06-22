import React, { useState, useEffect, useRef } from "react";
import { DocumentStack } from "./DocumentStack";

interface LandingHeroProps {
  onNavigateToDashboard: () => void;
}

interface MockResult {
  text: string;
  source: string;
  match: string;
  latency: string;
  x: string;
  y: string;
}

const MOCK_RESULTS: Record<string, MockResult> = {
  summary: {
    text: "This workspace contains Q3 Financial Reports, vendor contracts, and compliance docs. The main findings indicate an 18% increase in secondary vendor expenses, under net-30 terms.",
    source: "Q3 Financial Report_final.pdf (Page 4)",
    match: "99.2%",
    latency: "0.224s",
    x: "198.112",
    y: "884.223",
  },
  targets: {
    text: "Q3 targets set at $450K money supply under net-30 term agreement with ACME CORP (Delaware location), signed Oct 12, 2024.",
    source: "Vendor_Agreement_v4.pdf (Page 12)",
    match: "98.6%",
    latency: "0.241s",
    x: "198.243",
    y: "884.912",
  },
  compliance: {
    text: "Section 4.1: The payment schedule for secondary vendors shall be initiated within 30 days of invoice receipt, provided that the vector validation is complete...",
    source: "MSA_Master_Agreement.pdf (Page 82)",
    match: "98.4%",
    latency: "0.198s",
    x: "198.056",
    y: "884.604",
  },
  custom: {
    text: "Matching chunks retrieved from indexed PDF database. Embeddings generated via SentenceTransformer with FAISS indexing. Cosine distance matches are within confidence scope.",
    source: "ChromaDB Vector Index",
    match: "95.1%",
    latency: "0.285s",
    x: "198.411",
    y: "884.102",
  }
};

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigateToDashboard }) => {
  const [inputText, setInputText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System initialized. Ready for document queries.",
    "Awaiting query input or prompt selection..."
  ]);
  const [activeResult, setActiveResult] = useState<MockResult | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const runMockSearch = (queryType: "summary" | "targets" | "compliance" | "custom", queryText: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setActiveResult(null);
    setInputText(queryText);

    // Initial logs
    setTerminalLogs([
      `[00:01] Query received: "${queryText}"`,
      `[00:02] Loading vector index space...`,
    ]);

    // Step 2 log
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[00:05] Generating 384-dim dense embeddings via SentenceTransformer...`,
        `[00:07] Running similarity cosine search in FAISS / ChromaDB...`,
      ]);
    }, 400);

    // Step 3 log
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[00:10] Scanning coordinate space (X: 198.x, Y: 884.y)...`,
        `[00:12] Retrieving closest vector chunks (top_k=3)...`,
      ]);
    }, 900);

    // Completion log & Result show
    setTimeout(() => {
      const resultObj = MOCK_RESULTS[queryType];
      setTerminalLogs((prev) => [
        ...prev,
        `[00:15] SUCCESS: Retained high-confidence citation match (${resultObj.match} Match)`,
        `[00:16] Context successfully projected into RAG response module. Done.`
      ]);
      setIsScanning(false);
      setActiveResult(resultObj);
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    runMockSearch("custom", inputText.trim());
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-20 pb-12 flex items-center px-gutter overflow-hidden border-b border-outline-variant bg-[#090909]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 80% 20%, rgba(255, 85, 0, 0.07) 0%, transparent 50%), 
          radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 32px 32px, 32px 32px",
      }}
    >
      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-lg items-center relative z-10 py-md">
        
        {/* Left column: Text content + Mock Search Console */}
        <div className="lg:col-span-7 text-left space-y-md">
          {/* Version badge */}
          <div className="inline-flex items-center gap-xs px-sm py-[4px] rounded-full border border-[#ff5500]/30 bg-[#ff5500]/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-[9px] text-[#ff5500] font-bold uppercase tracking-widest">
              Semantic Core Engine v1.4 Active
            </span>
          </div>

          <h1 className="font-display text-[44px] md:text-[60px] text-primary leading-[1.05] font-extrabold tracking-tight">
            Your Documents.<br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-[#ff5500] bg-clip-text text-transparent">
              Instantly Parsed.
            </span>
          </h1>

          <p className="text-[15px] md:text-[16px] text-on-surface-variant max-w-xl leading-relaxed">
            Go beyond keyword matching. Our semantic retrieval engine parses context, concepts, and relationships across your private PDF ecosystem to give you verified citations in milliseconds.
          </p>

          {/* Interactive Search Console Widget */}
          <div className="glass-panel p-md rounded-2xl max-w-xl relative overflow-hidden bg-[#121212]/60 shadow-xl border-outline-variant/40">
            <h3 className="text-[12px] font-mono text-primary/80 mb-sm tracking-wider uppercase">
              Interactive RAG Sandbox
            </h3>

            <form onSubmit={handleFormSubmit} className="relative flex items-center bg-[#070707] border border-outline-variant rounded-full h-12 px-sm focus-within:border-primary transition-all duration-300">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant ml-xs mr-sm">
                search
              </span>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask anything from your mock archive..."
                disabled={isScanning}
                className="bg-transparent border-none outline-none focus:ring-0 w-full text-primary font-mono text-[12px] placeholder:text-outline-variant/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isScanning}
                className="bg-primary text-background h-8 px-md rounded-full font-bold flex items-center gap-xs hover:opacity-90 transition-opacity disabled:opacity-40 text-[11px]"
              >
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                <span>Query</span>
              </button>
            </form>

            {/* Suggestions Pills */}
            <div className="flex flex-wrap gap-xs mt-sm">
              <button
                onClick={() => runMockSearch("summary", "Summarize the uploaded documents")}
                disabled={isScanning}
                className="px-sm py-[4px] rounded-full border border-outline-variant text-[10px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-lowest/30 disabled:opacity-40"
              >
                Summarize Docs
              </button>
              <button
                onClick={() => runMockSearch("targets", "What key findings or targets are mentioned?")}
                disabled={isScanning}
                className="px-sm py-[4px] rounded-full border border-outline-variant text-[10px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-lowest/30 disabled:opacity-40"
              >
                Find Targets
              </button>
              <button
                onClick={() => runMockSearch("compliance", "Are there any compliance or liability terms?")}
                disabled={isScanning}
                className="px-sm py-[4px] rounded-full border border-outline-variant text-[10px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-lowest/30 disabled:opacity-40"
              >
                Compliance Check
              </button>
            </div>
          </div>

          {/* Launch Buttons */}
          <div className="flex flex-wrap gap-md pt-sm">
            <button
              onClick={onNavigateToDashboard}
              className="bg-primary text-background px-lg py-sm font-mono uppercase font-bold hover:scale-[1.02] transition-transform text-[13px] rounded shadow-lg shadow-white/5"
            >
              Launch Console Workspace
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="border border-[#ff5500]/30 text-[#ff5500] px-lg py-sm font-mono uppercase hover:bg-[#ff5500]/5 transition-all text-[13px] rounded"
            >
              Uploader Sandbox
            </button>
          </div>
        </div>

        {/* Right column: 3D Stack + Scanner HUD and Live Logger */}
        <div className="lg:col-span-5 w-full relative">
          <div className="border border-outline-variant/30 rounded-2xl bg-[#0e0e0e]/60 backdrop-blur-md p-md flex flex-col gap-sm overflow-hidden min-h-[460px] relative shadow-2xl">
            {/* HUD border lines */}
            <div className="absolute top-sm left-sm border-t-2 border-l-2 border-primary/20 w-4 h-4"></div>
            <div className="absolute top-sm right-sm border-t-2 border-r-2 border-primary/20 w-4 h-4"></div>
            <div className="absolute bottom-sm left-sm border-b-2 border-l-2 border-primary/20 w-4 h-4"></div>
            <div className="absolute bottom-sm right-sm border-b-2 border-r-2 border-primary/20 w-4 h-4"></div>

            {/* HUD Status Bar */}
            <div className="flex justify-between items-center text-[9px] font-mono text-on-surface-variant/80 border-b border-outline-variant/20 pb-xs">
              <span>SCANNER_MOD_A7</span>
              <span className="flex items-center gap-xs">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                ONLINE
              </span>
            </div>

            {/* DocumentStack Render */}
            <div className="flex-1 flex items-center justify-center relative">
              <DocumentStack 
                isScanning={isScanning} 
                latency={activeResult ? activeResult.latency : isScanning ? "0.084s" : "0.241s"}
                match={activeResult ? activeResult.match : "98.6%"}
                x={activeResult ? activeResult.x : "198.243"}
                y={activeResult ? activeResult.y : "884.912"}
              />

              {/* RAG Cosine Hit Citation Popup */}
              {activeResult && (
                <div 
                  className="absolute bottom-4 left-4 right-4 bg-[#121212]/95 border border-[#ff5500] rounded-xl p-sm shadow-[0_0_20px_rgba(255,85,0,0.15)] animate-fade-in text-left space-y-xs transition-all duration-300 z-30"
                >
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-xs">
                    <span className="px-xs py-[2px] bg-[#ff5500]/10 text-[#ff5500] text-[8px] font-mono rounded font-bold uppercase">
                      RAG COGNITIVE HIT
                    </span>
                    <span className="text-[9px] font-mono text-primary font-bold">
                      Match: {activeResult.match}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-on-surface leading-normal italic">
                    "{activeResult.text}"
                  </p>
                  <p className="text-[9px] font-mono text-on-surface-variant text-right">
                    Source: {activeResult.source}
                  </p>
                </div>
              )}
            </div>

            {/* Live Terminal Logger */}
            <div className="bg-[#050505] border border-outline-variant/20 rounded-lg p-sm font-mono text-[9px] text-left text-on-surface-variant/80 h-24 overflow-y-auto custom-scrollbar flex flex-col gap-[2px]">
              {terminalLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={log.includes("SUCCESS") ? "text-[#ff5500] font-bold" : log.includes("Query received") ? "text-primary" : ""}
                >
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
