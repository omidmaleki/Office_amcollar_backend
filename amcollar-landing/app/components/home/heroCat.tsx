"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Locale } from "@/app/lib/dictionaries";
import FeatureOrbitSlider from "./FeatureOrbitSlider";
import { brand } from "@/app/lib/brand";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type Props = {
  locale: Locale;
  dict: any;
};

export default function HeroCat({ locale, dict }: Props) {
  const slides = dict?.heroCatSlides ?? [];
  const [active, setActive] = useState(0);
  const slideDuration = 5000;

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, slideDuration);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const current = slides[active];

  return (
    <section
  className="relative overflow-hidden min-h-screen snap-start bg-white"
>
  {/* Linear Gradient Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: `linear-gradient(180deg, ${brand.BackgroundDark}, ${brand.primarygreen})`,
    }}
  />

  {/* Content */}
  <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 flex items-start">
    {/* Orbit */}
    <div className="hidden lg:block mt-24">
      <FeatureOrbitSlider locale={locale} slideDuration={slideDuration} />
    </div>

    {/* Counter, Title, Subtitle, Button */}
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-3xl text-center space-y-4 z-30">
      <AnimatePresence mode="wait">
        <motion.h1
          key={current.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-4xl lg:text-5xl font-extrabold text-white"
        >
          {current.title}
        </motion.h1>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={current.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-white max-w-xl mx-auto"
        >
          {current.subtitle}
        </motion.p>
      </AnimatePresence>

      <div className="mt-6 flex justify-center gap-4">
         <button
                onClick={() => {
                  const demoSection = document.getElementById("demo");
                  demoSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0C4E3F] transition"
              >
                {locale === "fa" ? "دموی اپلیکیشن" : "Application Demo"}
              </button>
        <button
          onClick={() =>
            window.scrollBy({ top: 700, behavior: "smooth" })
          }
          className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          {locale === "fa" ? "اطلاعات بیشتر" : "Learn More"}
        </button>
      </div>
    </div>
  </div>

  {/* Center Image */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30">
    <div className="relative w-[320px] lg:w-[420px] h-[320px] lg:h-[420px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={current.image}
          src={current.image}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full object-contain"
        />
      </AnimatePresence>
    </div>
  </div>

  {/* Right Cards */}
  // ... existing code ...

{/* Right Cards */}
<div className="hidden lg:block absolute right-24 xl:right-60 top-1/2 -translate-y-1/2 z-40 space-y-6 scale-90 xl:scale-100">
  <AnimatePresence>
    {current.cards.map((card: string, index: number) => {
      const rotations = [-6, 4, -3, 5];
      const rotate = rotations[index % rotations.length];

      return (
        <motion.div
          key={card}
          initial={{ opacity: 0, x: 20, y: 20, scale: 0.95, rotate }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate }}
          exit={{ opacity: 0, x: 20, y: 20, scale: 0.95, rotate }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="w-44 h-36 rounded-2xl bg-gradient-to-br from-green-100/50 to-white/50 backdrop-blur-xl shadow-2xl p-4 flex flex-col items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
          style={{ transformOrigin: "center" }}
        >
          <div className="bg-white/80 rounded-full p-2 shadow-md">
            <ShieldCheck className="h-6 w-6 text-green-700" />
          </div>
          <p className="text-sm text-center font-semibold text-green-950 drop-shadow-md">
            {card}
          </p>
        </motion.div>
      );
    })}
  </AnimatePresence>
</div>
</section>

  );
}

// 🔹 Sales Counter Component
function SalesCounter({
  sold,
  total,
  locale,
}: {
  sold: number;
  total: number;
  locale: Locale;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-extrabold text-[#D4AF37]">
        {sold.toLocaleString()} / {total.toLocaleString()}
      </span>
      <span className="text-sm text-white/80 font-medium">
        {locale === "fa" ? "قلاده فروخته‌شده" : "Smart Collars Sold"}
      </span>
    </div>
  );
}
