"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { validateRequired, validateLength } from "@/lib/validation";

export default function VetPetNamePage() {
  const router = useRouter();
  const t = useTranslations("vetPetId");
  const tCommon = useTranslations("common");
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [petNameError, setPetNameError] = useState<string | null>(null);

  const handlePetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPetName(value);
    setPetNameError(null);
    
    if (value) {
      const validation = validateLength(value, 2, 50, t("petNameInvalid"));
      if (!validation.isValid) {
        setPetNameError(validation.error || null);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPetNameError(null);

    const validation = validateRequired(petName.trim(), t("petNameRequired"));
    if (!validation.isValid) {
      setPetNameError(validation.error || t("petNameRequired"));
      return;
    }

    const lengthValidation = validateLength(petName.trim(), 2, 50, t("petNameInvalid"));
    if (!lengthValidation.isValid) {
      setPetNameError(lengthValidation.error || null);
      return;
    }

    try {
      setLoading(true);
      router.push(`/vet/pets?name=${encodeURIComponent(petName.trim())}`);
    } catch (e) {
      console.error("Failed to search pet:", e);
      setError(t("searchFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Search Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("petNameLabel")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={petName}
                  onChange={handlePetNameChange}
                  placeholder={t("petNamePlaceholder")}
                  className={`w-full rounded-xl border ${
                    petNameError ? "border-red-500" : "border-gray-300"
                  } px-4 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20`}
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              {petNameError && (
                <p className="mt-1 text-sm text-red-600">{petNameError}</p>
              )}
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!petNameError}
              className="w-full rounded-xl bg-[#D4AF37] py-3 font-medium text-white transition hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? tCommon("loading") : t("searchButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}