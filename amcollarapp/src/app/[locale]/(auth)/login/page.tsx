"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AuthAPI, ConnectionAPI, PetProfileAPI, VetAPI } from "@/lib/api";
import { validatePhoneNumber, validateOTPCode } from "@/lib/validation";

type Step = "phone" | "code";
type Role = "vet" | "owner";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const t = useTranslations("login");

  const role = searchParams.get("role") as Role | null;

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Determine primary color based on role
  const primaryColor = role === "vet" ? "#D4AF37" : "#0F5D4A";
  const primaryColorHover = role === "vet" ? "#B8941F" : "#0b4a3a";
  const primaryColorClass = role === "vet" ? "bg-[#D4AF37]" : "bg-[#0F5D4A]";
  const primaryColorHoverClass = role === "vet" ? "hover:bg-[#B8941F]" : "hover:bg-[#0b4a3a]";
  const primaryColorFocusClass = role === "vet" ? "focus:border-[#D4AF37] focus:ring-[#D4AF37]/20" : "focus:border-[#0F5D4A] focus:ring-[#0F5D4A]/20";

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Invalid role
      </div>
    );
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(null);
    
    // Real-time validation
    if (value) {
      const validation = validatePhoneNumber(value, {
        required: t("phoneNumberRequired"),
        invalidLength: t("phoneNumberInvalid"),
        invalidStart: t("phoneNumberInvalid"),
      });
      if (!validation.isValid) {
        setPhoneError(validation.error || null);
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(value);
    setCodeError(null);
    
    // Real-time validation
    if (value) {
      const validation = validateOTPCode(value, {
        required: t("otpCodeRequired"),
        invalid: t("otpCodeInvalid"),
      });
      if (!validation.isValid) {
        setCodeError(validation.error || null);
      }
    }
  };

  const sendPhone = async () => {
    setError(null);
    setPhoneError(null);

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phone, {
      required: t("phoneNumberRequired"),
      invalidLength: t("phoneNumberInvalid"),
      invalidStart: t("phoneNumberInvalid"),
    });
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || t("pleaseEnterPhone"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = role === "vet"
        ? await AuthAPI.sendVetOtp(phone)
        : await AuthAPI.sendOwnerOtp(phone);

      setStep("code");
    } catch (e) {
      console.error("❌ Failed to send code:", e);
      setError(e instanceof Error ? e.message : t("failedToSendCode"));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError(null);
    setCodeError(null);

    // Validate OTP code
    const codeValidation = validateOTPCode(code, {
      required: t("otpCodeRequired"),
      invalid: t("otpCodeInvalid"),
    });
    if (!codeValidation.isValid) {
      setCodeError(codeValidation.error || t("invalidCode"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        role === "vet"
          ? await AuthAPI.verifyVetOtp(phone, code)
          : await AuthAPI.verifyOwnerOtp(phone, code);

      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          role,
          user: { phone },
          expireAt: Date.now() + 24 * 60 * 60 * 1000,
        })
      );

      // Redirect logic for owners
      if (role === "owner") {
        try {
          const connectionStatus = await ConnectionAPI.getConnectionStatus();

          if (!connectionStatus.isConnected) {
            router.push("/owner/connection");
          } else {
            const isProfileComplete = await PetProfileAPI.isProfileComplete();

            if (!isProfileComplete) {
              router.push("/owner/pet/onboarding");
            } else {
              router.push("/owner/dashboard");
            }
          }
        } catch (error) {
          console.error("Failed to check connection/profile status:", error);
          router.push("/owner/connection");
        }
      } else {
        const isDevelopment = process.env.NODE_ENV === "development";
        if (isDevelopment) {
          router.push("/vet/dashboard");
          return;
        }

        try {
          const vetStatus = await VetAPI.checkStatus(phone);

          if (vetStatus.status === "APPROVED") {
            router.push("/vet/dashboard");
          } else {
            localStorage.setItem("vetRegistrationPhone", phone);
            router.push("/vet/register");
          }
        } catch (error) {
          console.error("Failed to check vet status:", error);
          localStorage.setItem("vetRegistrationPhone", phone);
          router.push("/vet/register");
        }
      }
    } catch (e) {
      setError(t("invalidCode"));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1f1a] p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#102a23] p-6 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-white">
          {role === "vet" ? t("vetLogin") : t("ownerLogin")}
        </h1>

        {/* Phone Input */}
        <div className="mb-4">
          <input
            type="tel"
            value={phone}
            readOnly={step === "code"}
            onChange={handlePhoneChange}
            placeholder={t("phoneNumber")}
            className={`w-full rounded-xl border ${
              phoneError ? "border-red-500" : "border-white/20"
            } bg-transparent px-4 py-3 text-white placeholder-gray-400 transition-colors ${primaryColorFocusClass} focus:outline-none focus:ring-2`}
          />
          {phoneError && (
            <p className="mt-1 text-sm text-red-400">{phoneError}</p>
          )}
        </div>

        {/* Code Input */}
        {step === "code" && (
          <div className="mb-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              placeholder={t("otpCode")}
              className={`w-full rounded-xl border ${
                codeError ? "border-red-500" : "border-white/20"
              } bg-transparent px-4 py-3 text-white placeholder-gray-400 transition-colors ${primaryColorFocusClass} focus:outline-none focus:ring-2`}
            />
            {codeError && (
              <p className="mt-1 text-sm text-red-400">{codeError}</p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/20 p-3">
            <p className="text-center text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={loading || (step === "phone" && !!phoneError) || (step === "code" && !!codeError)}
          onClick={(e) => {
            e.preventDefault();
            if (step === "phone") {
              sendPhone();
            } else {
              verifyCode();
            }
          }}
          className={`w-full rounded-xl ${primaryColorClass} ${primaryColorHoverClass} py-3 font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading
            ? t("pleaseWait")
            : step === "phone"
            ? t("sendCode")
            : t("verifyLogin")}
        </button>
      </div>
    </div>
  );
}