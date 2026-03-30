import { NextRequest, NextResponse } from "next/server";

function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return headers.get("x-real-ip");
}

function logIncomingRequest(request: NextRequest, requestId: string) {
  console.info(
    JSON.stringify({
      level: "info",
      message: "Incoming request",
      timestamp: new Date().toISOString(),
      requestId,
      method: request.method,
      url: request.url,
      pathname: request.nextUrl.pathname,
      userAgent: request.headers.get("user-agent"),
      ip: getClientIp(request.headers),
      referer: request.headers.get("referer"),
    })
  );
}

export function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  logIncomingRequest(request, requestId);

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
