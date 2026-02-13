"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface ConcentricActivityRingsProps {
  burnedCalories: number; // 0-100
  waterConsumption: number; // 0-100
  foodConsumption: number; // 0-100
}

export default function ConcentricActivityRings({
  burnedCalories,
  waterConsumption,
  foodConsumption,
}: ConcentricActivityRingsProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("dashboard");
  
  const [burned, setBurned] = useState(0);
  const [water, setWater] = useState(0);
  const [food, setFood] = useState(0);

  const animate = (
    setter: (v: number) => void,
    target: number,
    duration = 900
  ) => {
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    let step = 0;

    const t = setInterval(() => {
      step++;
      current = Math.min(current + inc, target);
      setter(current);
      if (step >= steps) clearInterval(t);
    }, duration / steps);

    return () => clearInterval(t);
  };

  useEffect(() => {
    const c1 = animate(setBurned, burnedCalories);
    const c2 = animate(setWater, waterConsumption);
    const c3 = animate(setFood, foodConsumption);
    return () => {
      c1();
      c2();
      c3();
    };
  }, [burnedCalories, waterConsumption, foodConsumption]);

  /* --- SVG SYSTEM --- */
  const size = 240;
  const center = size / 2;

  const rings = [
    { r: 100, w: 14, value: burned, color: "#D4AF37", label: t("activity") }, // Activity
    { r: 80, w: 12, value: water, color: "#0F5D4A", label: t("water") },  // Water
    { r: 60, w: 10, value: food, color: "#10b981", label: t("food") },   // Food
  ];

  return (
    <div className={`flex w-full flex-col items-center ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Rings */}
      <div className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] aspect-square">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90"
        >
          {rings.map((ring, i) => {
            const c = 2 * Math.PI * ring.r;
            const offset = c - (ring.value / 100) * c;

            return (
              <g key={i}>
                {/* Background */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.r}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={ring.w}
                  className="text-gray-200 opacity-25"
                />
                {/* Progress */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.w}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={offset}
                  className="transition-all duration-500 ease-out"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/70 backdrop-blur-md shadow-inner" />
        </div>
      </div>

      {/* Labels */}
      <div className={`mt-6 flex flex-wrap justify-center gap-5 sm:gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
        <RingLabel color="#D4AF37" label={t("activity")} value={burned} isRTL={isRTL} />
        <RingLabel color="#0F5D4A" label={t("water")} value={water} isRTL={isRTL} />
        <RingLabel color="#10b981" label={t("food")} value={food} isRTL={isRTL} />
      </div>
    </div>
  );
}

/* ---------- Label Component ---------- */
function RingLabel({
  color,
  label,
  value,
  isRTL,
}: {
  color: string;
  label: string;
  value: number;
  isRTL: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
      <span
        className="h-3 w-3 sm:h-4 sm:w-4 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className={`flex flex-col leading-tight ${isRTL ? "text-right" : "text-left"}`}>
        <span className={`text-xs sm:text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {label}
        </span>
        <span className={`text-sm sm:text-lg font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}