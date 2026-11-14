import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { ChatMessage } from "../types/ai";

export async function* streamAiResponse(
  prompt: string,
  history: ChatMessage[],
  config: {
    model: string;
    geminiKey?: string;
    openaiKey?: string;
  }
): AsyncGenerator<string, void, unknown> {
  const isGemini = config.model.startsWith("gemini");

  if (isGemini) {
    if (config.geminiKey && config.geminiKey.trim().length > 0) {
      try {
        const genAI = new GoogleGenerativeAI(config.geminiKey);
        const model = genAI.getGenerativeModel({ model: config.model });

        // Convert prior messages to Gemini chat history format
        const chat = model.startChat({
          history: history.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        });

        const result = await chat.sendMessageStream(prompt);
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            yield chunkText;
          }
        }
        return;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gemini API error";
        yield `\n[Gemini Error: ${message}]`;
        return;
      }
    }
  } else {
    // OpenAI provider branch
    if (config.openaiKey && config.openaiKey.trim().length > 0) {
      try {
        const openai = new OpenAI({
          apiKey: config.openaiKey,
          dangerouslyAllowBrowser: true,
        });

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: "system", content: "You are Nusa AI Assistant, a concise and intelligent companion inside a floating Windows notch." },
          ...history.slice(-6).map((m) => ({
            role: m.sender as "user" | "assistant",
            content: m.content,
          })),
          { role: "user", content: prompt },
        ];

        const stream = await openai.chat.completions.create({
          model: config.model,
          messages,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            yield content;
          }
        }
        return;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "OpenAI API error";
        yield `\n[OpenAI Error: ${message}]`;
        return;
      }
    }
  }

  // Fallback demo simulation when no API key has been added in settings
  const simulatedReply = getSimulatedAiReply(prompt, config.model);
  const words = simulatedReply.split(" ");
  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 35));
    yield word + " ";
  }
}

function getSimulatedAiReply(prompt: string, model: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("weather") || lower.includes("cuaca")) {
    return `Currently 29°C in Tangerang with light clouds. Humidity is 78% with gentle breezes.`;
  }
  if (lower.includes("prayer") || lower.includes("sholat")) {
    return `Next prayer is Ashar at 15:08. You have plenty of time to finish your current focus session.`;
  }
  if (lower.includes("code") || lower.includes("rust") || lower.includes("react")) {
    return `Here is a tip for your project: keep IPC payloads lightweight by streaming incremental diffs over Tauri events rather than sending full state snapshots on every tick.`;
  }
  return `Answered via ${model}: I processed "${prompt}". To enable live online queries, connect your API key in Settings (gear icon in the notch dock).`;
}

