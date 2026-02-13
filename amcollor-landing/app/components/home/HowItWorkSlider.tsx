"use client";

import { useState, useRef } from "react";
import { Locale } from "@/app/lib/dictionaries";
import { brand } from "@/app/lib/brand";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

type Props = {
  locale: Locale;
  dict: any;
};

export default function HowItWorksSlider({ locale, dict }: Props) {
  const isFa = locale === "fa";
  const steps = dict.howItWorks.steps;
  const [index, setIndex] = useState(0);

  const prevSlide = () => setIndex(Math.max(0, index - 1));
  const nextSlide = () => setIndex(Math.min(steps.length - 1, index + 1));

  const sliderRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sliderRef, { once: true, amount: 0.3 });
  const controls = useAnimation();

  if (inView) {
    controls.start("visible");
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] }, // ✅ اصلاح شد
    },
  };

  return (
    <section
      className="py-12 md:py-12 px-6 min-h-screen text-white overflow-hidden relative snap-start"
      style={{
        background: `linear-gradient(180deg, ${brand.BackgroundDark}, ${brand.primarygreen})`,
        color: "white",
      }}
      dir={isFa ? "rtl" : "ltr"}
      ref={sliderRef}
    >
      <motion.div initial="hidden" animate={controls} variants={variants} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight px-4">
            {dict.howItWorks.title}
            <span className="block md:inline opacity-60 font-light text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 md:mt-0 md:mx-2">
              {dict.howItWorks.subtitle}
            </span>
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative px-2 sm:px-4 overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(${isFa ? index * 100 : -index * 100}%)`,
            }}
          >
            {steps.map((text: string, i: number) => (
              <motion.div
                key={i}
                className="w-full flex-shrink-0 px-2 sm:px-3 md:px-4 lg:px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={variants}
              >
                <div className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-lg shadow-2xl">
                  {/* Image Placeholder */}
                  <div className="relative h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 bg-white/20 flex items-center justify-center">
                    <span className="text-white/50 text-base sm:text-lg md:text-xl lg:text-2xl font-medium px-4 text-center">
                      Image placeholder {i + 1}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 text-center">
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed font-light px-2 sm:px-0">
                      {text}
                    </p>
                    <span
                      className={`absolute bottom-4 ${
                        isFa
                          ? "left-6 sm:left-8 md:left-12"
                          : "right-6 sm:right-8 md:right-12"
                      } opacity-20 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold select-none`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Previous / Next Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between px-4 z-20">
            <button
              onClick={prevSlide}
              className="bg-white/20 hover:bg-white/50 rounded-full p-3 text-xl"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="bg-white/20 hover:bg-white/50 rounded-full p-3 text-xl"
            >
              ›
            </button>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex justify-center gap-6 sm:gap-8 px-4 z-20">
          {steps.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
              style={{
                width: i === index ? "clamp(40px, 10vw, 60px)" : "clamp(12px, 3vw, 16px)",
                height: i === index ? "clamp(12px, 3vw, 16px)" : "clamp(12px, 3vw, 16px)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
