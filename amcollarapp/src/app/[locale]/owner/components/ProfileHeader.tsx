"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export default function ProfileHeader({
  notificationCount = 0,
  onNotificationClick,
}: ProfileHeaderProps) {
  const t = useTranslations("profile");
  
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>

      {/* Notification Bell */}
      <button
        onClick={onNotificationClick}
        className="relative rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
      >
        <Bell size={20} className="text-gray-600" />
        {notificationCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </button>
    </div>
  );
}

