"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Card from "./Card";
import Feature from "./Feature";
import { brand } from "@/app/lib/brand";
import {
  HeartPulse,
  Thermometer,
  Activity,
  Moon,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

type Props = {
  locale: "fa" | "en";
  dict: any;
};

// Map labels to icons (same for both languages)
const iconMap: Record<string, React.ReactNode> = {
  heart: <HeartPulse className="w-4 h-4" />,
  temp: <Thermometer className="w-4 h-4" />,
  respiration: <Activity className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  sleep: <Moon className="w-4 h-4" />,
  healthScore: <TrendingUp className="w-4 h-4" />,
  painDetection: <AlertTriangle className="w-4 h-4" />,
  healthAlerts: <AlertTriangle className="w-4 h-4" />,
  trendAnalysis: <TrendingUp className="w-4 h-4" />,
  breedComparison: <TrendingUp className="w-4 h-4" />,
};

// Helper to render items with glassy circle + icon (for Section 2)
const renderItemsWithIcons = (items: string[]) =>
  items.map((label) => {
    const labelLower = label.toLowerCase();
    let icon: React.ReactNode = null;

    if (labelLower.includes('heart') || labelLower.includes('pulse') || labelLower.includes('ضربان')) {
      icon = <HeartPulse className="w-4 h-4" />;
    } else if (labelLower.includes('temp') || labelLower.includes('دما')) {
      icon = <Thermometer className="w-4 h-4" />;
    } else if (labelLower.includes('respiration') || labelLower.includes('breath') || labelLower.includes('تنفس')) {
      icon = <Activity className="w-4 h-4" />;
    } else if (labelLower.includes('activity') || labelLower.includes('فعالیت')) {
      icon = <Activity className="w-4 h-4" />;
    } else if (labelLower.includes('sleep') || labelLower.includes('خواب')) {
      icon = <Moon className="w-4 h-4" />;
    } else if (labelLower.includes('score') || labelLower.includes('wellness') || labelLower.includes('امتیاز')) {
      icon = <TrendingUp className="w-4 h-4" />;
    } else if (labelLower.includes('pain') || labelLower.includes('درد')) {
      icon = <AlertTriangle className="w-4 h-4" />;
    } else if (labelLower.includes('alert') || labelLower.includes('هشدار')) {
      icon = <AlertTriangle className="w-4 h-4" />;
    } else if (labelLower.includes('trend') || labelLower.includes('analysis') || labelLower.includes('روند')) {
      icon = <TrendingUp className="w-4 h-4" />;
    } else if (labelLower.includes('breed') || labelLower.includes('نژاد')) {
      icon = <TrendingUp className="w-4 h-4" />;
    }

    return (
      <div key={label} className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-full w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 flex-shrink-0"
          style={{ color: brand.primarygold }}
        >
          {icon}
        </div>
        <span className="text-sm text-white/90 leading-relaxed">{label}</span>
      </div>
    );
  });

export default function AiMonitoringSection({ locale, dict }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const t = dict?.monitoring ?? {};

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

 
  const firstOpacity = useTransform(scrollYProgress, [0, 0.499, 0.5, 1], [1, 1, 0, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0, 0.499, 0.5, 1], [0, 0, 1, 1]);

  return (
    <section
      ref={ref}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="relative bg-primarygreen overflow-x-hidden"
      style={{ background: brand.primarygreen }}
    >
      {/* ============================ MOBILE ============================ */}
      <div className="md:hidden px-6 py-24 space-y-32">
        <div className="flex flex-col items-center">
          <div className="relative w-[260px] h-[260px] mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-[#0F5D4A]/40 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-black/30 border border-white/20" />
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Card items={renderItemsWithIcons(t?.section1?.featuresList ?? [])} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
          <Card
            title={t?.section2?.cards?.vitals?.title ?? ""}
            items={renderItemsWithIcons(t?.section2?.cards?.vitals?.items ?? [])}
            index={0}
          />
          <Card
            title={t?.section2?.cards?.analytics?.title ?? ""}
            items={renderItemsWithIcons(t?.section2?.cards?.analytics?.items ?? [])}
            index={1}
          />
          <Card
            title={t?.section2?.cards?.alerts?.title ?? ""}
            items={renderItemsWithIcons(t?.section2?.cards?.alerts?.items ?? [])}
            index={2}
          />
        </div>
      </div>

      {/* ============================ DESKTOP ============================ */}
      <div className="hidden md:block relative h-screen">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            style={{ opacity: firstOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-[480px] h-[480px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-[#0F5D4A]/40 blur-xl" />
              <div className="relative w-full h-full rounded-full bg-black/30 border border-white/20" />

              <Feature
                label={t?.section1?.features?.vitalSigns ?? ""}
                position="leftTop"
                isRTL={locale === "fa"}
              />
              <Feature
                label={t?.section1?.features?.location ?? ""}
                position="leftBottom"
                isRTL={locale === "fa"}
              />
              <Feature
                label={t?.section1?.features?.healthData ?? ""}
                position="right"
                isRTL={locale === "fa"}
              />
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: secondOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="grid grid-cols-3 gap-6 max-w-7xl px-6 relative">
              <Card
                title={t?.section2?.cards?.vitals?.title ?? ""}
                items={renderItemsWithIcons(t?.section2?.cards?.vitals?.items ?? [])}
                index={0}
              />
              <Card
                title={t?.section2?.cards?.analytics?.title ?? ""}
                items={renderItemsWithIcons(t?.section2?.cards?.analytics?.items ?? [])}
                index={1}
              />
              <Card
                title={t?.section2?.cards?.alerts?.title ?? ""}
                items={renderItemsWithIcons(t?.section2?.cards?.alerts?.items ?? [])}
                index={2}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}