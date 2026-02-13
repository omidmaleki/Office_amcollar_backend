"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { VetAPI } from "@/lib/api";
import { validateRequired, validateLength } from "@/lib/validation";

export default function VetRegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  
  const t = useTranslations("vetRegister");
  const tCommon = useTranslations("common");

  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [medicalCouncilNumber, setMedicalCouncilNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Field-specific errors
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [medicalCouncilNumberError, setMedicalCouncilNumberError] = useState<string | null>(null);

  // Load phone number from localStorage (set during login)
  useEffect(() => {
    const storedPhone = localStorage.getItem("vetRegistrationPhone");
    if (storedPhone) {
      setPhone(storedPhone);
    } else {
      router.push("/login?role=vet");
    }
  }, [router]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    setFirstNameError(null);
    
    if (value) {
      const validation = validateLength(value, 2, 50, t("firstNameInvalid"));
      if (!validation.isValid) {
        setFirstNameError(validation.error || null);
      }
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    setLastNameError(null);
    
    if (value) {
      const validation = validateLength(value, 2, 50, t("lastNameInvalid"));
      if (!validation.isValid) {
        setLastNameError(validation.error || null);
      }
    }
  };

  const handleMedicalCouncilNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMedicalCouncilNumber(value);
    setMedicalCouncilNumberError(null);
    
    if (value) {
      const validation = validateLength(value, 3, 20, t("medicalCouncilNumberInvalid"));
      if (!validation.isValid) {
        setMedicalCouncilNumberError(validation.error || null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFirstNameError(null);
    setLastNameError(null);
    setMedicalCouncilNumberError(null);

    // Validate all fields
    const firstNameValidation = validateRequired(firstName.trim(), t("firstNameRequired"));
    if (!firstNameValidation.isValid) {
      setFirstNameError(firstNameValidation.error || t("firstNameRequired"));
      return;
    }
    
    const firstNameLengthValidation = validateLength(firstName.trim(), 2, 50, t("firstNameInvalid"));
    if (!firstNameLengthValidation.isValid) {
      setFirstNameError(firstNameLengthValidation.error || null);
      return;
    }

    const lastNameValidation = validateRequired(lastName.trim(), t("lastNameRequired"));
    if (!lastNameValidation.isValid) {
      setLastNameError(lastNameValidation.error || t("lastNameRequired"));
      return;
    }
    
    const lastNameLengthValidation = validateLength(lastName.trim(), 2, 50, t("lastNameInvalid"));
    if (!lastNameLengthValidation.isValid) {
      setLastNameError(lastNameLengthValidation.error || null);
      return;
    }

    const medicalCouncilValidation = validateRequired(medicalCouncilNumber.trim(), t("medicalCouncilNumberRequired"));
    if (!medicalCouncilValidation.isValid) {
      setMedicalCouncilNumberError(medicalCouncilValidation.error || t("medicalCouncilNumberRequired"));
      return;
    }
    
    const medicalCouncilLengthValidation = validateLength(medicalCouncilNumber.trim(), 3, 20, t("medicalCouncilNumberInvalid"));
    if (!medicalCouncilLengthValidation.isValid) {
      setMedicalCouncilNumberError(medicalCouncilLengthValidation.error || null);
      return;
    }

    try {
      setLoading(true);

      await VetAPI.register({
        phone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        medicalCouncilNumber: medicalCouncilNumber.trim(),
      });

      setSubmitted(true);
      localStorage.removeItem("vetRegistrationPhone");
    } catch (e) {
      console.error("Failed to register:", e);
      setError(
        e instanceof Error ? e.message : t("registrationFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // Success message
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1f1a] p-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-full max-w-md rounded-2xl bg-[#102a23] p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              {t("successTitle")}
            </h1>
            <p className="text-gray-300">{t("successMessage")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1f1a] p-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full max-w-md rounded-2xl bg-[#102a23] p-8 shadow-lg">
        <h1 className={`mb-6 text-center text-2xl font-bold text-white ${isRTL ? "font-fa" : "font-en"}`}>
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number - Read Only */}
          <div>
            <label className={`mb-2 block text-sm font-medium text-gray-300 ${isRTL ? "text-right" : "text-left"}`}>
              {t("phoneNumber")}
            </label>
            <input
              type="tel"
              value={phone}
              readOnly
              dir="ltr"
              className={`w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white opacity-60 ${isRTL ? "text-right" : "text-left"}`}
            />
            <p className={`mt-1 text-xs text-gray-400 ${isRTL ? "text-right" : "text-left"}`}>
              {t("phoneReadOnly")}
            </p>
          </div>

          {/* First Name */}
          <div>
            <label className={`mb-2 block text-sm font-medium text-gray-300 ${isRTL ? "text-right" : "text-left"}`}>
              {t("firstName")} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              placeholder={t("firstNamePlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border ${
                firstNameError ? "border-red-500" : "border-white/20"
              } bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
            {firstNameError && (
              <p className={`mt-1 text-xs text-red-400 ${isRTL ? "text-right" : "text-left"}`}>
                {firstNameError}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className={`mb-2 block text-sm font-medium text-gray-300 ${isRTL ? "text-right" : "text-left"}`}>
              {t("lastName")} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              placeholder={t("lastNamePlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border ${
                lastNameError ? "border-red-500" : "border-white/20"
              } bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
            {lastNameError && (
              <p className={`mt-1 text-xs text-red-400 ${isRTL ? "text-right" : "text-left"}`}>
                {lastNameError}
              </p>
            )}
          </div>

          {/* Medical Council Number */}
          <div>
            <label className={`mb-2 block text-sm font-medium text-gray-300 ${isRTL ? "text-right" : "text-left"}`}>
              {t("medicalCouncilNumber")} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={medicalCouncilNumber}
              onChange={handleMedicalCouncilNumberChange}
              placeholder={t("medicalCouncilNumberPlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border ${
                medicalCouncilNumberError ? "border-red-500" : "border-white/20"
              } bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
            {medicalCouncilNumberError && (
              <p className={`mt-1 text-xs text-red-400 ${isRTL ? "text-right" : "text-left"}`}>
                {medicalCouncilNumberError}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/20 p-3">
              <p className={`text-center text-sm text-red-400 ${isRTL ? "text-right" : "text-left"}`}>
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!firstNameError || !!lastNameError || !!medicalCouncilNumberError}
            className="w-full rounded-xl bg-[#D4AF37] py-3 font-medium text-white transition hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? tCommon("pleaseWait") : t("submitButton")}
          </button>
        </form>
      </div>
    </div>
  );
}