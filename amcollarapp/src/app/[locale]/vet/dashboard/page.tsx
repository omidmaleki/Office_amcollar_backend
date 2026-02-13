"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import VetPetCard from "../components/VetPetCard";

// Types for pet data (from backend)
interface PetData {
  petId: string;
  petName: string;
  petImage?: string;
  isOnline: boolean;
  alertPriority: "high" | "medium" | "low" | "none";
  ownerName: string;
  isNew?: boolean; // New pet assignment
  isProfileComplete?: boolean; // Profile completion status
}

export default function VetDashboardPage() {
  const t = useTranslations("vetDashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(true);

  // Priority order for sorting: high > medium > low > none
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
    none: 3,
  };

  // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
  // Temporary UI placeholder for development and UI preview purposes ONLY
  const getMockPet = (): PetData => ({
    petId: "mock",
    petName: locale === "fa" ? "حیوان نمونه" : "Sample Pet",
    petImage: undefined, // Placeholder avatar will be generated
    isOnline: true,
    alertPriority: "high",
    ownerName: locale === "fa" ? "مالک تست" : "Test Owner",
    isNew: false,
    isProfileComplete: true,
  });

  // TEMP MOCK NEW PET ASSIGNMENT – REMOVE AFTER BACKEND INTEGRATION
  // Mock new incomplete pet ONLY when NODE_ENV === "development"
  const getMockNewPet = (): PetData => ({
    petId: "new-pet-1",
    petName: locale === "fa" ? "حیوان جدید" : "New Pet",
    petImage: undefined,
    isOnline: false,
    alertPriority: "high",
    ownerName: locale === "fa" ? "مالک جدید" : "New Owner",
    isNew: true,
    isProfileComplete: false,
  });

  // TODO: Replace with actual API call to fetch pets list
  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Example API call (uncomment when backend is ready):
        // const response = await fetch('/api/vet/pets');
        // const petsData = await response.json();
        // Sort by alert priority
        // const sortedPets = petsData.sort((a: PetData, b: PetData) => 
        //   priorityOrder[a.alertPriority] - priorityOrder[b.alertPriority]
        // );
        // setPets(sortedPets);

        // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
        // Temporary: Add mock pets for UI preview
        // Include new incomplete pet ONLY in development
        const mockPets = process.env.NODE_ENV === "development" 
          ? [getMockNewPet(), getMockPet()]
          : [getMockPet()];
        setPets(mockPets);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setLoading(false);
      }
    };

    fetchPets();
  }, [locale]);

  // Sort pets: new/incomplete first, then by alert priority
  const sortedPets = [...pets].sort((a, b) => {
    // New pets or incomplete profiles first
    const aIsNewOrIncomplete = (a.isNew || !a.isProfileComplete) ? 0 : 1;
    const bIsNewOrIncomplete = (b.isNew || !b.isProfileComplete) ? 0 : 1;
    if (aIsNewOrIncomplete !== bIsNewOrIncomplete) {
      return aIsNewOrIncomplete - bIsNewOrIncomplete;
    }
    // Then by alert priority
    return priorityOrder[a.alertPriority] - priorityOrder[b.alertPriority];
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Pet List */}
        {sortedPets.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
            <p className="text-gray-500">{t("noPets")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPets.map((pet) => (
              <VetPetCard
                key={pet.petId}
                petId={pet.petId}
                petName={pet.petName}
                petImage={pet.petImage}
                isOnline={pet.isOnline}
                alertPriority={pet.alertPriority}
                ownerName={pet.ownerName}
                isNew={pet.isNew}
                isProfileComplete={pet.isProfileComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}