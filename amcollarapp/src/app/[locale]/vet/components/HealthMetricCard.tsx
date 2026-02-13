"use client";

import { LucideIcon } from "lucide-react";

interface HealthMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export default function HealthMetricCard({
  icon: Icon,
  label,
  value,
  unit,
  color = "text-[#D4AF37]",
}: HealthMetricCardProps) {
  return (
    <div
      className="
        rounded-lg sm:rounded-xl
        bg-white
        p-3 sm:p-4
        shadow-sm
        transition-all
        hover:shadow-md
        w-full
      "
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Icon */}
        <div
          className={`
            flex items-center justify-center
            rounded-md sm:rounded-lg
            bg-gray-50
            ${color}
            w-8 h-8 sm:w-10 sm:h-10
            flex-shrink-0
          `}
        >
          <Icon size={16} className="sm:hidden" />
          <Icon size={20} className="hidden sm:block" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-gray-600 truncate">
            {label}
          </p>

          <p className="mt-0.5 sm:mt-1 text-base sm:text-lg font-semibold text-gray-900 truncate">
            {value}
            {unit && (
              <span className="ml-1 text-xs sm:text-sm text-gray-500">
                {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}