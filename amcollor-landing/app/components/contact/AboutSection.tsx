"use client";

import { brand } from "@/app/lib/brand";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  locale: "fa" | "en";
};

export default function AboutSection({ locale }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // parallax values
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      {/* BACKGROUND IMAGE – PARALLAX */}
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/about-bg.jpg)",
          y: bgY,
        }}
      />

      {/* WHITE OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-white/80" />

      {/* CONTENT */}
      <motion.div
        className="mx-auto max-w-6xl px-6"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* HEADER */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold text-white">
            {locale === "fa"
              ? "ما بر حرفه‌ای‌گری و اعتماد تمرکز داریم"
              : "We Focus on Professionalism & Trust"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white opacity-90">
            {locale === "fa"
              ? "AMCOLLOR با تکیه بر تخصص، شفافیت و اخلاق حرفه‌ای تلاش می‌کند تجربه‌ای امن و قابل اعتماد برای صاحبان حیوانات خانگی فراهم کند."
              : "AMCOLLOR delivers reliable, ethical and professional solutions focused on pet health, safety and trust."}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: locale === "fa" ? "اعتماد" : "Trust",
              text:
                locale === "fa"
                  ? "پایه‌ی تمام تصمیمات و طراحی‌های ما اعتماد کاربران است."
                  : "Trust is the foundation of every decision we make.",
            },
            {
              title: locale === "fa" ? "اعتبار" : "Credibility",
              text:
                locale === "fa"
                  ? "بر اساس داده‌های دقیق و تحلیل‌های علمی."
                  : "Built on accurate data and scientific analysis.",
            },
            {
              title: locale === "fa" ? "اخلاق حرفه‌ای" : "Ethics",
              text:
                locale === "fa"
                  ? "حریم خصوصی و سلامت حیوانات برای ما اولویت است."
                  : "Privacy and animal well-being are our priority.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-8 text-white"
              style={{ background: brand.primarygold }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="mb-3 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed opacity-90">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
