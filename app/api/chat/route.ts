import { NextRequest, NextResponse } from "next/server";

import { ChatRequestSchema } from "@/lib/schemas";
import { geminiService } from "@/services/gemini";
import { logger } from "@/utils/logger";
import { handleApiError } from "@/utils/errors";
import type { ConversationMessage, ChatResponse } from "@/types/chat";

const conversations = new Map<string, ConversationMessage[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ChatRequestSchema.parse(body);

    const { message, senderId } = parsed;

    const history = conversations.get(senderId) ?? [];

    const geminiReply = await geminiService.generateResponse(
      message,
      history.slice(-20)
    );

    history.push(
      { role: "user", content: message, timestamp: Date.now() },
      { role: "assistant", content: geminiReply, timestamp: Date.now() }
    );
    conversations.set(senderId, history);

    const response: ChatResponse = {
      reply: geminiReply,
      senderId,
    };

    logger.info("Chat API processed", { senderId });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Chat POST");
  }
}
