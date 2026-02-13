"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Info, TrendingUp } from "lucide-react";

interface Coefficient {
  level: number;
  name: string;
  pricePerSale: number;
  salesRequired: number;
  description: string;
}

interface FinanceData {
  currentCoefficient: number;
  completedSales: number;
  totalEarnings: number;
  coefficients: Coefficient[];
}

export default function VetFinancePage() {
  const t = useTranslations("vetFinance");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [selectedCoefficient, setSelectedCoefficient] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Format number with Persian/Arabic digits
  const formatNumber = (num: number): string => {
    if (locale === "fa") {
      const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
    }
    return num.toLocaleString("en-US");
  };

  // Format price with currency
  const formatPrice = (price: number): string => {
    if (locale === "fa") {
      return `${formatNumber(price)} تومان`;
    }
    return `$${price.toLocaleString("en-US")}`;
  };

  // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
  // Mock data ONLY when NODE_ENV === "development"
  const getMockFinanceData = (): FinanceData => ({
    currentCoefficient: 1,
    completedSales: 3,
    totalEarnings: 150,
    coefficients: [
      {
        level: 1,
        name: locale === "fa" ? "شروع" : "Starter",
        pricePerSale: 50,
        salesRequired: 0,
        description: locale === "fa" ? "سطح شروع برای دامپزشکان جدید" : "Starting level for new veterinarians",
      },
      {
        level: 2,
        name: locale === "fa" ? "حرفه‌ای" : "Professional",
        pricePerSale: 75,
        salesRequired: 5,
        description: locale === "fa" ? "بعد از ۵ فروش تکمیل شده باز می‌شود" : "Unlock after 5 completed sales",
      },
      {
        level: 3,
        name: locale === "fa" ? "متخصص" : "Expert",
        pricePerSale: 100,
        salesRequired: 15,
        description: locale === "fa" ? "بعد از ۱۵ فروش تکمیل شده باز می‌شود" : "Unlock after 15 completed sales",
      },
      {
        level: 4,
        name: locale === "fa" ? "استاد" : "Master",
        pricePerSale: 150,
        salesRequired: 30,
        description: locale === "fa" ? "بعد از ۳۰ فروش تکمیل شده باز می‌شود" : "Unlock after 30 completed sales",
      },
    ],
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
        // Use mock data ONLY in development
        if (process.env.NODE_ENV === "development") {
          const mockData = getMockFinanceData();
          setFinanceData(mockData);
          setSelectedCoefficient(mockData.currentCoefficient);
        } else {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/vet/finance');
          // const data = await response.json();
          // setFinanceData(data);
          // setSelectedCoefficient(data.currentCoefficient);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch finance data:", error);
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [locale]);

  if (loading || !financeData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  // Find current and next coefficient
  const currentCoeff = financeData.coefficients.find(
    (c) => c.level === financeData.currentCoefficient
  ) || financeData.coefficients[0];
  const nextCoeff = financeData.coefficients.find(
    (c) => c.level === financeData.currentCoefficient + 1
  );

  // Calculate progress to next level
  const progressToNext = nextCoeff
    ? Math.min(
        100,
        ((financeData.completedSales - currentCoeff.salesRequired) /
          (nextCoeff.salesRequired - currentCoeff.salesRequired)) *
          100
      )
    : 100;

  const salesNeeded = nextCoeff
    ? Math.max(0, nextCoeff.salesRequired - financeData.completedSales)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Earnings Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#D4AF37]/10 p-2">
                <TrendingUp size={20} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("totalEarnings")}</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatPrice(financeData.totalEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("completedSales")}</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatNumber(financeData.completedSales)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#D4AF37]/10 p-2">
                <TrendingUp size={20} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("currentLevel")}</p>
                <p className="text-xl font-bold text-gray-800">
                  {currentCoeff.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coefficient Selector */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            {t("coefficientLevels")}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {financeData.coefficients.map((coeff) => {
              const isActive = coeff.level === financeData.currentCoefficient;
              const isUnlocked = financeData.completedSales >= coeff.salesRequired;
              const isSelected = coeff.level === selectedCoefficient;

              return (
                <div
                  key={coeff.level}
                  className="relative"
                  onMouseEnter={() => setShowTooltip(coeff.level)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onTouchStart={() =>
                    setShowTooltip(
                      showTooltip === coeff.level ? null : coeff.level
                    )
                  }
                >
                  <button
                    onClick={() => setSelectedCoefficient(coeff.level)}
                    disabled={!isUnlocked}
                    className={`
                      relative w-full rounded-xl border-2 p-4 text-left transition-all
                      ${
                        isActive
                          ? "border-[#D4AF37] bg-[#D4AF37]/5"
                          : isSelected
                          ? "border-[#D4AF37] bg-[#D4AF37]/5"
                          : isUnlocked
                          ? "border-gray-200 bg-white hover:border-gray-300"
                          : "border-gray-200 bg-gray-50 opacity-50"
                      }
                      ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}
                    `}
                  >
                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute right-2 top-2">
                        <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-medium text-white">
                          {t("active")}
                        </span>
                      </div>
                    )}

                    {/* Info Icon */}
                    <div className="absolute right-2 top-2">
                      <Info
                        size={16}
                        className={`${
                          isActive
                            ? "text-[#D4AF37]"
                            : isUnlocked
                            ? "text-gray-400"
                            : "text-gray-300"
                        }`}
                      />
                    </div>

                    <div className="pr-8">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {coeff.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {t("level")} {formatNumber(coeff.level)}
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#D4AF37]">
                        {formatPrice(coeff.pricePerSale)}
                        <span className="ml-1 text-sm font-normal text-gray-600">
                          /{t("sale")}
                        </span>
                      </p>
                      {!isUnlocked && (
                        <p className="mt-2 text-xs text-gray-500">
                          {t("requires")} {formatNumber(coeff.salesRequired)} {t("sales")}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Tooltip */}
                  {showTooltip === coeff.level && (
                    <div className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-white shadow-lg">
                      <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1 rotate-45 bg-gray-900"></div>
                      <h4 className="font-semibold">{coeff.name}</h4>
                      <p className="mt-1 text-xs text-gray-300">
                        {coeff.description}
                      </p>
                      <div className="mt-2 space-y-1 border-t border-gray-700 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">{t("pricePerSale")}:</span>
                          <span className="font-medium">{formatPrice(coeff.pricePerSale)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">{t("examplePayout")}:</span>
                          <span className="font-medium">
                            {formatPrice(coeff.pricePerSale * 10)} ({t("for")} {formatNumber(10)} {t("sales")})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar to Next Level */}
          {nextCoeff && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {t("progressToNext")}
                </span>
                <span className="text-sm text-gray-600">
                  {salesNeeded > 0
                    ? t("salesNeeded", { count: salesNeeded, s: salesNeeded > 1 ? "s" : "" })
                    : t("levelReached")}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0F5D4A] to-[#D4AF37] transition-all duration-500 ease-out"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {salesNeeded > 0
                  ? t("progressDescription", {
                      current: currentCoeff.name,
                      next: nextCoeff.name,
                      remaining: salesNeeded,
                      s: salesNeeded > 1 ? "s" : "",
                    })
                  : t("nextLevelUnlocked", { level: nextCoeff.name })}
              </p>
            </div>
          )}

          {/* Selected Coefficient Details */}
          {selectedCoefficient && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                {t("selectedCoefficient")}
              </h3>
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-600">{t("level")}</p>
                  <p className="font-semibold text-gray-800">
                    {
                      financeData.coefficients.find(
                        (c) => c.level === selectedCoefficient
                      )?.name
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t("pricePerSale")}</p>
                  <p className="font-semibold text-gray-800">
                    {formatPrice(
                      financeData.coefficients.find(
                        (c) => c.level === selectedCoefficient
                      )?.pricePerSale || 0
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t("potentialEarnings")}</p>
                  <p className="font-semibold text-gray-800">
                    {formatPrice(
                      (financeData.coefficients.find(
                        (c) => c.level === selectedCoefficient
                      )?.pricePerSale || 0) * 10
                    )}{" "}
                    ({t("for")} {formatNumber(10)} {t("sales")})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}