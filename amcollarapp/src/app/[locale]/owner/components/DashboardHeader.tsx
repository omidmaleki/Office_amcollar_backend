"use client";

import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardHeaderProps {
  petName: string;
  isOnline: boolean;
  heartRate: number; // beats per minute
}

export default function DashboardHeader({
  petName,
  isOnline,
  heartRate,
}: DashboardHeaderProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  return (
    <div className={`flex px-10 items-center justify-between ${isRTL ? "flex-row-reverse" : ""} ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <div className={`mt-2 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className={`text-lg font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>{petName}</span>
          <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-500">
              {isOnline ? tCommon("online") : tCommon("offline")}
            </span>
          </div>
        </div>
      </div>

      {/* Heart Rate Indicator */}
      <div className={`flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}>
        <Heart size={20} className="text-red-500 fill-red-500" />
        <div>
          <p className={`text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>{t("heartRate")}</p>
          <p className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
            {heartRate}
          </p>
        </div>
      </div>
    </div>
  );
}