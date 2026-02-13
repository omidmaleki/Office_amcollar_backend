"use client";

import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface PetCardProps {
  petId: string;
  petName: string;
  petImage?: string; // URL from backend
  isOnline: boolean;
  veterinarianName: string;
}

export default function PetCard({
  petId,
  petName,
  petImage,
  isOnline,
  veterinarianName,
}: PetCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const router = useRouter();
  const tCommon = useTranslations("common");

  const handleClick = () => {
    // Navigate to pet's dashboard
    router.push(`/owner/dashboard?petId=${petId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`group w-full rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98] ${isRTL ? "text-right font-fa" : "text-left font-en"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        {/* Pet Image/Avatar */}
        <div className="relative flex-shrink-0">
          {petImage ? (
            <img
              src={petImage}
              alt={petName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]">
              <span className="text-2xl font-semibold text-white">
                {petName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Online/Offline Status Indicator */}
          <div
            className={`absolute ${isRTL ? "bottom-0 left-0" : "bottom-0 right-0"} h-4 w-4 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        {/* Pet Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`mb-1 truncate text-lg font-semibold text-gray-800 group-hover:text-[#0F5D4A] transition-colors ${isRTL ? "text-right" : "text-left"}`}>
            {petName}
          </h3>
          <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? "flex-row-reverse" : ""}`}>
            <MapPin size={14} className="flex-shrink-0" />
            <span className={`truncate ${isRTL ? "text-right" : "text-left"}`}>{veterinarianName}</span>
          </div>
          <div className={`mt-1 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className={`text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
              {isOnline ? tCommon("online") : tCommon("offline")}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}