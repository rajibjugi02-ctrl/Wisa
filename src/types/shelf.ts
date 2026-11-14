export interface ShelfItem {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  previewUrl?: string;
  addedAt: number;
}

export interface ClipboardItem {
  id: string;
  text: string;
  copiedAt: number;
  category: "code" | "url" | "text";
}

