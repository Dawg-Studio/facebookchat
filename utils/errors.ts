import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class FacebookApiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, "FACEBOOK_API_ERROR");
    this.name = "FacebookApiError";
  }
}

export class GeminiApiError extends AppError {
  constructor(message: string, statusCode: number = 502) {
    super(message, statusCode, "GEMINI_API_ERROR");
    this.name = "GeminiApiError";
  }
}

export function handleApiError(
  error: unknown,
  context?: string
): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";
  const logMessage = context ? `${context}: ${message}` : message;
  console.error(logMessage);

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
