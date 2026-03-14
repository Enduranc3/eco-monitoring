import { pollutants } from "@/data/pollutants";

interface PollutantBarProps {
  pollutantId: string;
  value: number;
}

export default function PollutantBar({ pollutantId, value }: PollutantBarProps) {
  const info = pollutants.find((p) => p.id === pollutantId);
  if (!info) return null;

  const percentage = Math.min(100, (value / info.maxAllowedConcentration) * 100);
  const isExceeded = value > info.maxAllowedConcentration;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">
          {info.formula}{" "}
          <span className="text-slate-400 font-normal">({info.unit})</span>
        </span>
        <span className={isExceeded ? "text-red-600 font-bold" : "text-slate-600"}>
          {value} / {info.maxAllowedConcentration}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${
            isExceeded ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-emerald-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
