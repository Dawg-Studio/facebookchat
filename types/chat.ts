export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  reply: string;
  senderId: string;
}
