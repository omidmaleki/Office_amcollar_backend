"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand";
import { Locale } from "@/app/lib/dictionaries";
import Image from "next/image";

type Vet = {
  id: number;
  name: string;
  name_en?: string; // English name
  phone: string;
  address: string;
  pets: { id: number; name: string; species: string }[];
  collars: { id: number; type: string; pet_id: number }[];
  activated: boolean;
  vet_license_number: string;
  rank: string;
  created_at: string;
  image?: string;
};

export default function VetReviewSlider({ locale }: { locale: Locale }) {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- responsive ---------------- */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- data ---------------- */
  useEffect(() => {
    async function fetchVets() {
      try {
        setLoading(true);
        const res = await fetch("https://amcollar.com/api/vet/vets/");
        if (!res.ok) throw new Error(`Failed to fetch vets: ${res.status}`);
        const data: Vet[] = await res.json();
        setVets(data.filter((v: Vet) => v.activated));
      } catch {
        setVets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVets();
  }, []);

  /* ---------------- autoplay ---------------- */
  useEffect(() => {
    if (!vets.length) return;
    const t = setInterval(() => setCurrentIndex(i => (i + 1) % vets.length), 4500);
    return () => clearInterval(t);
  }, [vets.length]);

  /* ---------------- helpers ---------------- */
  const getName = (vet: Vet) => (locale === "en" && vet.name_en ? vet.name_en : vet.name);

  // همیشه section را render می‌کنیم تا background داشته باشیم
  return (
    <section
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="relative overflow-hidden min-h-screen px-6 md:px-12 lg:px-20 py-25"
      style={{ background: `linear-gradient(180deg, ${brand.BackgroundDark}, ${brand.primarygreen})` }}
    >
      {/* Loading State - با background */}
      {loading || !vets.length ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <p className="text-center text-white/60 text-lg">
            {locale === "fa" ? "در حال بارگذاری…" : "Loading..."}
          </p>
        </div>
      ) : (
        <>
          {/* ---------- عنوان دسکتاپ ---------- */}
          <div className="absolute rotate-[-90deg] hidden lg:block" style={{ top: "35%", insetInlineEnd: "4%" }}>
            <span className="whitespace-nowrap text-xl md:text-2xl font-semibold tracking-widest text-gray-400">
              {locale === "fa" ? "لیست دامپزشکان" : "VETS LIST"}
            </span>
          </div>

          <div className="relative mx-auto max-w-6xl flex flex-col md:flex-row gap-16 items-center">
            {/* ---------- اسلایدر تصاویر ---------- */}
            <div className="relative flex md:flex-row flex-col items-center md:items-end gap-5 h-[300px] md:h-[420px]">
              {(() => {
                const visibleCount = isMobile ? 3 : 5;
                const center = 1;
                const visible = [...vets.slice(currentIndex), ...vets.slice(0, currentIndex)].slice(0, visibleCount);
                const bigIndex = (currentIndex + 1) % vets.length;
                const current = vets[bigIndex];

                return visible.map((vet, i) => {
                  const isBig = i === center;
                  const scaleValue = isBig ? (isMobile ? 1.1 : 1.25) : 0.9;

                  return (
                    <motion.div
                      key={vet.id}
                      onClick={() =>
                        setCurrentIndex((vets.indexOf(vet) - 1 + vets.length) % vets.length)
                      }
                      animate={{
                        scale: scaleValue,
                        opacity: isBig ? 1 : 0.45,
                        y: isBig ? -20 : 0,
                      }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      className={`cursor-pointer rounded-xl overflow-hidden shadow-lg bg-gray-300 flex items-center justify-center border-2 border-white/30 ${
                        isBig
                          ? "h-[200px] w-[150px] md:h-[340px] md:w-[240px]"
                          : "h-[140px] w-[110px] md:h-[200px] md:w-[150px]"
                      }`}
                    >
                      {vet.image ? (
                        <Image
                          src={vet.image}
                          alt={getName(vet)}
                          width={isBig ? 240 : 150}
                          height={isBig ? 340 : 200}
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "center" }}
                          unoptimized={vet.image.startsWith("http")}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-400" />
                      )}
                    </motion.div>
                  );
                });
              })()}
            </div>

            {/* ---------- متن دسکتاپ ---------- */}
            {(() => {
              const bigIndex = (currentIndex + 1) % vets.length;
              const current = vets[bigIndex];
              
              return (
                <div className="hidden lg:block absolute" style={{ top: "12%", insetInlineStart: locale === "fa" ? "45%" : "50%", transform: "translateX(-50%)", maxWidth: 420 }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={bigIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                      <span className="text-sm text-white/40">#{String(bigIndex + 1).padStart(2, "0")}</span>
                      <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">{getName(current)}</h2>
                      <p className="mt-2 text-sm text-white/80">{locale === "fa" ? " شماره نظام پزشکی:" : "License:"} <span className="font-semibold">{current.vet_license_number}</span></p>
                      <p className="mt-6 text-base leading-relaxed text-white/90">{current.address}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              );
            })()}
          </div>

          {/* ---------- متن موبایل ---------- */}
          {(() => {
            const bigIndex = (currentIndex + 1) % vets.length;
            const current = vets[bigIndex];
            
            return (
              <div className="md:hidden mt-10 text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.div key={bigIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                    <span className="text-sm text-white/40">#{String(bigIndex + 1).padStart(2, "0")}</span>
                    <h2 className="mt-2 text-2xl font-bold text-white">{getName(current)}</h2>
                    <p className="mt-1 text-sm text-white/80">{locale === "fa" ? "شماره نظام پزشکی:" : "License:"} {current.vet_license_number}</p>
                    <p className="mt-4 text-base text-white/90">{current.address}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })()}

          {/* ---------- متن تبلت ---------- */}
          {(() => {
            const bigIndex = (currentIndex + 1) % vets.length;
            const current = vets[bigIndex];
            
            return (
              <div className="hidden md:block lg:hidden mt-10 text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.div key={bigIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                    <span className="text-sm text-white/40">#{String(bigIndex + 1).padStart(2, "0")}</span>
                    <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">{getName(current)}</h2>
                    <p className="mt-1 text-sm text-white/80">{locale === "fa" ? "شماره نظام پزشکی:" : "License:"} <span className="font-semibold">{current.vet_license_number}</span></p>
                    <p className="mt-4 text-base leading-relaxed text-white/90">{current.address}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })()}
        </>
      )}
    </section>
  );
}