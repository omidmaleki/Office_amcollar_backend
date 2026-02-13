"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/app/lib/dictionaries";

type Props = {
  locale: Locale;
  dict: any;
  purchasedCount?: number;
};

const TOTAL = 1000;

export default function StatsSection({
  locale,
  dict,
  purchasedCount = 0,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (purchasedCount <= 0) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= purchasedCount) {
          clearInterval(interval);
          return purchasedCount;
        }
        return prev + 5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [purchasedCount]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      {/* ===== Background Image ===== */}
      {/* ===== Desktop Background ===== */}
<Image
  src="/images/Banner.png"
  alt="AMCOLLOR Exclusive Pet"
  fill
  priority
  className="hidden md:block object-cover"
/>

{/* ===== Mobile Background ===== */}
<Image
  src="/images/Bannerstatus.png"
  alt="AMCOLLOR Exclusive Pet Mobile"
  fill
  priority
  className="block md:hidden object-cover"
/>


      {/* ===== Overlay (برای خوانایی متن) ===== */}
      <div className="absolute inset-0 bg-black/40" />
{/* ===== Content ===== */}
<div className="absolute inset-0 z-10 flex items-center">
  <div
    className={[
      "w-full max-w-xl px-6 md:px-14",
      locale === "fa" ? "ms-auto text-right items-end" : "me-auto text-left items-start",
      "flex flex-col",
    ].join(" ")}
  >
    {/* Counter */}
   <div className="text-6xl md:text-7xl font-bold text-[#C9A24D]">
      {count}
      <span className="text-2xl md:text-3xl text-white mx-2">
        / {TOTAL}
      </span>
    </div>

    <p className="mt-2 text-sm tracking-widest uppercase text-emerald-200">
      {dict.statsSection.counterLabel}
    </p>

    {/* Text */}
    <h2 className="mt-6 text-3xl md:text-4xl font-semibold text-white leading-tight">
      {dict.statsSection.title}
    </h2>

    <p className="mt-4 text-emerald-100 leading-relaxed">
      {dict.statsSection.description}
    </p>

    <button className="mt-8 w-fit px-10 py-3 rounded-full bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition">
      {dict.statsSection.cta}
    </button>
  </div>
</div>



    </section>
  );
}
