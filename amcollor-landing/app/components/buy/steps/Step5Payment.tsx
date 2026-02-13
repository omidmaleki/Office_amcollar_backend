"use client";

import { motion } from "framer-motion";
import { BuyState, PAYMENT_METHODS } from "../types";
import { brand } from "@/app/lib/brand";

type Props = {
  state: BuyState;
  onChange: (patch: Partial<BuyState>) => void;
  onNext: () => void;
  onPrev: () => void;
  dict: any;
  locale: "fa" | "en";
};

export default function Step5Payment({ state, onChange, onNext, onPrev, dict, locale }: Props) {
  const isFa = locale === "fa";

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {isFa ? "انتخاب روش پرداخت" : "Payment Method"}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {isFa ? "روش پرداخت مورد نظر خود را انتخاب کنید" : "Choose your preferred payment method"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {PAYMENT_METHODS.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ paymentMethod: method.id })}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              state.paymentMethod === method.id
                ? "border-white bg-white text-neutral-900 shadow-lg"
                : "border-white/30 bg-white/10 text-white hover:border-white/60"
            }`}
          >
            <div className="font-bold text-lg mb-1">
              {isFa ? (method as any).nameFa || method.name : method.name}
            </div>
            <div className={`text-xs ${state.paymentMethod === method.id ? "opacity-80" : "opacity-60"}`}>
              {isFa ? (method as any).descriptionFa || method.description : method.description}
            </div>
            {state.paymentMethod === method.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-3 flex justify-end"
              >
                <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/95 flex items-center justify-center">
                    <svg className="w-2 h-2 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold border-2 border-white/30 text-white hover:border-white/60 transition-colors"
        >
          {isFa ? "← بازگشت" : "← Back"}
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!state.paymentMethod}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold text-neutral-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: state.paymentMethod ? brand.primarygold : `${brand.primarygold}40`,
          }}
          onMouseEnter={(e) => {
            if (state.paymentMethod) {
              e.currentTarget.style.backgroundColor = '#B8941F';
            }
          }}
          onMouseLeave={(e) => {
            if (state.paymentMethod) {
              e.currentTarget.style.backgroundColor = brand.primarygold;
            }
          }}
        >
          {isFa ? "ادامه" : "Continue"}
        </motion.button>
      </div>
    </div>
  );
}