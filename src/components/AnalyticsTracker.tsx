"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageView, trackEvent } from "@/lib/analytics";

function getPageLoadTime() {
  if (typeof window === "undefined") {
    return null;
  }

  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined;

  if (navigationEntry && navigationEntry.loadEventEnd > 0) {
    return Math.round(navigationEntry.loadEventEnd);
  }

  return null;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionStartedAtRef = useRef<number | null>(null);
  const lastTrackedPathRef = useRef<string | null>(null);

  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (sessionStartedAtRef.current === null) {
      sessionStartedAtRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    if (lastTrackedPathRef.current === currentPath) {
      return;
    }

    pageView(currentPath, document.title);
    lastTrackedPathRef.current = currentPath;
  }, [currentPath]);

  useEffect(() => {
    const loadTimeMs = getPageLoadTime();
    if (loadTimeMs === null) {
      return;
    }

    trackEvent("page_load_time", {
      page_path: currentPath,
      load_time_ms: loadTimeMs,
    });
  }, [currentPath]);

  useEffect(() => {
    function handlePageHide() {
      if (sessionStartedAtRef.current === null) {
        return;
      }

      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - sessionStartedAtRef.current) / 1000)
      );

      trackEvent("session_duration", {
        duration_seconds: durationSeconds,
        last_page: lastTrackedPathRef.current ?? currentPath,
      });
    }

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [currentPath]);

  return null;
}
