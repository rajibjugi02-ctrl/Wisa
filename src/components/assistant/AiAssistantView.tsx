import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Bot,
  ChevronDown,
  Settings as SettingsIcon,
} from "lucide-react";
import { ChatMessage } from "../../types/ai";
import { streamLiveAiResponse, AiServiceError } from "../../services/aiService";
import { AppSettings } from "../../types/settings";

interface ExtendedChatMessage extends ChatMessage {
  hasSetupButton?: boolean;
}

interface AiAssistantViewProps {
  settings: AppSettings;
  onOpenSettings?: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  settings,
  onOpenSettings,
}) => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: "msg-0",
      sender: "assistant",
      content: "Ask anything. I can summarize notes, write code, or answer questions.",
      timestamp: Date.now(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamText, setCurrentStreamText] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(
    settings.preferredAiModel || "gemini-2.5-flash"
  );
  const [copied, setCopied] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentStreamText]);

  const handleSend = async () => {
    if (!inputPrompt.trim() || isStreaming) return;

    const userPrompt = inputPrompt.trim();
    setInputPrompt("");

    const userMsg: ExtendedChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      content: userPrompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setCurrentStreamText("");

    try {
      let accumulated = "";
      const stream = streamLiveAiResponse(userPrompt, messages, {
        provider: settings.aiProvider || "Gemini",
        model: selectedModel,
        geminiKey: settings.geminiApiKey,
        openaiKey: settings.openaiApiKey,
        temperature: settings.aiTemperature ?? 0.7,
      });

      for await (const chunk of stream) {
        accumulated += chunk;
        setCurrentStreamText(accumulated);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "assistant",
          content: accumulated,
          timestamp: Date.now(),
          modelUsed: selectedModel,
        },
      ]);
    } catch (err: unknown) {
      const isMissingKey =
        err instanceof AiServiceError && err.code === "NO_API_KEY";
      const isInvalidKey =
        err instanceof AiServiceError && err.code === "INVALID_KEY";
      const errMsg =
        err instanceof Error ? err.message : "Failed to generate AI response.";

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-err-" + Date.now(),
          sender: "assistant",
          content: errMsg,
          timestamp: Date.now(),
          hasSetupButton: isMissingKey || isInvalidKey,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setCurrentStreamText("");
    }
  };

  const handleCopyLatest = async () => {
    const latestBot = [...messages].reverse().find((m) => m.sender === "assistant");
    const textToCopy = currentStreamText || latestBot?.content;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "msg-init",
        sender: "assistant",
        content: "New chat started. How can I assist you?",
        timestamp: Date.now(),
      },
    ]);
    setCurrentStreamText("");
  };

  const models = [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI" },
    { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  ];

  return (
    <div className="flex flex-col justify-between h-full w-full select-none text-white py-0.5">
      {/* Top Search Input Bar */}
      <div className="relative flex items-center shrink-0">
        <Sparkles className="absolute left-3 h-3.5 w-3.5 text-purple-400 pointer-events-none" />
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask Anything... (Press Enter to ask)"
          className="w-full bg-white/[0.06] hover:bg-white/[0.1] focus:bg-white/[0.14] rounded-xl pl-8 pr-9 py-1.5 text-xs text-white placeholder-white/40 border border-white/10 focus:border-purple-400/50 outline-none transition-all"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputPrompt.trim() || isStreaming}
          className="absolute right-2 p-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
        >
          <Send className="h-3 w-3" />
        </button>
      </div>

      {/* Middle Chat Messages Stream Area */}
      <div
        ref={scrollRef}
        className="h-[74px] overflow-y-auto px-1 space-y-1.5 text-xs scrollbar-none my-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3 py-1.5 leading-relaxed text-xs ${
                msg.sender === "user"
                  ? "bg-purple-600/80 text-white rounded-br-sm shadow"
                  : "bg-white/10 text-white/90 border border-white/5 rounded-bl-sm"
              }`}
            >
              <p>{msg.content}</p>
              {msg.hasSetupButton && onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-500/25 hover:bg-purple-500/40 text-purple-200 border border-purple-500/40 text-[10px] font-semibold transition-all active:scale-95"
                >
                  <SettingsIcon className="w-3 h-3" />
                  <span>Configure API Key</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex flex-col items-start">
            <div className="max-w-[88%] rounded-2xl px-3 py-1.5 leading-relaxed bg-white/10 text-white/90 border border-white/5 rounded-bl-sm flex items-center gap-1.5 text-xs">
              <span>{currentStreamText}</span>
              <span className="inline-block h-2.5 w-1 bg-purple-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Model Selector on Left, Copy & New Chat on Right */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-white/60 shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 text-white/80 transition-colors"
          >
            <Bot className="h-3 w-3 text-purple-400" />
            <span className="font-medium truncate max-w-[120px]">
              {models.find((m) => m.id === selectedModel)?.label || selectedModel}
            </span>
            <ChevronDown className="h-2.5 w-2.5 text-white/40" />
          </button>

          {showModelPicker && (
            <div className="absolute bottom-6 left-0 w-44 rounded-xl bg-[#14151f] border border-white/15 p-1 shadow-2xl backdrop-blur-2xl z-50">
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(m.id);
                    setShowModelPicker(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedModel === m.id
                      ? "bg-purple-600/30 text-purple-200 font-semibold"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="text-[9px] text-white/40">{m.provider}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLatest}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Copy latest answer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Start new chat"
          >
            <RefreshCw className="h-3 w-3" />
            <span>New chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
