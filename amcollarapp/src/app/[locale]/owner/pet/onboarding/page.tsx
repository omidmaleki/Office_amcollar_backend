"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Camera, CheckCircle2 } from "lucide-react";
import { ConnectionAPI, PetProfileAPI } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { validateRequired, validateLength, validateNumber } from "@/lib/validation";

interface PetFormData {
  name: string;
  type: string;
  breed: string;
  age: string;
  birthDate: string;
  weight: string;
  gender: string;
  veterinarianId: string;
  photo: File | null;
}

export default function PetOnboardingPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("onboarding");
  const tCommon = useTranslations("common");
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    type: "",
    breed: "",
    age: "",
    birthDate: "",
    weight: "",
    gender: "",
    veterinarianId: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check access conditions on mount
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const auth = getAuth();
        
        // Check if owner is logged in
        if (!auth || auth.role !== "owner") {
          router.push("/login?role=owner");
          return;
        }

        // Check connection status
        const connectionStatus = await ConnectionAPI.getConnectionStatus();
        if (!connectionStatus.isConnected) {
          router.push("/owner/connection");
          return;
        }

        // Check if profile is already complete
        const isProfileComplete = await PetProfileAPI.isProfileComplete();
        if (isProfileComplete) {
          router.push("/owner/dashboard");
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Failed to check access conditions:", error);
        router.push("/owner/connection");
      }
    };

    checkAccess();
  }, [locale, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required field
    const nameValidation = validateRequired(formData.name.trim(), t("petNameRequired"));
    if (!nameValidation.isValid) {
      setError(nameValidation.error || t("petName") + " " + tCommon("required"));
      return;
    }

    // Validate name length
    const nameLengthValidation = validateLength(formData.name.trim(), 2, 50, t("petNameInvalid"));
    if (!nameLengthValidation.isValid) {
      setError(nameLengthValidation.error || null);
      return;
    }

    // Validate age if provided
    if (formData.age) {
      const ageValidation = validateNumber(formData.age, 0, 30);
      if (!ageValidation.isValid) {
        setError(ageValidation.error || t("ageHint"));
        return;
      }
    }

    // Validate weight if provided
    if (formData.weight) {
      const weightValidation = validateNumber(formData.weight, 0, 200);
      if (!weightValidation.isValid) {
        setError(weightValidation.error || t("weightHint"));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // TODO: Call backend API to save pet profile
      // const formDataToSend = new FormData();
      // formDataToSend.append('name', formData.name);
      // formDataToSend.append('type', formData.type);
      // formDataToSend.append('breed', formData.breed);
      // formDataToSend.append('age', formData.age);
      // formDataToSend.append('birthDate', formData.birthDate);
      // formDataToSend.append('weight', formData.weight);
      // formDataToSend.append('gender', formData.gender);
      // formDataToSend.append('veterinarianId', formData.veterinarianId);
      // if (formData.photo) {
      //   formDataToSend.append('photo', formData.photo);
      // }
      // const response = await fetch('/api/pet/profile', {
      //   method: 'POST',
      //   body: formDataToSend
      // });
      // if (!response.ok) throw new Error('Failed to save pet profile');

      // Redirect to dashboard on success
      router.push("/owner/dashboard");
    } catch (err) {
      console.error("Failed to save pet profile:", err);
      setError(
        err instanceof Error ? err.message : t("failedToSave")
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
            {/* Pet Photo Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("petPhoto")}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Pet preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera className="text-gray-400" size={32} />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <span className="inline-block rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                      {t("choosePhoto")}
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    {t("uploadPhoto")}
                  </p>
                </div>
              </div>
            </div>

            {/* Pet Name - Required */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t("petName")} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={t("enterPetName")}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
              />
              {error && error.includes(t("petName")) && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {t("petNameHint")}
                </p>
              )}
            </div>

            {/* Pet Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t("type")}
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
              >
                <option value="">{t("selectType")}</option>
                <option value="cat">{t("cat")}</option>
                <option value="dog">{t("dog")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>

            {/* Breed */}
            <div>
              <label
                htmlFor="breed"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t("breed")}
              </label>
              <input
                id="breed"
                name="breed"
                type="text"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder={t("enterBreed")}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
              />
            </div>

            {/* Age and Birth Date Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="age"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("age")}
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder={t("years")}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
                />
                {error && error.includes(t("age")) && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    {t("ageHint")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("birthDate")}
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
                />
              </div>
            </div>

            {/* Weight and Gender Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="weight"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("weight")}
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder={t("kg")}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
                />
                {error && error.includes(t("weight")) && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    {t("weightHint")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("gender")}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>
            </div>

            {/* Veterinarian Selection */}
            <div>
              <label
                htmlFor="veterinarianId"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t("veterinarian")}
              </label>
              <select
                id="veterinarianId"
                name="veterinarianId"
                value={formData.veterinarianId}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20"
              >
                <option value="">{t("selectVeterinarian")}</option>
                {/* TODO: Populate from backend API */}
                {/* {veterinarians.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.name}
                  </option>
                ))} */}
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                {t("selectVetAssigned")}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F5D4A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{t("saving")}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>{t("completeProfile")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}