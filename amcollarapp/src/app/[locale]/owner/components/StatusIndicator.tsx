"use client";

import { Moon, Bell, Thermometer } from "lucide-react";

interface StatusIndicatorProps {
  icon: "moon" | "bell" | "thermometer";
  value: string | number;
  label: string;
  unit?: string;
}

const iconMap = {
  moon: Moon,
  bell: Bell,
  thermometer: Thermometer,
};

export default function StatusIndicator({
  icon,
  value,
  label,
  unit = "",
}: StatusIndicatorProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm">
      <div className="rounded-full bg-gray-100 p-3">
        <Icon size={20} className="text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">
          {value}
          {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
        </p>
        <p className="mt-1 text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}



















