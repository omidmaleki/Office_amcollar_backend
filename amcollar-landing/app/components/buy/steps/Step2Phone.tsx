"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BuyState } from "../types";
import { brand } from "@/app/lib/brand";
import {
  phoneSchema,
  otpSchema,
  formatPhoneInput,
  formatOTPInput,
  getErrorMessage,
} from "@/app/lib/validators";

type Props = {
  state: BuyState;
  onChange: (patch: Partial<BuyState>) => void;
  onNext: () => void;
  onPrev: () => void;
  dict: any;
  locale: "fa" | "en";
};

export default function Step2Phone({ state, onChange, onNext, onPrev, dict, locale }: Props) {
  const isFa = locale === "fa";
  const [showOTP, setShowOTP] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [otpTouched, setOtpTouched] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneInput(value);
    onChange({ phone: formatted });
    setPhoneTouched(true);
    setApiError(null);
    setSuccessMessage(null);
    
    // Real-time validation
    const result = phoneSchema.safeParse(formatted);
    if (!result.success) {
      setPhoneError(getErrorMessage(result.error, locale));
    } else {
      setPhoneError(null);
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    setIsPhoneFocused(false);
    const result = phoneSchema.safeParse(state.phone || "");
    if (!result.success) {
      setPhoneError(getErrorMessage(result.error, locale));
    } else {
      setPhoneError(null);
    }
  };

  const handlePhoneFocus = () => {
    setIsPhoneFocused(true);
  };

  // ... existing handleOTPChange, handleOTPBlur, handleSendOTP, handleVerifyOTP functions remain the same ...

  const handleOTPChange = (value: string) => {
    const formatted = formatOTPInput(value);
    onChange({ otp: formatted });
    setOtpTouched(true);
    setApiError(null);
    
    // Real-time validation
    const result = otpSchema.safeParse(formatted);
    if (!result.success) {
      setOtpError(getErrorMessage(result.error, locale));
    } else {
      setOtpError(null);
    }
  };

  const handleOTPBlur = () => {
    setOtpTouched(true);
    const result = otpSchema.safeParse(state.otp || "");
    if (!result.success) {
      setOtpError(getErrorMessage(result.error, locale));
    } else {
      setOtpError(null);
    }
  };

  const handleSendOTP = async () => {
    setPhoneTouched(true);
    const result = phoneSchema.safeParse(state.phone || "");
    if (!result.success) {
      setPhoneError(getErrorMessage(result.error, locale));
      return;
    }
    
    setPhoneError(null);
    setApiError(null);
    setSuccessMessage(null);
    setIsSendingOTP(true);
    setShowOTP(false); // Reset OTP view

    try {
      const phoneNumber = state.phone?.trim();
      
      // Validate phone number is present
      if (!phoneNumber) {
        throw new Error(isFa ? "شماره تماس الزامی است" : "Phone number is required");
      }

      // Ensure phone number format matches API expectation
      const requestBody = {
        phone: phoneNumber,
      };

      console.log("📤 Sending OTP request:", {
        url: "https://amcollar.com/api/auth/owners/send-otp",
        method: "POST",
        body: requestBody,
      });

      const response = await fetch("https://amcollar.com/api/auth/owners/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log("📄 Response text:", responseText);

      let data: any = {};
      
      // Try to parse as JSON if possible
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
          console.log("✅ Parsed JSON data:", data);
        } catch (parseError) {
          console.warn("⚠️ Response is not valid JSON:", parseError);
          // If response is not JSON but status is OK, treat as success
          if (response.ok) {
            console.log("✅ Non-JSON success response, proceeding...");
            setShowOTP(true);
            setSuccessMessage(
              isFa 
                ? "کد تایید با موفقیت ارسال شد. لطفاً کد دریافتی را وارد کنید." 
                : "Verification code sent successfully. Please enter the code you received."
            );
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            return;
          }
        }
      } else {
        // Empty response body
        console.log("⚠️ Empty response body");
        if (response.ok) {
          // Empty but successful - treat as success
          console.log("✅ Empty success response, proceeding...");
          setShowOTP(true);
          setSuccessMessage(
            isFa 
              ? "کد تایید با موفقیت ارسال شد. لطفاً کد دریافتی را وارد کنید." 
              : "Verification code sent successfully. Please enter the code you received."
          );
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
          return;
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = 
          data.message || 
          data.error || 
          data.detail ||
          data.error_message ||
          (typeof data === "string" ? data : null) ||
          responseText ||
          (isFa ? "خطا در ارسال کد تایید" : "Failed to send verification code");
        
        console.error("❌ API Error:", {
          status: response.status,
          statusText: response.statusText,
          data,
          responseText,
        });
        
        throw new Error(errorMessage);
      }

      // Success - show OTP input and success message
      console.log("✅ OTP sent successfully:", data);
      setShowOTP(true);
      setSuccessMessage(
        isFa 
          ? "کد تایید با موفقیت ارسال شد. لطفاً کد دریافتی را وارد کنید." 
          : "Verification code sent successfully. Please enter the code you received."
      );
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

    } catch (error: any) {
      console.error("❌ Send OTP Error:", error);
      
      // Handle different error types
      let errorMessage: string;
      
      if (error instanceof TypeError) {
        if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          // Network error (CORS, connection failure, etc.)
          errorMessage = isFa 
            ? "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید."
            : "Network error. Please check your internet connection.";
        } else {
          errorMessage = error.message || (isFa ? "خطا در ارسال کد تایید" : "Failed to send verification code");
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = isFa 
          ? "خطا در ارسال کد تایید" 
          : "Failed to send verification code";
      }
      
      console.error("❌ Final error message:", errorMessage);
      setApiError(errorMessage);
      setShowOTP(false); // Hide OTP input on error
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpTouched(true);
    const result = otpSchema.safeParse(state.otp || "");
    if (!result.success) {
      setOtpError(getErrorMessage(result.error, locale));
      return;
    }
    
    setIsVerifying(true);
    setOtpError(null);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const phoneNumber = state.phone?.trim();
      const otpCode = state.otp?.trim();

      if (!phoneNumber || !otpCode) {
        throw new Error(isFa ? "شماره تماس و کد تایید الزامی است" : "Phone number and OTP code are required");
      }

      const requestBody = {
        phone: phoneNumber,
        code: otpCode,
      };

      console.log("📤 Verifying OTP:", requestBody);

      const response = await fetch("https://amcollar.com/api/auth/owners/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Verify response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const responseText = await response.text();
      console.log("📄 Verify response text:", responseText);

      let data: any = {};

      if (responseText.trim()) {
        try {
          data = await JSON.parse(responseText);
          console.log("✅ Parsed verify JSON:", data);
        } catch (jsonError) {
          console.error("⚠️ Failed to parse verify JSON:", jsonError);
          if (response.ok) {
            // Non-JSON success response
            setSuccessMessage(
              isFa 
                ? "تایید با موفقیت انجام شد!" 
                : "Verification successful!"
            );
            onChange({ 
              phoneVerified: true,
            });
            setIsVerified(true);
            setTimeout(() => onNext(), 1500);
            return;
          }
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = 
          data.message || 
          data.error || 
          data.detail ||
          data.error_message ||
          (typeof data === "string" ? data : null) ||
          responseText ||
          (isFa ? "کد تایید نامعتبر است" : "Invalid verification code");
        
        console.error("❌ Verify API Error:", {
          status: response.status,
          statusText: response.statusText,
          data,
          responseText,
        });
        
        throw new Error(errorMessage);
      }

      // Store access token
      const accessToken = data.access_token || data.accessToken || data.token || data.access;
      console.log("🔑 Access token:", accessToken ? "Received" : "Not found", data);

      onChange({ 
        phoneVerified: true,
        accessToken: accessToken || undefined,
      });
      setIsVerified(true);
      setSuccessMessage(
        isFa 
          ? "تایید با موفقیت انجام شد!" 
          : "Verification successful!"
      );
      
      // Move to next step after a short delay
      setTimeout(() => onNext(), 1500);
    } catch (error: any) {
      console.error("❌ Verify OTP Error:", error);
      
      // Handle different error types
      let errorMessage: string;
      
      if (error instanceof TypeError) {
        if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          errorMessage = isFa 
            ? "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید."
            : "Network error. Please check your internet connection.";
        } else {
          errorMessage = error.message || (isFa ? "کد تایید نامعتبر است" : "Invalid verification code");
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = isFa 
          ? "کد تایید نامعتبر است" 
          : "Invalid verification code";
      }
      
      setApiError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const isPhoneValid = phoneSchema.safeParse(state.phone || "").success;
  const isOTPValid = otpSchema.safeParse(state.otp || "").success;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {isFa ? "تایید شماره تماس" : "Phone Verification"}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {isFa ? "برای ادامه، شماره تماس خود را وارد کنید" : "Enter your phone number to continue"}
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border-2 border-green-400 text-green-200"
        >
          {successMessage}
        </motion.div>
      )}

      {/* API Error Message */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-200"
        >
          <div className="font-semibold mb-1">{isFa ? "خطا:" : "Error:"}</div>
          <div>{apiError}</div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!showOTP && !isVerified && (
          <motion.div
            key="phone-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-white/90">
                {isFa ? "شماره تماس" : "Phone Number"}
              </label>
              <input
                type="tel"
                value={state.phone || ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={handlePhoneBlur}
                onFocus={handlePhoneFocus}
                placeholder={isFa ? "09123456789" : "09123456789"}
                maxLength={11}
                disabled={isSendingOTP}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none transition-colors disabled:opacity-50 ${
                  phoneTouched && phoneError
                    ? "border-red-400"
                    : phoneTouched && isPhoneValid
                    ? "border-green-400"
                    : "border-white/30 focus:border-white"
                }`}
              />
              {/* Error Message */}
              {phoneTouched && phoneError && (
                <p className="mt-1 text-sm text-red-400">{phoneError}</p>
              )}
              {/* Hint Text - Show when focused or always visible */}
              <AnimatePresence>
                {(isPhoneFocused || !phoneTouched) && !phoneError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-xs text-white/60 flex items-center gap-1.5"
                  >
                    <svg 
                      className="w-3.5 h-3.5 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <span>
                      {isFa 
                        ? "لطفاً شماره را با صفحه کلید انگلیسی (لاتین) وارد کنید" 
                        : "Please enter the number using English (Latin) keyboard"}
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOTP}
              disabled={!isPhoneValid || isSendingOTP}
              className="w-full py-3 text-white sm:py-4 rounded-xl font-semibold text-neutral-900 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                backgroundColor: (!isPhoneValid || isSendingOTP) ? `${brand.primarygold}40` : brand.primarygold,
              }}
              onMouseEnter={(e) => {
                if (isPhoneValid && !isSendingOTP) {
                  e.currentTarget.style.backgroundColor = '#B8941F';
                }
              }}
              onMouseLeave={(e) => {
                if (isPhoneValid && !isSendingOTP) {
                  e.currentTarget.style.backgroundColor = brand.primarygold;
                }
              }}
            >
              {isSendingOTP ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full"
                  />
                  {isFa ? "در حال ارسال..." : "Sending..."}
                </>
              ) : (
                isFa ? "ارسال کد تایید" : "Send Verification Code"
              )}
            </motion.button>
          </motion.div>
        )}

        {showOTP && !isVerified && (
          <motion.div
            key="otp-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-white/90">
                {isFa ? "کد تایید" : "Verification Code"}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={state.otp || ""}
                onChange={(e) => handleOTPChange(e.target.value)}
                onBlur={handleOTPBlur}
                placeholder={isFa ? "1234" : "1234"}
                maxLength={4}
                disabled={isVerifying}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none transition-colors text-center text-xl sm:text-2xl tracking-widest disabled:opacity-50 ${
                  otpTouched && otpError
                    ? "border-red-400"
                    : otpTouched && isOTPValid
                    ? "border-green-400"
                    : "border-white/30 focus:border-white"
                }`}
              />
              {otpTouched && otpError && (
                <p className="mt-1 text-sm text-red-400">{otpError}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyOTP}
              disabled={!isOTPValid || isVerifying}
              className="w-full py-3 sm:py-4 rounded-xl font-semibold text-neutral-900 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
              style={{
                backgroundColor: (!isOTPValid || isVerifying) ? `${brand.primarygold}40` : brand.primarygold,
              }}
              onMouseEnter={(e) => {
                if (isOTPValid && !isVerifying) {
                  e.currentTarget.style.backgroundColor = '#B8941F';
                }
              }}
              onMouseLeave={(e) => {
                if (isOTPValid && !isVerifying) {
                  e.currentTarget.style.backgroundColor = brand.primarygold;
                }
              }}
            >
              {isVerifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 text-white border-neutral-900 border-t-transparent rounded-full"
                  />
                  {isFa ? "در حال تایید..." : "Verifying..."}
                </>
              ) : (
                isFa ? "تایید" : "Verify"
              )}
            </motion.button>
          </motion.div>
        )}

        {isVerified && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
            <p className="text-lg font-semibold text-white">
              {isFa ? "تایید شد!" : "Verified!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVerified && (
        <button
          onClick={onPrev}
          className="text-sm text-white/80 hover:text-white transition-colors"
        >
          {isFa ? "← بازگشت" : "← Back"}
        </button>
      )}
    </div>
  );
}