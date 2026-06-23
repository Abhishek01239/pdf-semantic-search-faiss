import React, { useState, useEffect, useRef } from "react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopbar } from "../components/DashboardTopbar";
import { ChatWorkspace } from "../components/ChatWorkspace";
import { InsightsDrawer } from "../components/InsightsDrawer";
import { DocLibrary } from "../components/DocLibrary";

interface Source {
  source: string;
  chunk_id: number;
  distance: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UploadedFile {
  name: string;
  chunks: number;
  error?: string;
  uploadedAt: string;
}

interface DashboardProps {
  onNavigateHome: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const STORAGE_KEYS = {
  uploads: "ragPdfRecentUploads",
  messages: "ragPdfMessages",
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<"search" | "documents" | "analytics">("search");
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [apiStatusDetail, setApiStatusDetail] = useState(
    import.meta.env.VITE_API_URL
      ? `Connecting to backend: ${import.meta.env.VITE_API_URL}`
      : "Looking for FastAPI on port 8000."
  );
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.uploads);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.messages);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [currentSources, setCurrentSources] = useState<Source[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState("Ready");
  const [uploadNotice, setUploadNotice] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Health checks
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setApiStatus("online");
        setApiStatusDetail(data.message || "FastAPI is responding.");
      } catch (error: any) {
        setApiStatus("offline");
        setApiStatusDetail(
          import.meta.env.VITE_API_URL
            ? "Cannot connect to the backend server."
            : "Run: cd backend; uvicorn api:app --reload"
        );
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync scroll on chat update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAsking]);

  // Sync storage helpers
  const saveRecentUploads = (newUploads: UploadedFile[]) => {
    setRecentUploads(newUploads);
    localStorage.setItem(STORAGE_KEYS.uploads, JSON.stringify(newUploads));
  };

  const saveChatHistory = (newHistory: Message[]) => {
    setChatHistory(newHistory);
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(newHistory));
  };

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      setSelectedFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      if (files.length > 0) {
        setSelectedFiles(files);
        uploadFilesDirectly(files);
      } else {
        setUploadNotice({ text: "Only PDF files are allowed.", type: "error" });
      }
    }
  };

  const uploadFilesDirectly = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadNotice({ text: "", type: "" });

    let completed = 0;
    let failed = 0;
    const currentUploads = [...recentUploads];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress((i / files.length) * 100);
      setUploadLabel(`Uploading ${file.name}`);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.message || "Upload failed");

        completed += 1;
        const newRecord: UploadedFile = {
          name: file.name,
          chunks: data.chunks_stored || 0,
          uploadedAt: new Date().toISOString(),
        };
        currentUploads.unshift(newRecord);
      } catch (error: any) {
        failed += 1;
        const newRecord: UploadedFile = {
          name: file.name,
          chunks: 0,
          error: error.message || "Upload failed",
          uploadedAt: new Date().toISOString(),
        };
        currentUploads.unshift(newRecord);
      }
      setUploadProgress(((i + 1) / files.length) * 100);
      setUploadLabel(`Processed ${i + 1} of ${files.length}`);
    }

    saveRecentUploads(currentUploads.slice(0, 10));
    setIsUploading(false);
    setSelectedFiles([]);
    if (failed > 0) {
      setUploadNotice({ text: `${completed} uploaded, ${failed} failed.`, type: "error" });
    } else {
      setUploadNotice({
        text: `Successfully uploaded ${completed} PDF${completed > 1 ? "s" : ""}.`,
        type: "success",
      });
    }
    setTimeout(() => {
      setUploadProgress(0);
      setUploadLabel("Ready");
    }, 1500);
  };

  const triggerUpload = () => {
    uploadFilesDirectly(selectedFiles);
  };

  // Chat queries
  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = questionText.trim();
    if (!query || isAsking) return;

    const userMessage: Message = { role: "user", content: query };
    const nextHistory = [...chatHistory, userMessage];
    setChatHistory(nextHistory);
    setQuestionText("");
    setIsAsking(true);

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer || "No answer returned.",
      };
      saveChatHistory([...nextHistory, assistantMessage]);
      setCurrentSources(data.sources || []);
    } catch (error: any) {
      const assistantMessage: Message = {
        role: "assistant",
        content: `Error connecting to backend: ${error.message}`,
      };
      saveChatHistory([...nextHistory, assistantMessage]);
      setCurrentSources([]);
    } finally {
      setIsAsking(false);
    }
  };

  const clearChat = async () => {
    try {
      await fetch(`${API_BASE}/clear`, { method: "POST" });
    } catch {
      // Ignored if API is down
    }
    saveChatHistory([]);
    setCurrentSources([]);
  };

  const copyLastAnswer = async () => {
    const lastAssistant = [...chatHistory].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    try {
      await navigator.clipboard.writeText(lastAssistant.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard copy fail
    }
  };

  return (
    <div className="bg-background text-on-background font-body h-screen flex overflow-hidden w-full relative">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
        apiStatusDetail={apiStatusDetail}
        clearChat={clearChat}
        chatHistoryLen={chatHistory.length}
        onNavigateHome={onNavigateHome}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <DashboardTopbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex overflow-hidden">
          {activeTab === "search" ? (
            <div className="flex-1 flex overflow-hidden">
              <ChatWorkspace
                chatHistory={chatHistory}
                isAsking={isAsking}
                questionText={questionText}
                setQuestionText={setQuestionText}
                handleQuery={handleQuery}
                copyLastAnswer={copyLastAnswer}
                copied={copied}
                chatEndRef={chatEndRef}
              />
              <InsightsDrawer sources={currentSources} />
            </div>
          ) : (
            <DocLibrary
              recentUploads={recentUploads}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              uploadLabel={uploadLabel}
              uploadNotice={uploadNotice}
              triggerUpload={triggerUpload}
              handleFileChange={handleFileChange}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              fileInputRef={fileInputRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};
