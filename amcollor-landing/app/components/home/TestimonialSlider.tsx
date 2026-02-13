"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useInView, Variants } from "framer-motion";
import { brand } from "../../lib/brand";
import type { Locale } from "@/app/lib/dictionaries";

type Testimonial = {
  id: number;
  text: string;
  author: string;
  role?: string;
};

type Props = {
  items: Testimonial[];
  locale: Locale;
};

export default function TestimonialSlider({ items, locale }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (!items || items.length === 0) return null;

  const visibleItemsDesktop = [items[index], items[(index + 1) % items.length]];
  const currentItemMobile = items[index];

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // -----------------------
  // Motion برای تیتر
  // -----------------------
  const headerRef = useRef<HTMLDivElement>(null);
  const headerControls = useAnimation();
  const headerInView = useInView(headerRef, { once: false, amount: 0.3 });
  if (headerInView) headerControls.start("visible");

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] }, // ✅ اصلاح شد
    },
  };

  // -----------------------
  // Motion کارت‌ها دسکتاپ
  // -----------------------
  const refsDesktop = visibleItemsDesktop.map(() => useRef<HTMLDivElement>(null));
  const controlsDesktop = visibleItemsDesktop.map(() => useAnimation());
  const inViewDesktop = refsDesktop.map((ref) => useInView(ref, { once: false, amount: 0.3 }));
  inViewDesktop.forEach((inView, i) => {
    if (inView) controlsDesktop[i].start("visible");
  });

  // موبایل
  const refsMobile = useRef<HTMLDivElement>(null);
  const controlsMobile = useAnimation();
  const inViewMobile = useInView(refsMobile, { once: false, amount: 0.3 });
  if (inViewMobile) controlsMobile.start("visible");

  const slideInVariants = (i: number): Variants => ({
    hidden: { opacity: 0, x: i % 2 === 0 ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
  });

  const slideInMobile: Variants = {
    hidden: { opacity: 0, x: direction > 0 ? 100 : -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
  };

  const isFa = locale === "fa";

  return (
    <section
      dir={isFa ? "rtl" : "ltr"}
      className="relative pt-5 pb-20 md:pb-28 lg:pb-32 px-6 min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${brand.BackgroundDark}, ${brand.primarygreen})`,
        color: "white",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerControls}
          variants={headerVariants}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-block rounded-full border border-white/30 px-6 py-2 text-xs font-medium tracking-widest text-white/80 uppercase">
            {isFa ? "نظرات کاربران" : "Testimonials"}
          </span>
          <h2 className="mx-auto mt-6 max-w-4xl text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
            {isFa
              ? "نظرات واقعی از صاحبان حیوانات خوشحال"
              : "Real Words from Happy Pet Owners"}
          </h2>
        </motion.div>

        {/* SLIDER */}
        <div className="relative">
          {/* موبایل */}
          <div className="md:hidden relative h-[500px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentItemMobile.id}
                ref={refsMobile}
                initial="hidden"
                animate={controlsMobile}
                variants={slideInMobile}
                exit="hidden"
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                <div className="w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-10 shadow-2xl relative">
                  <span className="absolute -top-6 left-8 text-8xl font-serif text-white/20">“</span>
                  <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/90 font-light italic text-center">
                    {currentItemMobile.text}
                  </p>
                  <div className="mt-12 text-center">
                    <p className="text-xl font-bold text-white">{currentItemMobile.author}</p>
                    {currentItemMobile.role && <p className="mt-2 text-white/70">{currentItemMobile.role}</p>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* دسکتاپ */}
          <div className="hidden md:grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              {visibleItemsDesktop.map((item, i) => (
                <motion.div
                  key={item.id}
                  ref={refsDesktop[i]}
                  initial="hidden"
                  animate={controlsDesktop[i]}
                  variants={slideInVariants(i)}
                  exit="hidden"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30, delay: i * 0.1 },
                    opacity: { duration: 0.3 },
                  }}
                  className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-12 lg:p-16 shadow-2xl relative"
                >
                  <span className="absolute -top-8 left-12 text-8xl font-serif text-white/20">“</span>
                  <p className="mt-10 text-xl lg:text-2xl leading-relaxed text-white/90 font-light italic">{item.text}</p>
                  <div className="mt-12">
                    <p className="text-xl lg:text-2xl font-bold text-white">{item.author}</p>
                    {item.role && <p className="mt-2 text-lg text-white/70">{item.role}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <div className="flex items-center gap-8">
            <button
              onClick={prev}
              className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 text-white transition-all hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={items.length <= 1}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {isFa ? "→" : "←"}
              </span>
            </button>

            <button
              onClick={next}
              className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 text-white transition-all hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={items.length <= 1}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {isFa ? "←" : "→"}
              </span>
            </button>
          </div>

          <div className="flex gap-3">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-12 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
