import React from "react";

interface DashboardSidebarProps {
  activeTab: "search" | "documents" | "analytics";
  setActiveTab: (tab: "search" | "documents" | "analytics") => void;
  apiStatus: "checking" | "online" | "offline";
  apiStatusDetail: string;
  clearChat: () => void;
  chatHistoryLen: number;
  onNavigateHome: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
  apiStatus,
  apiStatusDetail,
  clearChat,
  chatHistoryLen,
  onNavigateHome,
}) => {
  return (
    <aside className="h-screen w-64 border-r border-outline-variant bg-background flex flex-col py-md px-sm shrink-0 z-50">
      <div className="flex items-center gap-sm px-sm mb-lg cursor-pointer text-left" onClick={onNavigateHome}>
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-background text-[20px] font-bold">
            description
          </span>
        </div>
        <div>
          <h1 className="font-display text-[18px] font-bold text-primary leading-tight">PDF AI</h1>
          <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">
            Premium SaaS
          </p>
        </div>
      </div>

      {/* Health status indicator */}
      <div className="px-sm mb-md">
        <div
          className={`flex items-center gap-sm p-sm rounded-xl border border-outline-variant text-left ${
            apiStatus === "online"
              ? "bg-green-500/5 text-green-400"
              : apiStatus === "offline"
              ? "bg-error-container/10 text-error"
              : "bg-surface-container-low text-on-surface-variant"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              apiStatus === "online"
                ? "bg-green-500 animate-pulse"
                : apiStatus === "offline"
                ? "bg-error"
                : "bg-outline animate-spin"
            }`}
          ></span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold leading-tight font-mono">
              {apiStatus === "online"
                ? "Backend Connected"
                : apiStatus === "offline"
                ? "Backend Disconnected"
                : "Syncing Connection"}
            </p>
            <p className="text-[9px] truncate opacity-80 mt-[2px] font-mono leading-none">
              {apiStatusDetail}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-xs overflow-y-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("search")}
          className={`w-full flex items-center gap-sm px-sm py-sm rounded-lg transition-all text-left ${
            activeTab === "search"
              ? "text-primary font-bold border-r-2 border-primary bg-surface-container-low"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span className="text-[14px]">Search Workspace</span>
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`w-full flex items-center gap-sm px-sm py-sm rounded-lg transition-all text-left ${
            activeTab === "documents"
              ? "text-primary font-bold border-r-2 border-primary bg-surface-container-low"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          <span className="text-[14px]">Knowledge Base</span>
        </button>
      </nav>

      <div className="mt-auto space-y-xs pt-md border-t border-outline-variant">
        <button
          onClick={clearChat}
          disabled={chatHistoryLen === 0}
          className="w-full py-sm px-sm mb-md border border-outline-variant text-on-background disabled:opacity-50 hover:bg-surface-container-low font-bold rounded-lg flex items-center justify-center gap-xs hover:text-primary transition-colors text-[13px]"
        >
          <span className="material-symbols-outlined text-[18px]">clear_all</span>
          <span>Clear History</span>
        </button>
        <button
          onClick={onNavigateHome}
          className="w-full flex items-center gap-sm px-sm py-sm rounded-lg text-on-surface-variant hover:text-primary transition-colors text-left text-[14px]"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>Go to Landing Page</span>
        </button>
      </div>
    </aside>
  );
};
