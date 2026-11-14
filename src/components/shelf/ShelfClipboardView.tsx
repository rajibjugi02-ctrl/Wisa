import React, { useState, useRef } from "react";
import {
  Folder,
  ClipboardList,
  Inbox,
  X,
  Copy,
  Check,
  FileText,
  FileArchive,
  FileCode,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { ClipboardItem } from "../../types/shelf";
import { formatBytes } from "../../lib/utils";

interface StagedFileItem {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  previewUrl?: string;
  isFolder?: boolean;
}

interface ShelfClipboardViewProps {
  clipboardHistory: ClipboardItem[];
  onCopyClip: (item: ClipboardItem) => void;
  copiedId: string | null;
  onRemoveClip: (id: string) => void;
}

export const ShelfClipboardView: React.FC<ShelfClipboardViewProps> = ({
  clipboardHistory,
  onCopyClip,
  copiedId,
  onRemoveClip,
}) => {
  const [activeTab, setActiveTab] = useState<"shelf" | "clipboard">("shelf");
  const [shelfFiles, setShelfFiles] = useState<StagedFileItem[]>([
    {
      id: "demo-img-1",
      name: "screen-mockup-visionos.png",
      sizeBytes: 1024 * 512,
      type: "image/png",
      previewUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "demo-pdf-2",
      name: "nusa-design-tokens.pdf",
      sizeBytes: 1024 * 1024 * 1.8,
      type: "application/pdf",
    },
    {
      id: "demo-folder-3",
      name: "AppIcons_2026",
      sizeBytes: 1024 * 1024 * 4.2,
      type: "folder",
      isFolder: true,
    },
  ]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const items: StagedFileItem[] = Array.from(files).map((f) => {
      const isImg = f.type.startsWith("image/");
      return {
        id: "file-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: f.name,
        sizeBytes: f.size,
        type: f.type || "application/octet-stream",
        previewUrl: isImg ? URL.createObjectURL(f) : undefined,
        isFolder: false,
      };
    });
    setShelfFiles((prev) => [...items, ...prev]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShelfFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const copyFilePath = async (item: StagedFileItem) => {
    try {
      await navigator.clipboard.writeText(item.name);
      setCopiedFileId(item.id);
      setTimeout(() => setCopiedFileId(null), 1800);
    } catch {
      // ignore
    }
  };

  const getFileIcon = (item: StagedFileItem) => {
    if (item.isFolder) {
      return <Folder className="h-5 w-5 text-amber-300" />;
    }
    if (item.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-400" />;
    }
    if (item.type.includes("pdf") || item.type.includes("document")) {
      return <FileText className="h-5 w-5 text-rose-400" />;
    }
    if (item.type.includes("zip") || item.type.includes("tar")) {
      return <FileArchive className="h-5 w-5 text-yellow-400" />;
    }
    if (item.name.endsWith(".ts") || item.name.endsWith(".rs") || item.name.endsWith(".js")) {
      return <FileCode className="h-5 w-5 text-emerald-400" />;
    }
    return <FileText className="h-5 w-5 text-indigo-300" />;
  };

  return (
    <div className="flex flex-col h-full w-full select-none text-white py-0.5">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />

      {/* Segmented Sub-Header Switcher */}
      <div className="flex items-center justify-between mb-1.5 shrink-0 px-1">
        <span className="text-[11px] font-semibold text-white/70">
          {activeTab === "shelf" ? "Staged Dropzone" : "Clipboard Manager"}
        </span>

        <div className="flex items-center bg-white/10 border border-white/10 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("shelf")}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all ${
              activeTab === "shelf"
                ? "bg-blue-600 text-white shadow font-semibold"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Folder className="h-3 w-3" />
            <span>Dropzone</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("clipboard")}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all ${
              activeTab === "clipboard"
                ? "bg-blue-600 text-white shadow font-semibold"
                : "text-white/40 hover:text-white"
            }`}
          >
            <ClipboardList className="h-3 w-3" />
            <span>Clipboard</span>
          </button>
        </div>
      </div>

      {activeTab === "shelf" ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 rounded-2xl border-2 border-dashed p-1.5 transition-all overflow-hidden flex flex-col justify-between ${
            isDragOver
              ? "border-blue-400 bg-blue-500/10 scale-[0.99]"
              : "border-white/20 bg-white/[0.02]"
          }`}
        >
          {shelfFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center text-center cursor-pointer my-auto py-2 group"
            >
              <div className="h-8 w-8 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center mb-1 text-white/70 transition-colors">
                <Inbox className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide">
                Drop files here
              </h4>
              <p className="text-[10px] text-white/50 mt-0.5">
                Drag out anytime · click to browse files
              </p>
            </div>
          ) : (
            <>
              {/* Horizontal Scrollable Cards with Proper Height */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-1 my-auto">
                {shelfFiles.map((item) => {
                  const isCopied = copiedFileId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => copyFilePath(item)}
                      className="relative h-20 w-24 shrink-0 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 p-1.5 flex flex-col justify-between cursor-pointer group transition-all active:scale-95 shadow-sm overflow-hidden"
                      title="Click to copy name"
                    >
                      <button
                        type="button"
                        onClick={(e) => removeFile(item.id, e)}
                        className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-black/60 hover:bg-red-500 text-white/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Remove file"
                      >
                        <X className="h-2 w-2" />
                      </button>

                      <div className="h-8 w-full rounded-lg bg-black/20 flex items-center justify-center overflow-hidden">
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt=""
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          getFileIcon(item)
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold text-white truncate block leading-tight">
                          {item.name}
                        </span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[8px] text-white/40">
                            {formatBytes(item.sizeBytes)}
                          </span>
                          {isCopied && (
                            <span className="text-[8px] text-emerald-400 font-medium">
                              Copied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 w-16 shrink-0 rounded-xl border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] flex flex-col items-center justify-center gap-1 text-white/50 hover:text-white transition-all active:scale-95"
                  title="Add more files"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-[9px]">Add</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[9px] text-white/40 px-1 pt-0.5 border-t border-white/10 shrink-0">
                <span>{shelfFiles.length} items staged</span>
                <span>Click item to copy filename</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-none space-y-1.5 pr-1">
          {clipboardHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-white/40 italic">
              Clipboard is empty
            </div>
          ) : (
            clipboardHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20"
              >
                <span className="text-xs text-white/80 truncate max-w-[400px]">
                  {item.text}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onCopyClip(item)}
                    className="p-1 text-white/50 hover:text-white"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveClip(item.id)}
                    className="p-1 text-white/40 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
