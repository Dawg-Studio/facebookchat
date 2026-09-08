export interface FacebookWebhookEntry {
  id: string;
  time: number;
  messaging: FacebookMessaging[];
}

export interface FacebookWebhookPayload {
  object: "page";
  entry: FacebookWebhookEntry[];
}

export interface FacebookMessaging {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: FacebookMessage;
  postback?: FacebookPostback;
  read?: FacebookRead;
  delivery?: FacebookDelivery;
}

export interface FacebookMessage {
  mid: string;
  text?: string;
  attachments?: FacebookAttachment[];
  quick_reply?: { payload: string };
  is_echo?: boolean;
}

export interface FacebookAttachment {
  type: "image" | "audio" | "video" | "file" | "location" | "fallback";
  payload: {
    url?: string;
    title?: string;
    sticker_id?: number;
    coordinates?: { lat: number; long: number };
  };
}

export interface FacebookPostback {
  title: string;
  payload: string;
  referral?: Record<string, unknown>;
}

export interface FacebookRead {
  watermark: number;
  seq: number;
}

export interface FacebookDelivery {
  mids: string[];
  watermark: number;
  seq: number;
}

export interface FacebookSendMessageRequest {
  recipient: { id: string };
  message: {
    text?: string;
    attachment?: {
      type: string;
      payload: { url: string; is_reusable?: boolean };
    };
  };
  messaging_type?: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
}

export interface FacebookSendApiResponse {
  recipient_id: string;
  message_id: string;
}
