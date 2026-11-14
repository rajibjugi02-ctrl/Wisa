export type AiProvider = "gemini" | "openai";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: number;
  modelUsed?: string;
}

export interface AiStreamState {
  isStreaming: boolean;
  activeResponse: string;
  error: string | null;
}

