"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, Shield, AlertTriangle, Phone, MapPin, Camera } from "lucide-react";

type VetProfile = {
  firstName: string;
  lastName: string;
  medicalCouncilNumber: string;
  phone: string;
  address: string;
  profilePhotoUrl?: string;
  contractStartDate: string;
  contractDurationMonths: number;
  contractApproved: boolean;
};

export default function VetProfilePage() {
  const t = useTranslations("vetProfile");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [profile, setProfile] = useState<VetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const isDevelopment = process.env.NODE_ENV === "development";
        if (isDevelopment) {
          setProfile({
            firstName: locale === "fa" ? "نمونه" : "Sample",
            lastName: locale === "fa" ? "دامپزشک" : "Veterinarian",
            medicalCouncilNumber: "MC-123456",
            phone: "+98 900 000 0000",
            address: locale === "fa" ? "خیابان دامپزشکی ۱۲۳، شهر" : "123 Vet Street, City",
            profilePhotoUrl: "",
            contractStartDate: "2024-01-15",
            contractDurationMonths: 12,
            contractApproved: true,
          });
        } else {
          setProfile(null);
        }
      } catch {
        setError(tCommon("loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [tCommon, locale]);

  const contractInfo = useMemo(() => {
    if (!profile) return null;
    const start = new Date(profile.contractStartDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + profile.contractDurationMonths);
    const now = new Date();
    const daysLeft = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;
    const isNearExpiry = daysLeft >= 0 && daysLeft < 30;
    return { start, end, daysLeft, isExpired, isNearExpiry };
  }, [profile]);

  const handleChange = (field: keyof VetProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      setSuccess(t("saveSuccess"));
    } catch {
      setError(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-gray-500">{t("noData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          {contractInfo && (
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              <Shield size={14} />
              {profile.contractApproved ? t("contractApproved") : t("contractPending")}
            </div>
          )}
        </div>

        {/* Contract Info */}
        {contractInfo && (
          <div className="rounded-2xl bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Calendar className="text-[#D4AF37]" size={20} />
              <div className="text-sm text-gray-600">
                <p>
                  {t("contractStart")}: <span className="font-semibold text-gray-800">{contractInfo.start.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}</span>
                </p>
                <p>
                  {t("contractDuration")}: <span className="font-semibold text-gray-800">{profile.contractDurationMonths} {t("months")}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:justify-end">
              <div className="text-right text-sm text-gray-600">
                <p>
                  {t("contractEnd")}: <span className="font-semibold text-gray-800">{contractInfo.end.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}</span>
                </p>
                <p>
                  {contractInfo.daysLeft >= 0
                    ? t("daysRemaining", { count: contractInfo.daysLeft })
                    : t("expired")}
                </p>
              </div>
              {(contractInfo.isExpired || contractInfo.isNearExpiry) && (
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    contractInfo.isExpired
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <AlertTriangle size={14} />
                  {contractInfo.isExpired ? t("contractExpired") : t("contractExpiring")}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {profile.profilePhotoUrl ? (
                <img src={profile.profilePhotoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <Camera className="text-gray-400" size={24} />
              )}
            </div>
            <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left">
              <p className="text-sm text-gray-700">{t("profilePhoto")}</p>
              <p className="text-xs text-gray-500">{t("profilePhotoHint")}</p>
              <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]">
                {t("uploadPhoto")}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Editable Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("firstName")}</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4AF37] focus:outline-none text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("lastName")}</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4AF37] focus:outline-none text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
                <Phone size={14} className="text-gray-500" />
                {t("phoneNumber")}
              </label>
              <input
                type="tel"
                value={profile.phone}
                readOnly
                className="w-full rounded-xl border px-4 py-3 bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin size={14} className="text-gray-500" />
                {t("address")}
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D4AF37] focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Error / Success */}
          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[#D4AF37] px-6 py-3 text-white font-medium hover:bg-[#0b4a3a] disabled:opacity-60"
            >
              {saving ? tCommon("pleaseWait") : t("saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}