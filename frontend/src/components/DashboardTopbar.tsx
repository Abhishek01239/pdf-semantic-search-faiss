import React from "react";

interface DashboardTopbarProps {
  activeTab: "search" | "documents" | "analytics";
  setActiveTab: (tab: "search" | "documents" | "analytics") => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="h-16 border-b border-outline-variant flex items-center justify-between px-md bg-background/80 backdrop-blur shrink-0">
      <div className="flex items-center gap-sm">
        <span className="font-mono text-[11px] uppercase text-on-surface-variant">Workspace</span>
        <span className="text-outline-variant">/</span>
        <span className="font-mono text-[11px] uppercase text-primary font-bold">
          {activeTab === "search" ? "Semantic Search" : "Document Library"}
        </span>
      </div>
      <div className="flex items-center gap-md">
        <button
          onClick={() => setActiveTab(activeTab === "search" ? "documents" : "search")}
          className="flex items-center gap-xs border border-outline-variant px-sm py-xs rounded hover:bg-surface-container-low text-[12px] font-mono uppercase text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">
            {activeTab === "search" ? "folder_open" : "chat_bubble"}
          </span>
          <span>{activeTab === "search" ? "Manage PDFs" : "Chat Console"}</span>
        </button>
      </div>
    </header>
  );
};
