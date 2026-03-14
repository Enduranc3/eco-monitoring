import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про проєкт — EcoMonitor",
  description: "Інформація про систему екологічного моніторингу EcoMonitor",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Про проєкт</h1>

      <div className="prose max-w-none space-y-8">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Що таке EcoMonitor?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            EcoMonitor — це веб-додаток для моніторингу якості повітря в
            реальному часі. Система збирає дані з мережі моніторингових станцій,
            розташованих у різних містах України, та надає зручний інтерфейс для
            перегляду та аналізу екологічних показників.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Технології
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Next.js 16",
                desc: "React-фреймворк з підтримкою SSR, SSG та App Router",
              },
              {
                name: "TypeScript",
                desc: "Строга типізація для надійного та масштабованого коду",
              },
              {
                name: "Tailwind CSS 4",
                desc: "Утилітарний CSS-фреймворк для швидкої розробки UI",
              },
              {
                name: "React 19",
                desc: "Бібліотека для побудови інтерактивних інтерфейсів",
              },
            ].map((tech) => (
              <div
                key={tech.name}
                className="border border-slate-100 rounded-lg p-4"
              >
                <h3 className="font-semibold text-emerald-700">{tech.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Можливості системи
          </h2>
          <ul className="space-y-3">
            {[
              "Перегляд даних з моніторингових станцій у реальному часі",
              "Детальна інформація про кожну станцію з графіками",
              "Індекс якості повітря (AQI) з кольоровою індикацією рівнів",
              "Моніторинг концентрацій PM2.5, PM10, NO₂, SO₂, CO, O₃",
              "REST API для інтеграції з іншими системами",
              "Фільтрація, сортування та пагінація даних",
              "Серверний рендеринг (SSR) для актуальних даних",
              "Статична генерація (SSG) для довідкової інформації",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-slate-600">
                <svg
                  className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Індекс якості повітря (AQI)
          </h2>
          <p className="text-slate-600 mb-4">
            AQI — це числовий показник, що відображає загальний стан якості
            повітря. Чим вищий індекс, тим гірша якість повітря.
          </p>
          <div className="space-y-2">
            {[
              { range: "0 — 50", label: "Добре", color: "bg-green-500" },
              { range: "51 — 100", label: "Помірно", color: "bg-yellow-500" },
              { range: "101 — 150", label: "Шкідливо для чутливих груп", color: "bg-orange-500" },
              { range: "151 — 200", label: "Шкідливо", color: "bg-red-500" },
              { range: "201 — 300", label: "Дуже шкідливо", color: "bg-purple-600" },
              { range: "301+", label: "Небезпечно", color: "bg-red-900" },
            ].map((level) => (
              <div key={level.range} className="flex items-center gap-3">
                <span className={`w-4 h-4 rounded ${level.color} flex-shrink-0`} />
                <span className="text-sm font-medium text-slate-700 w-24">
                  {level.range}
                </span>
                <span className="text-sm text-slate-600">{level.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
          <h2 className="text-xl font-semibold text-emerald-900 mb-2">
            Автор
          </h2>
          <p className="text-emerald-800">
            Верес Даніїл, група ТР-32
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            Лабораторна робота №1 — Веб-орієнтована розробка системи
            екологічного моніторингу
          </p>
        </section>
      </div>
    </div>
  );
}
