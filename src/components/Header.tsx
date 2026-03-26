import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <span className="font-bold text-xl">EcoMonitor</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-emerald-200 transition-colors font-medium"
            >
              Головна
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-emerald-200 transition-colors font-medium"
            >
              Моніторинг
            </Link>
            <Link
              href="/about"
              className="hover:text-emerald-200 transition-colors font-medium"
            >
              Про проєкт
            </Link>
            <Link
              href="/pollutants"
              className="hover:text-emerald-200 transition-colors font-medium"
            >
              Довідник
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
