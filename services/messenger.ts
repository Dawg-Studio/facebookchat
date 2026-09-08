import { FACEBOOK_GRAPH_API_BASE } from "@/lib/constants";
import { FacebookSendApiResponse } from "@/types/facebook";
import { FacebookApiError } from "@/utils/errors";
import { logger } from "@/utils/logger";

function getPageAccessToken(): string {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing FACEBOOK_PAGE_ACCESS_TOKEN environment variable");
  }
  return token;
}

export const messengerService = {
  async sendTextMessage(
    recipientId: string,
    text: string,
    quickReplies?: Array<{ title: string; payload: string }>
  ): Promise<FacebookSendApiResponse> {
    const token = getPageAccessToken();
    const url = `${FACEBOOK_GRAPH_API_BASE}?access_token=${encodeURIComponent(token)}`;

    const message: Record<string, unknown> = { text, metadata: "bot" };
    if (quickReplies) {
      message.quick_replies = quickReplies.map((qr) => ({
        content_type: "text",
        title: qr.title,
        payload: qr.payload,
      }));
    }

    const body = {
      recipient: { id: recipientId },
      message,
      messaging_type: "RESPONSE" as const,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error("Facebook Send API error", {
          status: response.status,
          error: data,
          recipientId,
        });
        throw new FacebookApiError(
          data?.error?.message ?? "Facebook Send API request failed",
          response.status
        );
      }

      return data as FacebookSendApiResponse;
    } catch (error) {
      if (error instanceof FacebookApiError) throw error;
      const message =
        error instanceof Error ? error.message : "Unknown error";
      throw new FacebookApiError(`Failed to send message: ${message}`);
    }
  },

  async markSeen(recipientId: string): Promise<void> {
    const token = getPageAccessToken();
    const url = `${FACEBOOK_GRAPH_API_BASE}?access_token=${encodeURIComponent(token)}`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        sender_action: "mark_seen",
      }),
    });
  },

  async sendTypingIndicator(
    recipientId: string,
    on: boolean = true
  ): Promise<void> {
    const token = getPageAccessToken();
    const url = `${FACEBOOK_GRAPH_API_BASE}?access_token=${encodeURIComponent(token)}`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        sender_action: on ? "typing_on" : "typing_off",
      }),
    });
  },
};
