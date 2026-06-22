import React from "react";
import { SemanticGraph } from "./SemanticGraph";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWorkspaceProps {
  chatHistory: Message[];
  isAsking: boolean;
  questionText: string;
  setQuestionText: (text: string) => void;
  handleQuery: (e?: React.FormEvent) => void;
  copyLastAnswer: () => void;
  copied: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  chatHistory,
  isAsking,
  questionText,
  setQuestionText,
  handleQuery,
  copyLastAnswer,
  copied,
  chatEndRef,
}) => {
  const handlePillClick = (text: string) => {
    setQuestionText(text);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-md">
        {chatHistory.length === 0 ? (
          <div className="max-w-[700px] mx-auto py-xl text-center space-y-md">
            <h2 className="font-display text-[26px] text-primary italic font-light tracking-wide">
              Ask Anything From Your Documents
            </h2>
            <p className="text-[14px] text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Query your vectors using natural language. Upload files via the side drawer or Document library to index them.
            </p>

            {/* Three.js Graph display in search console */}
            <div className="relative w-full h-[240px] rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden max-w-lg mx-auto">
              <SemanticGraph />
              <div className="absolute bottom-xs left-sm p-xs bg-background/80 rounded border border-outline-variant z-10 text-[9px] font-mono text-left text-on-surface-variant">
                Cluster map active: floating vector indexes
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[700px] mx-auto space-y-md py-sm">
            {chatHistory.map((msg, i) => (
              <article
                key={i}
                className={`flex gap-sm p-md rounded-xl border ${
                  msg.role === "user"
                    ? "bg-surface-container-lowest border-outline-variant"
                    : "bg-surface-container-low border-primary/25 shadow-sm"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono shrink-0 font-bold ${
                    msg.role === "user" ? "bg-outline text-background" : "bg-primary text-background"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div className="text-left space-y-sm min-w-0">
                  <p className="text-[10px] font-mono text-outline-variant uppercase tracking-wider">
                    {msg.role === "user" ? "You" : "Assistant"}
                  </p>
                  <p className="text-[14px] text-on-surface leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </article>
            ))}
            {isAsking && (
              <article className="flex gap-sm p-md rounded-xl border bg-surface-container-low border-outline-variant animate-pulse">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono bg-primary text-background shrink-0 font-bold">
                  AI
                </div>
                <div className="text-left space-y-sm">
                  <p className="text-[10px] font-mono text-outline-variant uppercase tracking-wider">
                    Assistant
                  </p>
                  <div className="flex items-center gap-xs text-[14px] text-on-surface">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-xs text-[12px] opacity-75">Retrieving vector contexts...</span>
                  </div>
                </div>
              </article>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input composer and suggestions */}
      <div className="p-md border-t border-outline-variant shrink-0 bg-background/50">
        <div className="max-w-[700px] mx-auto space-y-md">
          {/* Prompt Pills */}
          {chatHistory.length === 0 && (
            <div className="flex flex-wrap justify-center gap-xs">
              <button
                onClick={() => handlePillClick("Summarize the uploaded documents")}
                className="px-sm py-[4px] rounded-full border border-outline-variant text-[11px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-lowest/30"
              >
                Summarize Documents
              </button>
              <button
                onClick={() => handlePillClick("What key findings or targets are mentioned?")}
                className="px-sm py-[4px] rounded-full border border-outline-variant text-[11px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-lowest/30"
              >
                Extract targets
              </button>
              <button
                onClick={() => handlePillClick("Are there any compliance or liability terms?")}
                className="px-sm py-[4px] rounded-full border border-outline-variant text-[11px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-lowest/30"
              >
                Compliance check
              </button>
            </div>
          )}

          {/* Compose Box */}
          <form onSubmit={handleQuery} className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded-full h-14 px-md search-glow transition-all duration-300">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm">
                search
              </span>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Query semantic context..."
                disabled={isAsking}
                className="bg-transparent border-none outline-none focus:ring-0 w-full text-primary font-mono text-[13px] placeholder:text-outline-variant focus:outline-none"
              />
              <div className="flex items-center gap-sm">
                <button
                  type="button"
                  onClick={copyLastAnswer}
                  disabled={chatHistory.length === 0}
                  title="Copy last answer"
                  className="p-1.5 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {copied ? "done" : "content_copy"}
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={!questionText.trim() || isAsking}
                  className="bg-primary text-background h-9 px-md rounded-full font-bold flex items-center gap-xs hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span className="text-[12px]">Query</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
