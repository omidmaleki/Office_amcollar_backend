"use client";

import { brand } from "../../lib/brand";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { useRef } from "react";

type Props = {
  dict: any;
  locale: "fa" | "en";
};

export default function Comparison({ dict, locale }: Props) {
  const isFa = locale === "fa";

  const titleRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const tableInView = useInView(tableRef, { once: true, amount: 0.3 });

  const titleControls = useAnimation();
  const tableControls = useAnimation();

  if (titleInView) titleControls.start("visible");
  if (tableInView) tableControls.start("visible");

  // Variants اصلاح شده با easing آرایه‌ای
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const tableVariants: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <section
      className="relative px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-24"
      style={{
        background: `linear-gradient(180deg, ${brand.primarygreen}, ${brand.BackgroundDark})`,
        color: "white",
      }}
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl w-full">
        {/* Title */}
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleControls}
          variants={titleVariants}
          className={`mb-10 md:mb-10 text-center ${
            isFa ? "md:text-right" : "md:text-left"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            {dict.comparison.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-3xl mx-auto lg:mx-0">
            {dict.comparison.description}
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          ref={tableRef}
          initial="hidden"
          animate={tableControls}
          variants={tableVariants}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl"
        >
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-white/20 text-center font-bold bg-white/10">
            <div className="py-3 px-2 text-xs sm:text-sm md:text-base">
              {dict.comparison.table.featureHeader}
            </div>
            {dict.comparison.table.headers.map((header: string, i: number) => (
              <div key={i} className="py-3 px-2 text-xs sm:text-sm md:text-base">
                {header}
              </div>
            ))}
          </div>

          {/* Rows */}
          {dict.comparison.table.rows.map((row: any, rowIndex: number) => (
            <div
              key={rowIndex}
              className="grid grid-cols-4 items-center border-b border-white/10 last:border-b-0 text-xs sm:text-sm md:text-base"
            >
              <div className="px-2 py-3 font-medium text-white/90">{row.label}</div>
              {row.values.map((value: any, colIndex: number) => {
                // تعیین رنگ با استفاده از ! prefix برای force کردن در موبایل
                let colorClass = "";
                if (value === true) {
                  colorClass = "!text-green-400";
                } else if (value === false) {
                  colorClass = "!text-red-400";
                } else {
                  colorClass = "!text-yellow-300";
                }

                return (
                  <div
                    key={colIndex}
                    className={`py-3 text-center font-bold transition-colors duration-200 ${colorClass}`}
                  >
                    {value === true ? "✔" : value === false ? "✖" : value}
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}