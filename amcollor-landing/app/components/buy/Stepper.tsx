"use client";

import { motion } from "framer-motion";
import { BuyStep } from "./types";

type Props = {
  currentStep: BuyStep;
  onStepClick: (step: BuyStep) => void;
  locale: "fa" | "en";
};

const STEPS = [
  { num: 1, label: "Configure" },
  { num: 2, label: "Verify" },
  { num: 3, label: "Details" },
  { num: 4, label: "Veterinarian" },
  { num: 5, label: "Payment" },
  { num: 6, label: "Review" },
];

export default function PremiumStepper({ currentStep, onStepClick, locale }: Props) {
  const isFa = locale === "fa";

  return (
    <div className="flex items-center justify-between max-w-3xl p-5 mx-auto overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center min-w-max gap-1 sm:gap-2 w-full">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          const isClickable = currentStep >= step.num;

          return (
            <div key={step.num} className="flex items-center flex-1 min-w-0">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(step.num as BuyStep)}
                disabled={!isClickable}
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                } ${
                  isActive
                    ? "bg-white text-neutral-900 scale-110 shadow-lg"
                    : isCompleted
                    ? "bg-white text-neutral-900"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                ) : (
                  step.num
                )}
              </button>
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-white/20 relative overflow-hidden min-w-[20px]">
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: isCompleted ? 1 : currentStep > step.num ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}