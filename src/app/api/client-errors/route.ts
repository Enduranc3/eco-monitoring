import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { withApiLogging } from "@/lib/api-handler";
import { appLogger } from "@/lib/logger";

interface ClientErrorPayload {
  source?: string;
  digest?: string;
  message?: string;
  stack?: string;
  pathname?: string | null;
  componentStack?: string;
  metadata?: Record<string, unknown>;
}

export const POST = withApiLogging("/api/client-errors", async (request) => {
  const payload = (await request.json()) as ClientErrorPayload;

  if (!payload.message || !payload.source) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Поля source та message є обов'язковими",
      },
    };

    return NextResponse.json(response, { status: 400 });
  }

  appLogger.error("Client error reported", {
    source: payload.source,
    digest: payload.digest,
    message: payload.message,
    stack: payload.stack,
    pathname: payload.pathname,
    componentStack: payload.componentStack,
    metadata: payload.metadata,
  });

  const response: ApiResponse<{ received: true }> = {
    success: true,
    data: {
      received: true,
    },
  };

  return NextResponse.json(response, { status: 201 });
});
