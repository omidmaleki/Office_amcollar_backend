"use client";

import { useState } from "react";
import { brand } from "../../lib/brand";
import { Locale } from "../../lib/dictionaries";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent, useMotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

type DemoProps = {
  locale: Locale;
  dict: any;
};

// Static images for each section (3 images per section)
const SECTION_IMAGES = [
  ["/images/phoner.png", "/images/phoner.png", "/images/phoner.png"],
  ["/images/phone.png", "/images/phone.jpg", "/images/phoneL.jpg"],
  ["/images/phoner.png", "/images/phonel.png", "/images/phonel.png"],
];

// Separate component for each section to fix Hooks violation
function DemoSectionItem({
  item,
  index,
  locale,
}: {
  item: any;
  index: number;
  locale: Locale;
}) {
  const reverse = index % 2 === 1;
  const ref = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get 3 images for this section
  const sectionImages = SECTION_IMAGES[index % SECTION_IMAGES.length] || SECTION_IMAGES[0];
  const currentImage = sectionImages[currentImageIndex] || sectionImages[0];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create a motion value that only increases (forward-only progress)
  const forwardProgress = useMotionValue(0);

  // Track scroll and only update forwardProgress when scrolling down
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const current = forwardProgress.get();
    // Only update if scrolling down (latest > current)
    if (latest > current) {
      forwardProgress.set(latest);
    }
    // When scrolling up, keep the current value (don't decrease)
  });

  const textX = useSpring(
    useTransform(forwardProgress, [0, 1], [reverse ? 80 : -80, 0]),
    { stiffness: 100, damping: 25 }
  );
  const imageX = useSpring(
    useTransform(forwardProgress, [0, 1], [reverse ? -120 : 120, 0]),
    { stiffness: 120, damping: 20 }
  );

  const textOpacity = useSpring(
    useTransform(forwardProgress, [0, 0.2, 1], [0, 0.5, 1]),
    { stiffness: 50, damping: 20 }
  );
  const imageOpacity = useSpring(
    useTransform(forwardProgress, [0, 0.1, 1], [0, 0.7, 1]),
    { stiffness: 50, damping: 20 }
  );

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center gap-16 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Text */}
      <motion.div
        className="flex-1 text-center lg:text-start"
        style={{ x: textX, opacity: textOpacity }}
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {item.title}
        </motion.h2>
        <motion.p
          className="mt-6 text-lg text-white/90 max-w-xl mx-auto lg:mx-0"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {item.subtitle}
        </motion.p>
      </motion.div>

      {/* Image Container with 3 Images */}
      <motion.div
        className="flex-1 flex justify-center items-center w-full"
        style={{ x: imageX, opacity: imageOpacity }}
      >
        <div className="w-full max-w-md relative">
          {/* Image Container */}
          <motion.div
            className="w-full rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl overflow-hidden relative"
            style={{ aspectRatio: "1 / 1" }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${index}-${currentImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={currentImage}
                  alt={`${item.title || "Demo"} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  style={{ objectPosition: "center" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback to placeholder on error
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/phonel.png";
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Image Indicators (dots) for 3 images */}
          <div className="flex justify-center gap-2 mt-4">
            {sectionImages.map((_, imgIdx) => (
              <button
                key={imgIdx}
                onClick={() => setCurrentImageIndex(imgIdx)}
                className={`h-2 rounded-full transition-all ${
                  currentImageIndex === imgIdx
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to image ${imgIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Demo({ locale, dict }: DemoProps) {
  const sections = dict.demo?.sections || [];

  return (
    <section
      className="overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${brand.primarygreen}, ${brand.BackgroundDark})`,
        color: "white",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col gap-32">
        {sections.map((item: any, index: number) => (
          <DemoSectionItem
            key={index}
            item={item}
            index={index}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}