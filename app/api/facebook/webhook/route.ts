import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { WebhookQuerySchema, FacebookWebhookEventSchema } from "@/lib/schemas";
import { emotibotService } from "@/services/emotibot";
import { messengerService } from "@/services/messenger";
import { logger } from "@/utils/logger";
import { handleApiError } from "@/utils/errors";

function verifySignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appSecret) {
    logger.warn(
      "FACEBOOK_APP_SECRET not configured, skipping signature verification"
    );
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha1", appSecret)
    .update(payload)
    .digest("hex");

  const sig = signature.replace("sha1=", "");
  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expectedSignature)
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = WebhookQuerySchema.parse({
      "hub.mode": searchParams.get("hub.mode"),
      "hub.verify_token": searchParams.get("hub.verify_token"),
      "hub.challenge": searchParams.get("hub.challenge"),
    });

    const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

    if (!verifyToken) {
      logger.error("FACEBOOK_VERIFY_TOKEN not configured");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    if (
      params["hub.mode"] !== "subscribe" ||
      params["hub.verify_token"] !== verifyToken
    ) {
      logger.warn("Webhook verification failed", {
        mode: params["hub.mode"],
      });
      return new NextResponse("Verification failed", { status: 403 });
    }

    logger.info("Webhook verified successfully");
    return new NextResponse(params["hub.challenge"], { status: 200 });
  } catch (error) {
    return handleApiError(error, "Webhook GET");
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature");

    if (!verifySignature(rawBody, signature)) {
      logger.warn("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 403 });
    }

    const payload = JSON.parse(rawBody);
    const parsed = FacebookWebhookEventSchema.parse(payload);

    for (const entry of parsed.entry) {
      for (const event of entry.messaging) {
        // Echo — skip if it's our own bot message (metadata:"bot"), else it's a teacher reply
        if (event.message?.is_echo) {
          if (event.message.metadata === "bot") continue;
          const studentId = event.recipient.id;
          emotibotService.recordTeacherReply(studentId);
          logger.info("Teacher reply detected — enabling human mode", {
            studentId,
          });
          continue;
        }

        const senderId = event.sender.id;
        const messageText = event.message?.text?.trim();
        const quickReplyPayload = event.message?.quick_reply?.payload;

        // Skip bot reply if teacher is actively chatting with this student
        if (emotibotService.isHumanMode(senderId)) {
          logger.info("Teacher is active — skipping bot reply", { senderId });
          continue;
        }

        if (!messageText && !event.postback) continue;

        if (event.postback) {
          const reply = `You said: ${event.postback.payload}`;
          await messengerService.sendTextMessage(senderId, reply);
          logger.info("Processed postback", {
            senderId,
            payload: event.postback.payload,
          });
          continue;
        }

        await messengerService.markSeen(senderId);
        await messengerService.sendTypingIndicator(senderId, true);

        const response = await emotibotService.handleMessage(
          messageText!,
          senderId,
          quickReplyPayload
        );
        await messengerService.sendTypingIndicator(senderId, false);

        await messengerService.sendTextMessage(
          senderId,
          response.text,
          response.quickReplies
        );

        logger.info("Message processed successfully", { senderId });
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Webhook POST");
  }
}
