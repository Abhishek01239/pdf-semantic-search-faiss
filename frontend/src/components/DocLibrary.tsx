import React from "react";

interface UploadedFile {
  name: string;
  chunks: number;
  error?: string;
  uploadedAt: string;
}

interface DocLibraryProps {
  recentUploads: UploadedFile[];
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  isUploading: boolean;
  uploadProgress: number;
  uploadLabel: string;
  uploadNotice: { text: string; type: "success" | "error" | "" };
  triggerUpload: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const DocLibrary: React.FC<DocLibraryProps> = ({
  recentUploads,
  selectedFiles,
  setSelectedFiles,
  isUploading,
  uploadProgress,
  uploadLabel,
  uploadNotice,
  triggerUpload,
  handleFileChange,
  handleDragOver,
  handleDrop,
  fileInputRef,
}) => {
  return (
    <div className="flex-1 p-md overflow-y-auto custom-scrollbar flex flex-col gap-md">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start max-w-[1100px] mx-auto w-full text-left">
        {/* Drag-drop upload area */}
        <div className="lg:col-span-1 space-y-md">
          <h3 className="text-[16px] font-bold text-primary font-display">Index Knowledge Base</h3>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-outline-variant hover:border-primary transition-all rounded-xl p-lg bg-surface-container-lowest/30 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
            />
            <span className="material-symbols-outlined text-[36px] text-on-surface-variant mb-sm">
              upload_file
            </span>
            <span className="text-[13px] text-primary font-bold">Drag and drop PDFs here</span>
            <span className="text-[11px] text-on-surface-variant mt-xs">
              or click to browse local files
            </span>
          </div>

          {/* Selected files listing */}
          {selectedFiles.length > 0 && (
            <div className="p-sm border border-outline-variant rounded-lg space-y-sm bg-surface-container-low">
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                <span className="text-[11px] font-bold text-primary">Selected Files</span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-[10px] text-on-surface-variant hover:text-primary uppercase font-mono"
                >
                  Clear
                </button>
              </div>
              <ul className="space-y-xs max-h-40 overflow-y-auto custom-scrollbar">
                {selectedFiles.map((file, i) => (
                  <li key={i} className="text-[12px] truncate text-on-surface">
                    📎 {file.name}
                  </li>
                ))}
              </ul>
              <button
                onClick={triggerUpload}
                disabled={isUploading}
                className="w-full bg-primary text-background py-xs font-mono text-[11px] uppercase hover:opacity-90 font-bold rounded"
              >
                {isUploading ? "Uploading..." : `Upload & Index (${selectedFiles.length})`}
              </button>
            </div>
          )}

          {/* Progress tracker */}
          {isUploading && (
            <div className="p-sm border border-outline-variant rounded-lg space-y-sm bg-surface-container-low">
              <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                <span>{uploadLabel}</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Notices */}
          {uploadNotice.text && (
            <div
              className={`p-sm rounded-lg text-[12px] border ${
                uploadNotice.type === "success"
                  ? "bg-green-500/5 border-green-500/25 text-green-400"
                  : "bg-error-container/10 border-error-container/20 text-error"
              }`}
            >
              {uploadNotice.text}
            </div>
          )}
        </div>

        {/* Uploaded History / Index status */}
        <div className="lg:col-span-2 space-y-md">
          <h3 className="text-[16px] font-bold text-primary font-display">Recent Indexes</h3>
          {recentUploads.length === 0 ? (
            <div className="p-lg border border-outline-variant bg-surface-container-lowest/30 rounded-xl text-center text-on-surface-variant italic text-[13px]">
              No documents indexed yet in this session. Index PDFs on the left to see them listed here.
            </div>
          ) : (
            <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest/20">
              <div className="divide-y divide-outline-variant">
                {recentUploads.map((record, i) => (
                  <div key={i} className="p-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-sm min-w-0">
                      <span className="material-symbols-outlined text-[24px] text-primary shrink-0">
                        picture_as_pdf
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-bold text-primary truncate" title={record.name}>
                          {record.name}
                        </h4>
                        <p className="text-[10px] font-mono text-on-surface-variant mt-[2px]">
                          Indexed: {new Date(record.uploadedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      {record.error ? (
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-error uppercase font-bold" title={record.error}>
                            Failed
                          </span>
                          <p className="text-[9px] text-error mt-[2px] max-w-[150px] truncate animate-pulse" title={record.error}>
                            {record.error}
                          </p>
                        </div>
                      ) : (
                        <span className="px-xs py-[2px] bg-green-500/10 text-green-400 text-[10px] font-mono rounded font-bold uppercase">
                          {record.chunks} Chunks
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
