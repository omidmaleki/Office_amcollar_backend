"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Signal, CheckCircle2, XCircle, Wifi } from "lucide-react";

interface CellularStatus {
  isActive: boolean;
  signalStrength: number; // 0-100
  operator: string;
  dataUsed: number; // in MB
  dataLimit: number; // in MB
  lastSeen?: Date;
}

interface CellularConnectionTabProps {
  onToggle?: (enabled: boolean) => void;
}

export default function CellularConnectionTab({
  onToggle,
}: CellularConnectionTabProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("connection.cellular");
  
  const [status, setStatus] = useState<CellularStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    // TODO: Fetch cellular status from backend
    // const fetchStatus = async () => {
    //   const response = await fetch('/api/collar/cellular/status');
    //   const data = await response.json();
    //   setStatus(data);
    // };
    // fetchStatus();
    
    // Mock data for now
    setStatus({
      isActive: false,
      signalStrength: 75,
      operator: "Irancell",
      dataUsed: 250,
      dataLimit: 1000,
    });
  }, []);

  const handleToggle = async () => {
    if (!status) return;

    setIsToggling(true);
    try {
      const newState = !status.isActive;
      // TODO: Call backend API to toggle cellular
      // await fetch('/api/collar/cellular/toggle', {
      //   method: 'POST',
      //   body: JSON.stringify({ enabled: newState })
      // });

      setStatus({ ...status, isActive: newState });
      if (onToggle) {
        onToggle(newState);
      }
    } catch (error) {
      console.error("Failed to toggle cellular:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const getSignalStrengthBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return [1, 2, 3, 4].map((bar) => ({
      bar,
      active: bar <= bars,
      color:
        strength >= 70
          ? "bg-green-500"
          : strength >= 40
          ? "bg-yellow-500"
          : "bg-red-500",
    }));
  };

  const formatDataUsage = (used: number, limit: number) => {
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    return {
      used: used.toFixed(1),
      limit: limit.toFixed(1),
      percentage: Math.min(percentage, 100),
    };
  };

  if (!status) {
    return (
      <div className={`rounded-2xl bg-white p-8 shadow-sm text-center ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
        <Signal className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-500">{locale === "fa" ? "در حال بارگذاری وضعیت سیم‌کارت..." : "Loading cellular status..."}</p>
      </div>
    );
  }

  const signalBars = getSignalStrengthBars(status.signalStrength);
  const dataUsage = formatDataUsage(status.dataUsed, status.dataLimit);

  return (
    <div className={`space-y-6 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Status Card */}
      <div
        className={`rounded-2xl border p-6 ${
          status.isActive
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {status.isActive ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-gray-400" size={24} />
            )}
            <div>
              <p
                className={`font-semibold ${
                  status.isActive ? "text-green-800" : "text-gray-800"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {status.isActive ? t("active") : t("inactive")}
              </p>
              <p
                className={`text-sm ${
                  status.isActive ? "text-green-600" : "text-gray-500"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {status.operator || t("noOperator")}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              status.isActive ? "bg-[#0F5D4A]" : "bg-gray-300"
            } disabled:opacity-50`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                status.isActive ? (isRTL ? "translate-x-[-1.5rem]" : "translate-x-6") : (isRTL ? "translate-x-[-0.25rem]" : "translate-x-1")
              }`}
            />
          </button>
        </div>

        {/* Signal Strength */}
        {status.isActive && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className={`text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
                {t("signalStrength")}
              </p>
              <span className="text-sm text-gray-600">
                {status.signalStrength}%
              </span>
            </div>
            <div className="flex items-end gap-1">
              {signalBars.map(({ bar, active, color }) => (
                <div
                  key={bar}
                  className={`w-3 rounded-t transition-colors ${
                    active ? color : "bg-gray-200"
                  }`}
                  style={{ height: `${bar * 8}px` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Usage */}
      {status.isActive && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className={`mb-4 font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("dataUsage")}</h3>
          <div className="space-y-4">
            <div>
              <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={`text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>{t("usedThisMonth")}</span>
                <span className="text-sm font-medium text-gray-800">
                  {dataUsage.used} MB / {dataUsage.limit} MB
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full transition-all ${
                    dataUsage.percentage >= 90
                      ? "bg-red-500"
                      : dataUsage.percentage >= 70
                      ? "bg-yellow-500"
                      : "bg-[#0F5D4A]"
                  }`}
                  style={{ width: `${dataUsage.percentage}%` }}
                />
              </div>
              <p className={`mt-1 text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                {dataUsage.percentage.toFixed(1)}% {t("ofMonthlyLimit")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
        <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Wifi className="text-blue-600 mt-0.5" size={20} />
          <div>
            <p className={`font-semibold text-blue-800 mb-1 ${isRTL ? "text-right" : "text-left"}`}>
              {t("title")}
            </p>
            <p className={`text-sm text-blue-700 ${isRTL ? "text-right" : "text-left"}`}>
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      {/* Last Seen */}
      {status.lastSeen && (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className={`text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
            {t("lastSeen")}:{" "}
            <span className="font-medium text-gray-800">
              {new Date(status.lastSeen).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}