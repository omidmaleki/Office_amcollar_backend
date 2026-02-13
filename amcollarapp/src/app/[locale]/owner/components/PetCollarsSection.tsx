"use client";

import { useTranslations } from "next-intl";
import PetCard from "./PetCard";

interface Pet {
  id: string;
  name: string;
  image?: string; // URL from backend
  isOnline: boolean;
  veterinarianName: string;
}

interface PetCollarsSectionProps {
  pets: Pet[];
}

export default function PetCollarsSection({ pets }: PetCollarsSectionProps) {
  const t = useTranslations("profile");
  // Check if showing placeholder (when pets array has placeholder ID)
  const isPlaceholder = pets.some((pet) => pet.id === "placeholder-1");

  if (!pets || pets.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {t("petCollars")}
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">🐾</div>
          <p className="text-sm text-gray-500">{t("noPets")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {t("petCollars")}
        </h2>
        {isPlaceholder && (
          <span className="text-xs text-gray-400 italic">
            {t("temporaryPlaceholder")}
          </span>
        )}
      </div>

      {/* Pet Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            petId={pet.id}
            petName={pet.name}
            petImage={pet.image}
            isOnline={pet.isOnline}
            veterinarianName={pet.veterinarianName}
          />
        ))}
      </div>
    </div>
  );
}

