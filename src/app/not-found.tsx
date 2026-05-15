import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Error 404
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          Сторінку не знайдено
        </h1>
        <p className="text-slate-600">
          Можливо, адреса змінилася або сторінка недоступна. Перейдіть до
          моніторингу чи на головну сторінку.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Відкрити моніторинг
          </Link>
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
