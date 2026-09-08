import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const start = Date.now();

  const response = NextResponse.next();

  response.headers.set("X-Response-Time", `${Date.now() - start}ms`);

  if (pathname.startsWith("/api/")) {
    response.headers.set("X-Request-Path", pathname);
    response.headers.set("X-Request-Method", method);
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
