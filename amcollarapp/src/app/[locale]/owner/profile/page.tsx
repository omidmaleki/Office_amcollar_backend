"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ProfileHeader from "../components/ProfileHeader";
import OwnerInformationForm from "../components/OwnerInformationForm";
import PetCollarsSection from "../components/PetCollarsSection";

// Types for profile data (from backend)
interface OwnerProfile {
  name: string;
  address: string;
  phone: string;
}

interface Pet {
  id: string;
  name: string;
  image?: string;
  isOnline: boolean;
  veterinarianName: string;
}

interface ProfileData {
  owner: OwnerProfile;
  pets: Pet[];
  notificationCount: number;
}

export default function OwnerProfilePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("profile");
  const [data, setData] = useState<ProfileData>({
    owner: { name: "", address: "", phone: "" },
    pets: [],
    notificationCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // TODO: Replace with real API call
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const handleSaveOwnerInfo = (ownerInfo: OwnerProfile) => {
    console.log("Saving owner info:", ownerInfo);
    setData((prev) => ({ ...prev, owner: ownerInfo }));
  };

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  // Placeholder pet with locale-aware names
  const placeholderPet: Pet = {
    id: "placeholder-1",
    name: locale === "fa" ? "نانا" : "Nana",
    image: undefined,
    isOnline: true,
    veterinarianName: locale === "fa" ? "دکتر احمدی" : "Dr. Smith",
  };

  const displayPets = data.pets.length > 0 ? data.pets : [placeholderPet];

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <ProfileHeader
          notificationCount={data.notificationCount}
          onNotificationClick={handleNotificationClick}
        />

        {/* Pet Collars Section */}
        <PetCollarsSection pets={displayPets} />

        {/* Owner Information Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <h2 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("ownerInformation")}</h2>
          {/* Name */}
          <div className="space-y-1">
            <label className={`text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>{t("ownerName")}</label>
            <input
              type="text"
              value={data.owner.name}
              onChange={(e) =>
                handleSaveOwnerInfo({ ...data.owner, name: e.target.value })
              }
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0F5D4A] focus:outline-none ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className={`text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>{t("address")}</label>
            <input
              type="text"
              value={data.owner.address}
              onChange={(e) =>
                handleSaveOwnerInfo({ ...data.owner, address: e.target.value })
              }
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0F5D4A] focus:outline-none ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
          </div>

          {/* Phone (Locked) */}
          <div className="space-y-1">
            <label className={`text-sm font-medium text-gray-400 ${isRTL ? "text-right" : "text-left"}`}>{t("phoneNumber")}</label>
            <input
              type="tel"
              value={data.owner.phone}
              readOnly
              dir="ltr"
              className="w-full rounded-xl border px-4 py-3 bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}