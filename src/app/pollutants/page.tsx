import type { Metadata } from "next";
import { pollutants } from "@/data/pollutants";

export const metadata: Metadata = {
  title: "Довідник забруднювачів — EcoMonitor",
  description: "Типи забруднювачів повітря, їх джерела та вплив на здоров'я",
};

export default function PollutantsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Довідник забруднювачів
      </h1>
      <p className="text-slate-600 mb-8">
        Основні забруднювачі повітря, що контролюються моніторинговими станціями
      </p>

      <div className="space-y-6">
        {pollutants.map((p) => (
          <article
            key={p.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {p.name}
                </h2>
                <span className="text-sm text-slate-500 font-mono">
                  {p.formula}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">ГДК</p>
                <p className="font-bold text-emerald-700">
                  {p.maxAllowedConcentration} {p.unit}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Опис
                </h3>
                <p className="text-sm text-slate-600">{p.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Основні джерела
                </h3>
                <div className="flex flex-wrap gap-2">
                  {p.sources.map((source) => (
                    <span
                      key={source}
                      className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Вплив на здоров&apos;я
                </h3>
                <p className="text-sm text-slate-600">{p.healthEffects}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
