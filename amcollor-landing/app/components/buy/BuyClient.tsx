"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BuyState, BuyStep, NEXT_STEP, PREV_STEP } from "./types";
import PremiumProductPreview from "./ProductPreview";
import PremiumStepper from "./Stepper";
import Step1Config from "./steps/Step1Config";
import Step2Phone from "./steps/Step2Phone";
import Step3UserPetInfo from "./steps/Step3UserPetInfo";
import Step4Veterinarian from "./steps/Step4Veterinarian";
import Step5Payment from "./steps/Step5Payment";
import Step6Review from "./steps/Step5Review";
import { brand } from "@/app/lib/brand";

export default function BuyClient({ dict, locale }: any) {
  const [state, setState] = useState<BuyState>({ 
    step: 1,
    strapColor: "black",
    deviceColor: "silver",
    size: "M",
  });
  const isFa = locale === "fa";

  const next = () =>
    setState((s) => ({
      ...s,
      step: NEXT_STEP[s.step],
    }));

  const prev = () =>
    setState((s) => ({
      ...s,
      step: PREV_STEP[s.step],
    }));

  const goToStep = (step: BuyStep) => {
    setState((s) => {
      if (step < s.step) {
        return { ...s, step };
      }
      
      if (step >= 2 && !s.strapColor && !s.deviceColor && !s.size) {
        return s;
      }
      
      if (step >= 3 && !s.phoneVerified) {
        return s;
      }
      
      if (step >= 4 && (!s.ownerName || !s.petName || !s.address || !s.petType)) {
        return s;
      }
      
      if (step >= 5 && !s.vetId) {
        return s;
      }
      
      if (step >= 6 && !s.paymentMethod) {
        return s;
      }
      
      return { ...s, step };
    });
  };

  const onChange = (patch: Partial<BuyState>) =>
    setState((s) => ({ ...s, ...patch }));

  // Render step content based on current step
  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return (
          <Step1Config
            state={state}
            onChange={onChange}
            onNext={next}
            dict={dict}
            locale={locale}
          />
        );
      case 2:
        return (
          <Step2Phone
            state={state}
            onChange={onChange}
            onNext={next}
            onPrev={prev}
            dict={dict}
            locale={locale}
          />
        );
      case 3:
        return (
          <Step3UserPetInfo
            state={state}
            onChange={onChange}
            onNext={next}
            onPrev={prev}
            dict={dict}
            locale={locale}
          />
        );
      case 4:
        return (
          <Step4Veterinarian
            state={state}
            onChange={onChange}
            onNext={next}
            onPrev={prev}
            dict={dict}
            locale={locale}
          />
        );
      case 5:
        return (
          <Step5Payment
            state={state}
            onChange={onChange}
            onNext={next}
            onPrev={prev}
            dict={dict}
            locale={locale}
          />
        );
      case 6:
        return (
          <Step6Review
            state={state}
            onPrev={prev}
            dict={dict}
            locale={locale}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: brand.primarygreen }}
      dir={isFa ? "rtl" : "ltr"}
    >
      {/* Progress Stepper - Sticky below navbar */}
      <div 
        className="sticky top-3 mb-10 md:top-5  z-40 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: `${brand.primarygreen}dd`,
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <PremiumStepper currentStep={state.step} onStepClick={goToStep} locale={locale} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {/* Product Preview */}
          <div className="w-full relative lg:sticky lg:top-[104px] lg:self-start">
            <PremiumProductPreview state={state} locale={locale} />
          </div>

          {/* Configuration & Steps */}
          <div className="w-full space-y-6 sm:space-y-8 mt-0 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}