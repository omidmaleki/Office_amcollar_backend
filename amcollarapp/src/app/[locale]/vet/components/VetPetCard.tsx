"use client";

import { useRouter } from "@/i18n/routing";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface VetPetCardProps {
  petId: string;
  petName: string;
  petImage?: string;
  isOnline: boolean;
  alertPriority: "high" | "medium" | "low" | "none";
  ownerName: string;
  isNew?: boolean;
  isProfileComplete?: boolean;
}

export default function VetPetCard({
  petId,
  petName,
  petImage,
  isOnline,
  alertPriority,
  ownerName,
  isNew,
  isProfileComplete,
}: VetPetCardProps) {
  const router = useRouter();
  const t = useTranslations("vetDashboard");
  const tNewPet = useTranslations("vetNewPet");
  const tCommon = useTranslations("common");

  const handleClick = () => {
    router.push(`/vet/pets/${petId}`);
  };

  const alertColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
    none: "bg-gray-300",
  };

  const alertLabels = {
    high: t("alertHigh"),
    medium: t("alertMedium"),
    low: t("alertLow"),
    none: t("alertNone"),
  };

  const showNewBadge = isNew || !isProfileComplete;
  const badgeText = isNew ? tNewPet("new") : tNewPet("profileIncomplete");

  return (
    <button
      onClick={handleClick}
      className={`
        group w-full rounded-xl p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98] text-left
        ${showNewBadge ? "bg-blue-50 border-2 border-blue-200" : "bg-white"}
      `}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Pet Image/Avatar */}
        <div className="relative flex-shrink-0">
          {petImage ? (
            <img
              src={petImage}
              alt={petName}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#D4AF37]">
              <span className="text-2xl sm:text-3xl font-semibold text-white">
                {petName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Online/Offline Status Indicator */}
          <div
            className={`absolute bottom-0 right-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        {/* Pet Info */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-2">
            <h3 className="truncate text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-[#D4AF37] transition-colors">
              {petName}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {/* New/Incomplete Badge */}
              {showNewBadge && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500 text-white text-xs sm:text-sm font-medium">
                  <span>{badgeText}</span>
                </div>
              )}
              {/* Alert Badge */}
              {alertPriority !== "none" && (
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${alertColors[alertPriority]} text-white text-xs sm:text-sm font-medium`}
                >
                  <AlertCircle size={12} />
                  <span>{alertLabels[alertPriority]}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm sm:text-base text-gray-600 mb-1 truncate">
            {t("owner")}: {ownerName}
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-xs sm:text-sm text-gray-500">
              {isOnline ? tCommon("online") : tCommon("offline")}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}