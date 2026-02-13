"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

interface OwnerInformation {
  name: string;
  address: string;
  phone: string; // Read-only
}

interface OwnerInformationFormProps {
  initialData: OwnerInformation;
  onSave?: (data: OwnerInformation) => void;
}

export default function OwnerInformationForm({
  initialData,
  onSave,
}: OwnerInformationFormProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const [formData, setFormData] = useState<OwnerInformation>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call backend API to save owner information
      // await fetch('/api/owner/profile', { method: 'PUT', body: JSON.stringify(formData) });
      
      if (onSave) {
        onSave(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save owner information:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {t("ownerInformation")}
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-[#0F5D4A] hover:text-[#0b1f1a]"
          >
            {tCommon("edit")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Owner Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("ownerName")}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={!isEditing}
            className={`w-full rounded-xl border px-4 py-3 transition-colors ${
              isEditing
                ? "border-gray-300 bg-white focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("address")}
          </label>
          <textarea
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            disabled={!isEditing}
            rows={3}
            className={`w-full rounded-xl border px-4 py-3 transition-colors ${
              isEditing
                ? "border-gray-300 bg-white focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>

        {/* Phone Number - Read Only */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t("phoneNumber")}
          </label>
          <input
            type="tel"
            value={formData.phone}
            disabled
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed"
            readOnly
          />
          <p className="mt-1 text-xs text-gray-500">
            {t("phoneCannotChange")}
          </p>
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#0F5D4A] px-6 py-3 text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50"
            >
              <Save size={18} />
              <span className="font-medium">
                {isSaving ? t("saving") : t("saveChanges")}
              </span>
            </button>
            <button
              onClick={() => {
                setFormData(initialData);
                setIsEditing(false);
              }}
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {tCommon("cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

