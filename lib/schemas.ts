import { z } from "zod";

export const WebhookQuerySchema = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});

export const FacebookWebhookEventSchema = z.object({
  object: z.literal("page"),
  entry: z.array(
    z.object({
      id: z.string(),
      time: z.number(),
      messaging: z.array(
        z.object({
          sender: z.object({ id: z.string() }),
          recipient: z.object({ id: z.string() }),
          timestamp: z.number(),
          message: z
            .object({
              mid: z.string(),
              text: z.string().optional(),
              attachments: z
                .array(
                  z.object({
                    type: z.string(),
                    payload: z.object({
                      url: z.string().optional(),
                      title: z.string().optional(),
                    }),
                  })
                )
                .optional(),
              quick_reply: z
                .object({ payload: z.string() })
                .optional(),
              is_echo: z.boolean().optional(),
              metadata: z.string().optional(),
            })
            .optional(),
          postback: z
            .object({
              title: z.string(),
              payload: z.string(),
            })
            .optional(),
        })
      ),
    })
  ),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  senderId: z.string().min(1),
});
