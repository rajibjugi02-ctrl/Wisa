import { useState } from "react";
import { ClipboardItem } from "../types/shelf";

const INITIAL_ITEMS: ClipboardItem[] = [
  {
    id: "clip-1",
    text: "npm i @google/generative-ai framer-motion lucide-react",
    copiedAt: Date.now() - 1000 * 60 * 5,
    category: "code",
  },
  {
    id: "clip-2",
    text: "https://tauri.app/v2/guides/features/system-tray/",
    copiedAt: Date.now() - 1000 * 60 * 30,
    category: "url",
  },
  {
    id: "clip-3",
    text: "Nusa Smart Notch: VisionOS-inspired desktop island for Windows 11",
    copiedAt: Date.now() - 1000 * 60 * 120,
    category: "text",
  },
];

export function useClipboardHistory() {
  const [history, setHistory] = useState<ClipboardItem[]>(INITIAL_ITEMS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyItem = async (item: ClipboardItem) => {
    try {
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback
    }
  };

  const addClip = (text: string) => {
    const isUrl = /^https?:\/\//i.test(text.trim());
    const isCode = text.includes("{") || text.includes(";") || text.includes("npm ");
    const newItem: ClipboardItem = {
      id: "clip-" + Date.now(),
      text,
      copiedAt: Date.now(),
      category: isUrl ? "url" : isCode ? "code" : "text",
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  const removeItem = (id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id));
  };

  return {
    history,
    copiedId,
    copyItem,
    addClip,
    removeItem,
  };
}

