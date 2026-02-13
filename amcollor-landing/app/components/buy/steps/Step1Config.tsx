"use client";

import { motion } from "framer-motion";
import { BuyState, STRAP_COLORS, DEVICE_COLORS, SIZES } from "../types";
import { brand } from "@/app/lib/brand";

type Props = {
  state: BuyState;
  onChange: (patch: Partial<BuyState>) => void;
  onNext: () => void;
  dict: any;
  locale: "fa" | "en";
};

export default function Step1Config({ state, onChange, onNext, dict, locale }: Props) {
  const isFa = locale === "fa";
  const canProceed = state.strapColor && state.deviceColor && state.size;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {dict?.buy?.stepsUI?.productColor ?? (isFa ? "پیکربندی محصول" : "Configure Your Collar")}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {isFa ? "انتخاب رنگ و سایز مورد نظر" : "Choose your preferred colors and size"}
        </p>
      </div>

      {/* Strap Color */}
      <div className="space-y-3 sm:space-y-4">
        <label className="block text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wide">
          {isFa ? "رنگ بند" : "Strap Color"}
        </label>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {STRAP_COLORS.map((color) => (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange({ strapColor: color.id })}
              className={`relative w-8 h-8 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-300 ${
                state.strapColor === color.id
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/30 hover:border-white/60"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {state.strapColor === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/95 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Device Color */}
      <div className="space-y-3 sm:space-y-4">
        <label className="block text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wide">
          {isFa ? "رنگ دستگاه" : "Device Color"}
        </label>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {DEVICE_COLORS.map((color) => (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange({ deviceColor: color.id })}
              className={`relative w-8 h-8 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-300 ${
                state.deviceColor === color.id
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/30 hover:border-white/60"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {state.deviceColor === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/95 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Size - Stack on mobile, grid on larger */}
      <div className="space-y-3 sm:space-y-4">
        <label className="block text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wide">
          {isFa ? "سایز" : "Size"}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {SIZES.map((size) => {
            const sizeName = isFa ? size.nameFa : size.name;
            const sizeDescription = isFa ? size.descriptionFa : size.description;
            
            return (
              <motion.button
                key={size.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange({ size: size.id as "S" | "M" | "L" })}
                className={`p-2 rounded-xl border-2 transition-all duration-300 text-left ${
                  state.size === size.id
                    ? "border-white bg-white text-neutral-900 shadow-lg"
                    : "border-white/30 bg-white/10 text-white hover:border-white/60"
                }`}
              >
                <div className="font-bold text-lg mb-1">{sizeName}</div>
                <div className="text-xs opacity-80">{sizeDescription}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-3 sm:py-4 rounded-xl font-semibold text-neutral-900 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: canProceed ? brand.primarygold : `${brand.primarygold}40`,
        }}
        onMouseEnter={(e) => {
          if (canProceed) {
            e.currentTarget.style.backgroundColor = '#B8941F';
          }
        }}
        onMouseLeave={(e) => {
          if (canProceed) {
            e.currentTarget.style.backgroundColor = brand.primarygold;
          }
        }}
      >
        {isFa ? "ادامه" : "Continue"}
      </motion.button>
    </div>
  );
}