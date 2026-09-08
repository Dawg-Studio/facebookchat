import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GEMINI_MODEL, RETRY, SYSTEM_PROMPT } from "@/lib/constants";
import { ConversationMessage } from "@/types/chat";
import { GeminiApiError } from "@/utils/errors";
import { logger } from "@/utils/logger";

export const FEELING_LABELS = [
  "anxiety", "stress", "loneliness", "fear", "sad", "anger",
  "frustration", "confusion", "insecurity", "burnout", "pressure",
  "hopeless", "excited", "happy", "depressed", "none",
] as const;

export interface GeminiFunctionCall {
  name: string;
  args: Record<string, unknown>;
}

export type GeminiResult =
  | { type: "text"; text: string }
  | { type: "function_call"; functionCall: GeminiFunctionCall };

const SHOW_FEELING_BUTTONS_TOOL = {
  functionDeclarations: [
    {
      name: "show_feeling_buttons",
        description:
          "Display feeling selection buttons to the student at the start of a conversation. Must be called on the very first user message. Never call it again afterward. The greeting text must NOT list the feeling options — they are already displayed as buttons.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            greeting: {
              type: SchemaType.STRING,
              description:
                "A warm greeting without listing any feeling options (they appear as buttons automatically). Keep it short and open-ended.",
            },
          },
          required: ["greeting"],
        },
    },
  ],
};

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoff(attempt: number): number {
  const delay = Math.min(
    RETRY.BASE_DELAY_MS * Math.pow(2, attempt),
    RETRY.MAX_DELAY_MS
  );
  return delay + Math.random() * 1000;
}

function mapRole(role: ConversationMessage["role"]): string {
  return role === "assistant" ? "model" : role;
}

export const geminiService = {
  async generateResponse(
    userMessage: string,
    history: ConversationMessage[] = []
  ): Promise<string> {
    const model = createGeminiClient();
    const lastError: GeminiApiError = new GeminiApiError("All retries exhausted");

    for (let attempt = 0; attempt < RETRY.MAX_ATTEMPTS; attempt++) {
      try {
        const chat = model.startChat({
          systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          history: history.map((msg) => ({
            role: mapRole(msg.role),
            parts: [{ text: msg.content }],
          })),
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const text = response.text();

        if (!text) {
          throw new GeminiApiError("Empty response from Gemini");
        }

        return text;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        logger.warn(`Gemini API attempt ${attempt + 1} failed`, {
          error: message,
          attempt: attempt + 1,
          maxAttempts: RETRY.MAX_ATTEMPTS,
        });

        if (
          error instanceof GeminiApiError &&
          attempt < RETRY.MAX_ATTEMPTS - 1
        ) {
          const backoff = calculateBackoff(attempt);
          await sleep(backoff);
          continue;
        }

        if (error instanceof GeminiApiError) {
          throw error;
        }

        throw new GeminiApiError(
          `Gemini API error after ${RETRY.MAX_ATTEMPTS} attempts: ${message}`
        );
      }
    }

    throw lastError;
  },

  async generateWithTools(
    userMessage: string,
    history: ConversationMessage[] = []
  ): Promise<GeminiResult> {
    const model = createGeminiClient();
    const lastError: GeminiApiError = new GeminiApiError(
      "All retries exhausted"
    );

    for (let attempt = 0; attempt < RETRY.MAX_ATTEMPTS; attempt++) {
      try {
        const chat = model.startChat({
          systemInstruction: {
            role: "system",
            parts: [{ text: SYSTEM_PROMPT }],
          },
          tools: [SHOW_FEELING_BUTTONS_TOOL],
          history: history.map((msg) => ({
            role: mapRole(msg.role),
            parts: [{ text: msg.content }],
          })),
        });

        const result = await chat.sendMessage(userMessage);
        const candidate = result.response.candidates?.[0];
        const functionCall = candidate?.content?.parts?.[0]?.functionCall;

        if (functionCall) {
          return {
            type: "function_call",
            functionCall: {
              name: functionCall.name,
              args: functionCall.args as Record<string, unknown>,
            },
          };
        }

        const text = result.response.text();
        if (!text) {
          throw new GeminiApiError("Empty response from Gemini");
        }

        return { type: "text", text };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        logger.warn(`Gemini API attempt ${attempt + 1} failed`, {
          error: message,
          attempt: attempt + 1,
          maxAttempts: RETRY.MAX_ATTEMPTS,
        });

        if (
          error instanceof GeminiApiError &&
          attempt < RETRY.MAX_ATTEMPTS - 1
        ) {
          const backoff = calculateBackoff(attempt);
          await sleep(backoff);
          continue;
        }

        if (error instanceof GeminiApiError) {
          throw error;
        }

        throw new GeminiApiError(
          `Gemini API error after ${RETRY.MAX_ATTEMPTS} attempts: ${message}`
        );
      }
    }

    throw lastError;
  },

  async classifyFeeling(userMessage: string): Promise<string> {
    try {
      const model = createGeminiClient();
      const prompt = `Classify the following message into exactly one of these feeling labels: ${FEELING_LABELS.map((l) => `"${l}"`).join(", ")}. Reply with ONLY the single label word, nothing else.\n\nMessage: "${userMessage}"`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().toLowerCase();

      const matched = FEELING_LABELS.find((label) => text.includes(label));
      return matched ?? "none";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      logger.warn("Gemini feeling classification failed", { error: message });
      return "none";
    }
  },
};
