import { ChatMessage } from "../types/ai";

export interface AiStreamConfig {
  provider: "Gemini" | "ChatGPT";
  model: string;
  geminiKey?: string;
  openaiKey?: string;
  temperature?: number;
}

export class AiServiceError extends Error {
  code: "NO_API_KEY" | "INVALID_KEY" | "NETWORK_ERROR" | "RATE_LIMIT";
  provider: "Gemini" | "ChatGPT";

  constructor(
    message: string,
    code: "NO_API_KEY" | "INVALID_KEY" | "NETWORK_ERROR" | "RATE_LIMIT",
    provider: "Gemini" | "ChatGPT"
  ) {
    super(message);
    this.code = code;
    this.provider = provider;
    this.name = "AiServiceError";
  }
}

/**
 * Streams real-time AI responses from Google Gemini or OpenAI API
 */
export async function* streamLiveAiResponse(
  prompt: string,
  history: ChatMessage[],
  config: AiStreamConfig
): AsyncGenerator<string, void, unknown> {
  const isGemini = config.provider === "Gemini";

  if (isGemini) {
    const key = (config.geminiKey || "").trim();
    if (!key) {
      throw new AiServiceError(
        "Gemini API key is required. Open Settings -> AI Assistant to configure your free key.",
        "NO_API_KEY",
        "Gemini"
      );
    }

    // Model fallback
    const geminiModel = config.model.startsWith("gemini")
      ? config.model
      : "gemini-2.5-flash";

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${key}`;

    const contents = [
      ...history.slice(-8).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: prompt }] },
    ];

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });
    } catch {
      throw new AiServiceError(
        "Network connection error while contacting Gemini API.",
        "NETWORK_ERROR",
        "Gemini"
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 400 || response.status === 403) {
        throw new AiServiceError(
          "Invalid or expired Gemini API key. Please check your key in Settings.",
          "INVALID_KEY",
          "Gemini"
        );
      }
      throw new AiServiceError(
        `Gemini API returned error: ${response.status} (${errText.slice(0, 100)})`,
        "NETWORK_ERROR",
        "Gemini"
      );
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:")) {
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const text =
              parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              yield text;
            }
          } catch {
            // Ignore partial SSE parse errors
          }
        }
      }
    }
    return;
  }

  // OpenAI Branch
  const openaiKey = (config.openaiKey || "").trim();
  if (!openaiKey) {
    throw new AiServiceError(
      "OpenAI API key is required. Open Settings -> AI Assistant to configure your key.",
      "NO_API_KEY",
      "ChatGPT"
    );
  }

  const gptModel = config.model.startsWith("gpt") ? config.model : "gpt-4o-mini";
  const messages = [
    {
      role: "system",
      content:
        "You are Wisa AI, an intelligent, helpful assistant running natively inside the Windows smart notch. Be concise, direct, and pleasant.",
    },
    ...history.slice(-8).map((m) => ({
      role: m.sender as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: prompt },
  ];

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: gptModel,
        messages,
        stream: true,
        temperature: config.temperature ?? 0.7,
      }),
    });
  } catch {
    throw new AiServiceError(
      "Network connection error while contacting OpenAI API.",
      "NETWORK_ERROR",
      "ChatGPT"
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AiServiceError(
        "Invalid or expired OpenAI API key. Please check your key in Settings.",
        "INVALID_KEY",
        "ChatGPT"
      );
    }
    throw new AiServiceError(
      `OpenAI API returned error ${response.status}`,
      "NETWORK_ERROR",
      "ChatGPT"
    );
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data:")) {
        const jsonStr = trimmed.slice(5).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const chunk = parsed.choices?.[0]?.delta?.content;
          if (chunk) {
            yield chunk;
          }
        } catch {
          // Ignore partial SSE JSON
        }
      }
    }
  }
}

