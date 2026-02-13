"use client";

import { Locale } from "@/app/lib/dictionaries";
import { ShieldCheck, MapPin, HeartPulse, Bell } from "lucide-react";
import { useEffect, useState } from "react";

type Feature = {
  id: number;
  icon: React.ElementType;
  text: { fa: string; en: string };
};

const FEATURES: Feature[] = [
  { id: 1, icon: ShieldCheck, text: { fa: "انالیز سطح استرس حیوان", en: "100% AI-Powered Security" } },
  { id: 2, icon: ShieldCheck, text: { fa: "میزان و اب و غذای مصرفی", en: "100% AI-Powered Security" } },
  { id: 3, icon: ShieldCheck, text: { fa: "امنیت ۱۰۰٪ با هوش مصنوعی", en: "100% AI-Powered Security" } },
  { id: 4, icon: MapPin, text: { fa: "ردیابی لحظه‌ای GPS", en: "Real-time GPS Tracking" } },
  { id: 5, icon: HeartPulse, text: { fa: "پایش سلامت حیوان", en: "Pet Health Monitoring" } },
  { id: 6, icon: Bell, text: { fa: "هشدار خروج از محدوده", en: "Smart Zone Alerts" } },
  { id: 7, icon: Bell, text: { fa: "تحلیل میزان و کیفیت خواب", en: "Smart Zone Alerts" } },
];

type Props = {
  locale: Locale;
  slideDuration: number;
};

export default function FeatureOrbitSlider({ locale, slideDuration }: Props) {
  const radius =150;
  const [angle, setAngle] = useState(0);

  const stepPerFrame = (360 / FEATURES.length) * (30 / slideDuration);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + stepPerFrame);
    }, 30);
    return () => clearInterval(interval);
  }, [stepPerFrame]);

  return (
    <div className="relative h-[450px] w-[300px]">
      {FEATURES.map((feature, index) => {
        const step = (360 / FEATURES.length) * index;
        const currentAngle = step + angle;
        const rad = (currentAngle * Math.PI) / 180;

        const normalized = ((currentAngle % 360) + 360) % 360;
        const isVisible = normalized <= 90 || normalized >= 270;
        const isActive = Math.abs(normalized) < 25 || Math.abs(normalized) > 335;

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const Icon = feature.icon;

        return (
          <div
            key={`${feature.id}-${index}`}
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl px-4 py-3 shadow-lg transition-all duration-300
              ${isActive ? "z-20 scale-110 bg-white text-[#0F5D4A]" : "z-10 scale-90 bg-white/70 text-gray-500 blur-[0.2px]"}`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${isActive ? 1.1 : 0.9})`,
              opacity: isVisible ? 1 : 0,
              pointerEvents: isVisible ? "auto" : "none",
            }}
          >
            <Icon className="h-5 w-5 text-[#D4AF37]" />
            <span className="whitespace-nowrap text-sm font-medium">{feature.text[locale]}</span>
          </div>
        );
      })}

      {/* Center Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[380px] w-[380px] rounded-full bg-[#0F5D4A]/10 blur-2xl" />
      </div>
    </div>
  );
}
