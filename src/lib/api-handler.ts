import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { appLogger, buildRequestMetadata, serializeError, type LogLevel } from "@/lib/logger";

type RouteContext = {
  params?: Promise<Record<string, string>> | Record<string, string>;
};

type ApiRouteHandler<TContext extends RouteContext> = (
  request: NextRequest,
  context: TContext
) => Promise<Response>;

function getLogLevelForStatus(statusCode: number): LogLevel {
  if (statusCode >= 500) {
    return "error";
  }

  if (statusCode >= 400) {
    return "warn";
  }

  return "info";
}

export function withApiLogging<TContext extends RouteContext = RouteContext>(
  route: string,
  handler: ApiRouteHandler<TContext>
) {
  return async function wrappedHandler(
    request: NextRequest,
    context: TContext
  ): Promise<Response> {
    const startedAt = performance.now();
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
    const metadata = {
      ...buildRequestMetadata(request),
      requestId,
      route,
      query: Object.fromEntries(request.nextUrl.searchParams.entries()),
    };

    appLogger.debug("API request started", metadata);

    try {
      const response = await handler(request, context);
      const durationMs = Math.round(performance.now() - startedAt);
      response.headers.set("x-request-id", requestId);

      const level = getLogLevelForStatus(response.status);
      appLogger[level]("API request completed", {
        ...metadata,
        statusCode: response.status,
        durationMs,
      });

      return response;
    } catch (error) {
      const durationMs = Math.round(performance.now() - startedAt);

      appLogger.error("API request failed", {
        ...metadata,
        statusCode: 500,
        durationMs,
        error: serializeError(error),
      });

      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Внутрішня помилка сервера",
          details: "Спробуйте повторити запит пізніше.",
        },
      };

      return NextResponse.json(response, {
        status: 500,
        headers: {
          "x-request-id": requestId,
        },
      });
    }
  };
}
