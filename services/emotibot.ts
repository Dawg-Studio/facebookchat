import {
  CRISIS_KEYWORDS,
  CRISIS_RESPONSE,
  EMOTION_QUICK_REPLIES,
  TALK_ABOUT_IT_RESPONSES,
} from "@/lib/emotibot-data";
import type { ConversationState } from "@/lib/emotibot-data";
import { geminiService } from "@/services/gemini";
import type { ConversationMessage } from "@/types/chat";

export interface EmotibotResponse {
  text: string;
  quickReplies?: Array<{ title: string; payload: string }>;
}

const conversations = new Map<string, ConversationMessage[]>();
const conversationStates = new Map<string, ConversationState>();
const lastTeacherReplyAt = new Map<string, number>();
const HUMAN_MODE_TIMEOUT_MS = 5 * 60 * 1000;

function getHistory(senderId?: string): ConversationMessage[] {
  return senderId ? conversations.get(senderId) ?? [] : [];
}

function getState(senderId?: string): ConversationState {
  if (!senderId) return "GREETING";
  return conversationStates.get(senderId) ?? "GREETING";
}

function setState(senderId: string, state: ConversationState) {
  conversationStates.set(senderId, state);
}

function saveConversation(
  senderId: string,
  history: ConversationMessage[],
  userMessage: string,
  assistantResponse?: string
) {
  const updated: ConversationMessage[] = [
    ...history,
    {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    },
  ];
  if (assistantResponse) {
    updated.push({
      role: "assistant",
      content: assistantResponse,
      timestamp: Date.now(),
    });
  }
  conversations.set(senderId, updated.slice(-40));
}

export const emotibotService = {
  async handleMessage(
    messageText: string,
    senderId?: string,
    quickReplyPayload?: string
  ): Promise<EmotibotResponse> {
    const lower = messageText.toLowerCase();

    // 1. Crisis — highest priority
    for (const keyword of CRISIS_KEYWORDS) {
      if (lower.includes(keyword)) {
        return { text: CRISIS_RESPONSE };
      }
    }

    const state = getState(senderId);
    const history = getHistory(senderId);

    // 2. GREETING — first message, show emotion buttons
    if (state === "GREETING") {
      try {
        const result = await geminiService.generateWithTools(
          messageText,
          history
        );

        if (senderId) {
          setState(senderId, "WAITING_FOR_FEELING");

          if (result.type === "function_call") {
            saveConversation(senderId, history, messageText);
          } else {
            saveConversation(senderId, history, messageText, result.text);
          }
        }

        if (result.type === "function_call") {
          const greeting =
            (result.functionCall.args.greeting as string) ??
            "How are you feeling today?";

          return {
            text: greeting,
            quickReplies: EMOTION_QUICK_REPLIES.map((qr) => ({
              title: qr.title,
              payload: qr.payload,
            })),
          };
        }

        return { text: result.text };
      } catch {
        if (senderId) setState(senderId, "WAITING_FOR_FEELING");
        return {
          text:
            "Sorry, I'm having a little trouble responding right now. Please try again in a moment!",
        };
      }
    }

    // 3. WAITING_FOR_FEELING + FEELING_OTHER — warm invitation, no buttons
    if (state === "WAITING_FOR_FEELING" && quickReplyPayload === "FEELING_OTHER") {
      const invitation =
        TALK_ABOUT_IT_RESPONSES[
          Math.floor(Math.random() * TALK_ABOUT_IT_RESPONSES.length)
        ];

      if (senderId) {
        setState(senderId, "FREE_CHAT");
        saveConversation(senderId, history, messageText, invitation);
      }

      return { text: invitation };
    }

    // 4. WAITING_FOR_FEELING (emotion button or plain text) or FREE_CHAT
    //    → send to Gemini WITHOUT tools so it can never call show_feeling_buttons
    if (senderId && state === "WAITING_FOR_FEELING") {
      setState(senderId, "FREE_CHAT");
    }

    try {
      const result = await geminiService.generateResponse(messageText, history);

      if (senderId) {
        saveConversation(senderId, history, messageText, result);
      }

      return { text: result };
    } catch {
      return {
        text:
          "Sorry, I'm having a little trouble responding right now. Please try again in a moment!",
      };
    }
  },

  isHumanMode(senderId: string): boolean {
    const timestamp = lastTeacherReplyAt.get(senderId);
    if (timestamp === undefined) return false;
    if (Date.now() - timestamp < HUMAN_MODE_TIMEOUT_MS) return true;
    lastTeacherReplyAt.delete(senderId);
    return false;
  },

  recordTeacherReply(senderId: string): void {
    lastTeacherReplyAt.set(senderId, Date.now());
  },
};
