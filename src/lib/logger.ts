import "server-only";

import pino from "pino";

export type LogLevel = "error" | "warn" | "info" | "debug";

type LogPayload = Record<string, unknown>;

const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "development" ? "debug" : "info"),
  base: {
    service: "eco-monitoring",
    environment: process.env.NODE_ENV,
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return headers.get("x-real-ip");
}

export function buildRequestMetadata(request: Request) {
  const url = new URL(request.url);

  return {
    method: request.method,
    url: request.url,
    pathname: url.pathname,
    userAgent: request.headers.get("user-agent"),
    ip: getClientIp(request.headers),
  };
}

export function serializeError(error: unknown): LogPayload {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause instanceof Error ? error.cause.message : error.cause,
    };
  }

  return {
    message: String(error),
  };
}

function writeLog(level: LogLevel, message: string, payload: LogPayload = {}) {
  logger[level](payload, message);
}

export const appLogger = {
  error(message: string, payload: LogPayload = {}) {
    writeLog("error", message, payload);
  },
  warn(message: string, payload: LogPayload = {}) {
    writeLog("warn", message, payload);
  },
  info(message: string, payload: LogPayload = {}) {
    writeLog("info", message, payload);
  },
  debug(message: string, payload: LogPayload = {}) {
    writeLog("debug", message, payload);
  },
};
