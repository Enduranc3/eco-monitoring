import { getAqiLabel, getAqiBgClass, getAqiLevel } from "@/lib/aqi";

interface AqiGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
}

export default function AqiGauge({ value, size = "md" }: AqiGaugeProps) {
  const level = getAqiLevel(value);
  const label = getAqiLabel(level);
  const bgClass = getAqiBgClass(level);

  const sizeClasses = {
    sm: "w-20 h-20 text-xl",
    md: "w-28 h-28 text-3xl",
    lg: "w-36 h-36 text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${bgClass} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {value}
      </div>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}
