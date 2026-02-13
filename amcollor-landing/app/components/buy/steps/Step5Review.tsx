"use client";

import { motion } from "framer-motion";
import { BuyState, STRAP_COLORS, DEVICE_COLORS, SIZES, PAYMENT_METHODS } from "../types";
import { brand } from "@/app/lib/brand";
import { formatPrice } from "@/app/lib/priceFormatter";

type Props = {
  state: BuyState;
  onPrev: () => void;
  dict: any;
  locale: "fa" | "en";
};

export default function Step6Review({ state, onPrev, dict, locale }: Props) {
  const isFa = locale === "fa";
  // Vet name will be stored in state when selected, or we can fetch it if needed
  // For now, we'll display the vet ID if name is not available
  const vetDisplayName = state.vetName || (state.vetId ? `Vet ID: ${state.vetId}` : "Not selected");
  
  const strapColor = STRAP_COLORS.find((c) => c.id === state.strapColor);
  const deviceColor = DEVICE_COLORS.find((c) => c.id === state.deviceColor);
  const size = SIZES.find((s) => s.id === state.size);
  const paymentMethod = PAYMENT_METHODS.find((p) => p.id === state.paymentMethod);

  // Price calculation
  const basePrice = 75000000; // 75 million tomans
  const taxRate = 0.09; // 9% tax
  const taxAmount = Math.round(basePrice * taxRate);
  const totalAmount = basePrice + taxAmount;

  const handlePayment = () => {
    // Handle payment logic
    console.log("Proceeding to payment...", state);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {isFa ? "بررسی و پرداخت" : "Review & Payment"}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {isFa ? "لطفاً اطلاعات را بررسی و تایید کنید" : "Please review and confirm your order"}
        </p>
      </div>

      {/* Product Summary */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
        <h3 className="font-bold text-lg mb-4 text-white">
          {isFa ? "محصول" : "Product"}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "رنگ بند" : "Strap"}</span>
            <span className="font-medium text-white">{strapColor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "رنگ دستگاه" : "Device"}</span>
            <span className="font-medium text-white">{deviceColor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "سایز" : "Size"}</span>
            <span className="font-medium text-white">{size?.name}</span>
          </div>
        </div>
      </div>

      {/* User & Pet Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
        <h3 className="font-bold text-lg mb-4 text-white">
          {isFa ? "اطلاعات" : "Information"}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "صاحب" : "Owner"}</span>
            <span className="font-medium text-white">{state.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "حیوان خانگی" : "Pet"}</span>
            <span className="font-medium text-white">
              {state.petName} ({state.petType})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "دامپزشک" : "Veterinarian"}</span>
            <span className="font-medium text-white">{vetDisplayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "روش پرداخت" : "Payment Method"}</span>
            <span className="font-medium text-white">
              {isFa ? (paymentMethod as any)?.nameFa || paymentMethod?.name : paymentMethod?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
        <h3 className="font-bold text-lg mb-4 text-white">
          {isFa ? "جزئیات قیمت" : "Price Details"}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "قیمت پایه" : "Base Price"}</span>
            <span className="font-medium text-white">{formatPrice(basePrice, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">{isFa ? "مالیات" : "Tax"}</span>
            <span className="font-medium text-white">{formatPrice(taxAmount, locale)}</span>
          </div>
          <div className="border-t border-white/20 pt-3 mt-3 flex justify-between">
            <span className="text-white font-semibold">{isFa ? "جمع کل" : "Total Amount"}</span>
            <span className="font-bold text-white text-lg">{formatPrice(totalAmount, locale)}</span>
          </div>
        </div>
      </div>

      {/* Total Price Highlight */}
      <div className="rounded-xl p-6 border-2 border-white/20" style={{ backgroundColor: brand.primarygold }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-neutral-900">
            {isFa ? "مبلغ قابل پرداخت" : "Total Amount"}
          </span>
          <span className="text-3xl font-bold text-neutral-900">
            {formatPrice(totalAmount, locale)}
          </span>
        </div>
        <p className="text-sm text-neutral-900/80">
          {isFa ? "شامل مالیات و ارسال" : "Including tax and shipping"}
        </p>
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
          onClick={handlePayment}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold text-neutral-900 shadow-lg transition-all"
          style={{ backgroundColor: brand.primarygold }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B8941F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = brand.primarygold;
          }}
        >
          {isFa ? "پرداخت" : "Proceed to Payment"}
        </motion.button>
      </div>
    </div>
  );
}