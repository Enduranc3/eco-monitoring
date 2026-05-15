export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-white">EcoMonitor</p>
            <p className="text-sm">
              Система екологічного моніторингу якості повітря
            </p>
          </div>
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Верес Даніїл, ТР-32. Лабораторні роботи №1-2
          </div>
        </div>
      </div>
    </footer>
  );
}
