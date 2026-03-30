"use client";

import { trackEvent } from "@/lib/analytics";

interface ClientErrorContext {
  source: string;
  digest?: string;
  componentStack?: string;
  metadata?: Record<string, unknown>;
}

export async function reportClientError(
  error: Error & { digest?: string },
  context: ClientErrorContext
) {
  const payload = {
    source: context.source,
    digest: context.digest ?? error.digest,
    message: error.message,
    stack: error.stack,
    pathname: typeof window !== "undefined" ? window.location.pathname : null,
    componentStack: context.componentStack,
    metadata: context.metadata,
  };

  trackEvent("client_error", {
    source: payload.source,
    digest: payload.digest,
    pathname: payload.pathname,
  });

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/client-errors", blob);
      return;
    }

    await fetch("/api/client-errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    });
  } catch (reportError) {
    console.error("Client error reporting failed", reportError);
  }
}
