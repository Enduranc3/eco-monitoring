"use client";

import Link from "next/link";
import { useEffect } from "react";
import { reportClientError } from "@/lib/client-error-report";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void reportClientError(error, {
      source: "app_route_error",
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
          Error 500
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Сталася внутрішня помилка
        </h1>
        <p className="text-slate-600">
          Ми вже зафіксували проблему в логах. Спробуйте повторити дію або
          повернутися на головну сторінку.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Повторити
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
