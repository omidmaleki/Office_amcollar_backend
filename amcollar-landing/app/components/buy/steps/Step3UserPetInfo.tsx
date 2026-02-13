"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BuyState } from "../types";
import { brand } from "@/app/lib/brand";
import {
  nameSchema,
  getErrorMessage,
  formatNameInput,
} from "@/app/lib/validators";

type Props = {
  state: BuyState;
  onChange: (patch: Partial<BuyState>) => void;
  onNext: () => void;
  onPrev: () => void;
  dict: any;
  locale: "fa" | "en";
};

export default function Step3UserPetInfo({ state, onChange, onNext, onPrev, dict, locale }: Props) {
  const isFa = locale === "fa";
  const [errors, setErrors] = useState<{
    ownerName?: string | null;
    petName?: string | null;
    address?: string | null;
  }>({});
  const [touched, setTouched] = useState<{
    ownerName?: boolean;
    petName?: boolean;
    address?: boolean;
  }>({});

  const handleOwnerNameChange = (value: string) => {
    const formatted = formatNameInput(value);
    onChange({ ownerName: formatted });
    setTouched({ ...touched, ownerName: true });
    
    const result = nameSchema.safeParse(formatted);
    if (!result.success) {
      setErrors({ ...errors, ownerName: getErrorMessage(result.error, locale) });
    } else {
      setErrors({ ...errors, ownerName: null });
    }
  };

  const handleOwnerNameBlur = () => {
    setTouched({ ...touched, ownerName: true });
    const result = nameSchema.safeParse(state.ownerName || "");
    if (!result.success) {
      setErrors({ ...errors, ownerName: getErrorMessage(result.error, locale) });
    } else {
      setErrors({ ...errors, ownerName: null });
    }
  };

  const handlePetNameChange = (value: string) => {
    const formatted = formatNameInput(value);
    onChange({ petName: formatted });
    setTouched({ ...touched, petName: true });
    
    const result = nameSchema.safeParse(formatted);
    if (!result.success) {
      setErrors({ ...errors, petName: getErrorMessage(result.error, locale) });
    } else {
      setErrors({ ...errors, petName: null });
    }
  };

  const handlePetNameBlur = () => {
    setTouched({ ...touched, petName: true });
    const result = nameSchema.safeParse(state.petName || "");
    if (!result.success) {
      setErrors({ ...errors, petName: getErrorMessage(result.error, locale) });
    } else {
      setErrors({ ...errors, petName: null });
    }
  };

  const handleAddressChange = (value: string) => {
    onChange({ address: value.trim() });
    setTouched({ ...touched, address: true });
    
    if (!value.trim()) {
      setErrors({ ...errors, address: isFa ? "آدرس الزامی است" : "Address is required" });
    } else {
      setErrors({ ...errors, address: null });
    }
  };

  const handleAddressBlur = () => {
    setTouched({ ...touched, address: true });
    if (!state.address?.trim()) {
      setErrors({ ...errors, address: isFa ? "آدرس الزامی است" : "Address is required" });
    } else {
      setErrors({ ...errors, address: null });
    }
  };

  const handleNext = () => {
    // Validate all required fields
    const ownerNameResult = nameSchema.safeParse(state.ownerName || "");
    const petNameResult = nameSchema.safeParse(state.petName || "");
    const addressValid = state.address?.trim();
    
    const newErrors: typeof errors = {};
    if (!ownerNameResult.success) {
      newErrors.ownerName = getErrorMessage(ownerNameResult.error, locale);
    }
    if (!petNameResult.success) {
      newErrors.petName = getErrorMessage(petNameResult.error, locale);
    }
    if (!addressValid) {
      newErrors.address = isFa ? "آدرس الزامی است" : "Address is required";
    }
    
    setErrors(newErrors);
    setTouched({ ownerName: true, petName: true, address: true });
    
    // Check if all validations pass (vetId is NOT required here)
    if (!ownerNameResult.success || !petNameResult.success || !addressValid || !state.petType) {
      return;
    }

    // Data is stored in state, proceed to next step (vet selection)
    onNext();
  };

  const isOwnerNameValid = nameSchema.safeParse(state.ownerName || "").success;
  const isPetNameValid = nameSchema.safeParse(state.petName || "").success;
  const isAddressValid = !!state.address?.trim();
  const isPetTypeSelected = !!state.petType;
  
  // Button is disabled by default, enabled only when all required fields are valid
  const canProceed = isOwnerNameValid && isPetNameValid && isAddressValid && isPetTypeSelected;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {isFa ? "اطلاعات شما و حیوان خانگی" : "Your & Pet Information"}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {isFa ? "لطفاً اطلاعات مورد نیاز را وارد کنید" : "Please provide the required information"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "نام صاحب" : "Owner Name"} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={state.ownerName || ""}
            onChange={(e) => handleOwnerNameChange(e.target.value)}
            onBlur={handleOwnerNameBlur}
            placeholder={isFa ? "نام و نام خانوادگی" : "Full Name"}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none transition-colors ${
              touched.ownerName && errors.ownerName
                ? "border-red-400"
                : touched.ownerName && isOwnerNameValid
                ? "border-green-400"
                : "border-white/30 focus:border-white"
            }`}
          />
          {touched.ownerName && errors.ownerName && (
            <p className="mt-1 text-sm text-red-400">{errors.ownerName}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "آدرس" : "Address"} <span className="text-red-400">*</span>
          </label>
          <textarea
            value={state.address || ""}
            onChange={(e) => handleAddressChange(e.target.value)}
            onBlur={handleAddressBlur}
            placeholder={isFa ? "آدرس کامل" : "Full Address"}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none transition-colors resize-none ${
              touched.address && errors.address
                ? "border-red-400"
                : touched.address && isAddressValid
                ? "border-green-400"
                : "border-white/30 focus:border-white"
            }`}
          />
          {touched.address && errors.address && (
            <p className="mt-1 text-sm text-red-400">{errors.address}</p>
          )}
        </div>

        {/* Pet Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "نام حیوان خانگی" : "Pet Name"} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={state.petName || ""}
            onChange={(e) => handlePetNameChange(e.target.value)}
            onBlur={handlePetNameBlur}
            placeholder={isFa ? "نام حیوان" : "Pet's Name"}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none transition-colors ${
              touched.petName && errors.petName
                ? "border-red-400"
                : touched.petName && isPetNameValid
                ? "border-green-400"
                : "border-white/30 focus:border-white"
            }`}
          />
          {touched.petName && errors.petName && (
            <p className="mt-1 text-sm text-red-400">{errors.petName}</p>
          )}
        </div>

        {/* Pet Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "نوع حیوان" : "Pet Type"} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {(["dog", "cat"] as const).map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange({ petType: type })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  state.petType === type
                    ? "border-white bg-white text-neutral-900 shadow-lg"
                    : "border-white/30 bg-white/10 text-white hover:border-white/60"
                }`}
              >
                <div className="text-2xl mb-2">{type === "dog" ? "🐕" : "🐈"}</div>
                <div className="font-semibold capitalize">{type}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Pet Sex */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "جنسیت" : "Sex (Optional)"}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {(["male", "female"] as const).map((sex) => (
              <motion.button
                key={sex}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange({ petSex: sex })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  state.petSex === sex
                    ? "border-white bg-white text-neutral-900 shadow-lg"
                    : "border-white/30 bg-white/10 text-white hover:border-white/60"
                }`}
              >
                <div className="font-semibold capitalize">{sex}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Pet Age */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "سن (سال)" : "Age (Years) (Optional)"}
          </label>
          <input
            type="number"
            min="0"
            max="30"
            value={state.petAge || ""}
            onChange={(e) => onChange({ petAge: parseInt(e.target.value) || undefined })}
            placeholder={isFa ? "سن حیوان" : "Pet's Age"}
            className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Pet Breed */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">
            {isFa ? "نژاد" : "Breed (Optional)"}
          </label>
          <input
            type="text"
            value={state.petBreed || ""}
            onChange={(e) => onChange({ petBreed: e.target.value })}
            placeholder={isFa ? "نژاد حیوان" : "Pet Breed"}
            className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold border-2 border-white/30 text-white hover:border-white/60 transition-colors"
        >
          {isFa ? "← بازگشت" : "← Back"}
        </button>
        <motion.button
          whileHover={{ scale: canProceed ? 1.02 : 1 }}
          whileTap={{ scale: canProceed ? 0.98 : 1 }}
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold text-neutral-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white"
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
    </div>
  );
}