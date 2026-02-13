"use client";

import { motion } from "framer-motion";
import { BuyState } from "./types";
import Image from "next/image";
import { formatProductPrice } from "@/app/lib/priceFormatter";

type Props = {
  state: BuyState;
  locale?: "fa" | "en";
};

export default function PremiumProductPreview({ state, locale = "fa" }: Props) {
  const strapColor = state.strapColor || "black";
  const deviceColor = state.deviceColor || "silver";
  const size = state.size || "M";
  const isFa = locale === "fa";

  const scale =
    size === "S" ? 0.9 : size === "L" ? 1.1 : 1;

  // Get formatted price based on locale
  const productPrice = formatProductPrice(locale);

  return (
    <div className="relative w-full max-w-full space-y-6">
      {/* Product Image Container */}
      <motion.div
        key={`${strapColor}-${deviceColor}-${size}`}
        initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
        }}
      >
        {/* Main Product Image */}
        <motion.div
          className="relative w-full h-full"
          style={{ scale }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <Image
            src="/images/AMcollar-pro.png"
            alt="AM Collar Pro"
            fill
            className="object-contain z-10"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        </motion.div>

        {/* Size badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-medium text-neutral-900 shadow">
          Size: {size}
        </div>
      </motion.div>

      {/* Price Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-center"
      >
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
          {productPrice}
        </div>
      </motion.div>
    </div>
  );
}