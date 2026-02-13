"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Moon,
  Activity,
  Thermometer,
  Heart,
  Wind,
  Droplet,
  UtensilsCrossed,
  Flame,
  Upload,
  Plus,
} from "lucide-react";
import ConcentricActivityRings from "../../../owner/components/ConcentricActivityRings";
import HealthMetricCard from "../../components/HealthMetricCard";
import MedicalRecordModal from "../../components/MedicalRecordModal";

// Types for pet detail data (from backend)
interface PetDetailData {
  petId: string;
  petName: string;
  ownerName: string;
  purchaseDate: string;
  isOnline: boolean;
  isNew?: boolean; // New pet assignment
  isProfileComplete?: boolean; // Profile completion status
  petImage?: string; // Pet photo URL
  // Activity rings
  burnedCalories: number; // 0-100
  waterConsumption: number; // 0-100
  foodConsumption: number; // 0-100
  // Health metrics
  sleep: number; // hours
  hrv: number; // Heart Rate Variability
  bodyTemperature: number; // Celsius
  heartRate: number; // bpm
  respiratoryRate: number; // breaths per minute
  bloodOxygen: number; // SpO2 percentage
  burnedCaloriesValue: number; // actual calories
  waterIntake: number; // ml
  foodIntake: number; // grams
  // Medical records
  surgeryHistory: Array<{
    id: string;
    date: string;
    description: string;
    [key: string]: any;
  }>;
  labTests: Array<{
    id: string;
    date: string;
    description: string;
    [key: string]: any;
  }>;
  radiologyImages: Array<{
    id: string;
    date: string;
    description: string;
    imageUrl?: string;
    [key: string]: any;
  }>;
}

// TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
// Temporary UI placeholder for development and UI preview purposes ONLY
const MOCK_PET_DETAIL: PetDetailData = {
  petId: "mock",
  petName: "Sample Pet",
  ownerName: "Test Owner",
  purchaseDate: "2024-01-15",
  isOnline: true,
  isNew: false,
  isProfileComplete: true,
  // Activity rings - mock values for UI preview
  burnedCalories: 65, // percentage 0-100
  waterConsumption: 80, // percentage 0-100
  foodConsumption: 45, // percentage 0-100
  // Health metrics - mock values for UI preview
  sleep: 8.5, // hours
  hrv: 45, // Heart Rate Variability (ms)
  bodyTemperature: 38.5, // Celsius
  heartRate: 85, // bpm
  respiratoryRate: 20, // breaths per minute
  bloodOxygen: 98, // SpO2 percentage
  burnedCaloriesValue: 320, // actual calories
  waterIntake: 450, // ml
  foodIntake: 180, // grams
  // Medical records - mock data for UI preview
  surgeryHistory: [
    {
      id: "surgery-1",
      date: "2023-06-15",
      description: "Spay surgery - Routine procedure completed successfully",
    },
    {
      id: "surgery-2",
      date: "2022-12-10",
      description: "Dental cleaning and extraction of two molars",
    },
  ],
  labTests: [
    {
      id: "lab-1",
      date: "2024-01-10",
      description: "Complete blood count (CBC) - All values within normal range",
    },
    {
      id: "lab-2",
      date: "2023-11-20",
      description: "Blood chemistry panel - Normal kidney and liver function",
    },
    {
      id: "lab-3",
      date: "2023-08-05",
      description: "Urinalysis - No abnormalities detected",
    },
  ],
  radiologyImages: [
    {
      id: "rad-1",
      date: "2024-01-05",
      description: "Chest X-ray - Clear lungs, normal heart size",
      imageUrl: undefined, // Placeholder - no image URL in mock data
    },
    {
      id: "rad-2",
      date: "2023-09-12",
      description: "Abdominal ultrasound - Normal organ structure",
      imageUrl: undefined,
    },
  ],
};

// TEMP MOCK NEW PET ASSIGNMENT – REMOVE AFTER BACKEND INTEGRATION
// Mock incomplete pet ONLY when NODE_ENV === "development"
const MOCK_NEW_PET_DETAIL: PetDetailData = {
  petId: "new-pet-1",
  petName: "New Pet",
  ownerName: "New Owner",
  purchaseDate: "2024-01-15",
  isOnline: false,
  isNew: true,
  isProfileComplete: false,
  burnedCalories: 0,
  waterConsumption: 0,
  foodConsumption: 0,
  sleep: 0,
  hrv: 0,
  bodyTemperature: 0,
  heartRate: 0,
  respiratoryRate: 0,
  bloodOxygen: 0,
  burnedCaloriesValue: 0,
  waterIntake: 0,
  foodIntake: 0,
  surgeryHistory: [],
  labTests: [],
  radiologyImages: [],
};

export default function VetPetDetailPage() {
  const params = useParams();
  const petId = params?.petId as string;
  const t = useTranslations("vetPetDetail");
  const tNewPet = useTranslations("vetNewPet");
  const tCommon = useTranslations("common");
  const [data, setData] = useState<PetDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<
    "surgery" | "lab" | "radiology" | null
  >(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<PetDetailData | null>(null);
  const [petImageFile, setPetImageFile] = useState<File | null>(null);
  const [petImagePreview, setPetImagePreview] = useState<string | null>(null);

  // TODO: Replace with actual API call to fetch pet detail
  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
        // Check if this is a mock pet for UI preview
        if (petId === "mock") {
          setData(MOCK_PET_DETAIL);
          setLoading(false);
          return;
        }
        
        // TEMP MOCK NEW PET ASSIGNMENT – REMOVE AFTER BACKEND INTEGRATION
        // Mock new incomplete pet ONLY in development
        if (petId === "new-pet-1" && process.env.NODE_ENV === "development") {
          setData(MOCK_NEW_PET_DETAIL);
          setLoading(false);
          return;
        }

        // Example API call (uncomment when backend is ready):
        // const response = await fetch(`/api/vet/pets/${petId}`);
        // const petData = await response.json();
        // setData(petData);

        // Temporary: Set loading to false so UI renders
        // Remove this when implementing real API call
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch pet detail:", error);
        setLoading(false);
      }
    };

    if (petId) {
      fetchPetDetail();
    }
  }, [petId]);

  // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
  // Use mock data if petId matches mock pets, otherwise use fetched data or show error
  const petData: PetDetailData | null =
    data ||
    (petId === "mock"
      ? MOCK_PET_DETAIL
      : petId === "new-pet-1" && process.env.NODE_ENV === "development"
      ? MOCK_NEW_PET_DETAIL
      : null);

  const isProfileIncomplete = petData ? !petData.isProfileComplete : false;
  
  // Auto-enable edit mode when profile is incomplete
  // This hook must be called before any early returns (Rules of Hooks)
  useEffect(() => {
    if (isProfileIncomplete && petData) {
      setIsEditMode(true);
      setEditedData({ ...petData });
    }
  }, [isProfileIncomplete, petData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  // If no data and not mock pet, show error
  if (!petData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecord = (
    type: "surgery" | "lab" | "radiology",
    newRecord: { id: string; date: string; description: string; [key: string]: any }
  ) => {
    if (!editedData) return;
    
    const updatedData = { ...editedData };
    if (type === "surgery") {
      updatedData.surgeryHistory = [...updatedData.surgeryHistory, newRecord];
    } else if (type === "lab") {
      updatedData.labTests = [...updatedData.labTests, newRecord];
    } else if (type === "radiology") {
      updatedData.radiologyImages = [...updatedData.radiologyImages, newRecord];
    }
    setEditedData(updatedData);
  };

  const handleCompleteProfile = async () => {
    if (!editedData) return;
    
    try {
      setIsCompleting(true);
      
      // Prepare form data for submission
      const formData = new FormData();
      formData.append("petId", petId);
      formData.append("data", JSON.stringify({
        ...editedData,
        isProfileComplete: true,
        isNew: false,
      }));
      
      if (petImageFile) {
        formData.append("petImage", petImageFile);
      }
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/vet/pets/${petId}/complete`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      
      // Mock success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state
      const completedData = {
        ...editedData,
        isProfileComplete: true,
        isNew: false,
        petImage: petImagePreview || editedData.petImage,
      };
      setData(completedData);
      setEditedData(null);
      setIsEditMode(false);
      setPetImageFile(null);
      setPetImagePreview(null);
      
      // TODO: Clear related alert
      // await fetch(`/api/vet/alerts/clear-pet/${petId}`, { method: 'POST' });
    } catch (error) {
      console.error("Failed to complete profile:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Completion Mode Banner */}
        {isProfileIncomplete && (
          <div className="rounded-2xl border-2 border-blue-500 bg-blue-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500 p-2">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  {tNewPet("profileIncompleteBanner")}
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  {tNewPet("profileIncompleteDescription")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Section - Activity Rings */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Activity Rings */}
            <div className="flex-shrink-0">
              <ConcentricActivityRings
                burnedCalories={petData.burnedCalories}
                waterConsumption={petData.waterConsumption}
                foodConsumption={petData.foodConsumption}
              />
            </div>

            {/* Pet Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {petData.petName}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  {t("owner")}: {petData.ownerName}
                </p>
                <p className="text-sm text-gray-600">
                  {t("purchaseDate")}: {petData.purchaseDate}
                </p>
                
                {/* Pet Photo Upload (Edit Mode Only) */}
                {isEditMode && isProfileIncomplete && (
                  <div className="mt-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4">
                    <label className="flex cursor-pointer flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Upload size={20} />
                        <span className="font-medium">{tNewPet("uploadPetPhoto")}</span>
                      </div>
                      {petImagePreview ? (
                        <img
                          src={petImagePreview}
                          alt="Pet preview"
                          className="mt-2 h-24 w-24 rounded-full object-cover"
                        />
                      ) : petData.petImage ? (
                        <img
                          src={petData.petImage}
                          alt="Current pet photo"
                          className="mt-2 h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                          <span className="text-gray-500">{petData.petName.charAt(0)}</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="text-xs text-blue-600">
                        {petImagePreview ? tNewPet("photoUpdated") : tNewPet("clickToUpload")}
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            {t("healthMetrics")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <HealthMetricCard
              icon={Moon}
              label={t("sleep")}
              value={petData.sleep}
              unit={t("hours")}
            />
            <HealthMetricCard
              icon={Activity}
              label={t("hrv")}
              value={petData.hrv}
              unit="ms"
            />
            <HealthMetricCard
              icon={Thermometer}
              label={t("bodyTemperature")}
              value={petData.bodyTemperature}
              unit="°C"
            />
            <HealthMetricCard
              icon={Heart}
              label={t("heartRate")}
              value={petData.heartRate}
              unit={t("bpm")}
            />
            <HealthMetricCard
              icon={Wind}
              label={t("respiratoryRate")}
              value={petData.respiratoryRate}
              unit={t("breathsPerMin")}
            />
            <HealthMetricCard
              icon={Droplet}
              label={t("bloodOxygen")}
              value={petData.bloodOxygen}
              unit="%"
            />
            <HealthMetricCard
              icon={Flame}
              label={t("burnedCalories")}
              value={petData.burnedCaloriesValue}
              unit={t("kcal")}
            />
            <HealthMetricCard
              icon={Droplet}
              label={t("waterIntake")}
              value={petData.waterIntake}
              unit="ml"
            />
            <HealthMetricCard
              icon={UtensilsCrossed}
              label={t("foodIntake")}
              value={petData.foodIntake}
              unit="g"
            />
          </div>
        </div>

        {/* Medical Records Section */}
        <div className={`rounded-2xl bg-white p-6 shadow-sm ${isEditMode && isProfileIncomplete ? "ring-2 ring-blue-300" : ""}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {t("medicalRecords")}
            </h2>
            {isEditMode && isProfileIncomplete && (
              <span className="text-xs font-medium text-blue-600">
                {tNewPet("editableSection")}
              </span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => setOpenModal("surgery")}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                isEditMode && isProfileIncomplete
                  ? "border-blue-300 bg-blue-50 hover:border-blue-400 hover:shadow-md"
                  : "border-gray-200 hover:border-[#0F5D4A] hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("surgeryHistory")}
                </h3>
                {isEditMode && isProfileIncomplete && (
                  <Plus size={18} className="text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {(editedData || petData).surgeryHistory.length} {t("records")}
              </p>
            </button>

            <button
              onClick={() => setOpenModal("lab")}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                isEditMode && isProfileIncomplete
                  ? "border-blue-300 bg-blue-50 hover:border-blue-400 hover:shadow-md"
                  : "border-gray-200 hover:border-[#0F5D4A] hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("labTests")}
                </h3>
                {isEditMode && isProfileIncomplete && (
                  <Plus size={18} className="text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {(editedData || petData).labTests.length} {t("records")}
              </p>
            </button>

            <button
              onClick={() => setOpenModal("radiology")}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                isEditMode && isProfileIncomplete
                  ? "border-blue-300 bg-blue-50 hover:border-blue-400 hover:shadow-md"
                  : "border-gray-200 hover:border-[#0F5D4A] hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("radiologyImages")}
                </h3>
                {isEditMode && isProfileIncomplete && (
                  <Plus size={18} className="text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {(editedData || petData).radiologyImages.length} {t("records")}
              </p>
            </button>
          </div>
        </div>

        {/* Edit & Submit / Complete Profile Button */}
        <div className="flex justify-end gap-3">
          {isProfileIncomplete ? (
            <button
              onClick={handleCompleteProfile}
              disabled={isCompleting}
              className="rounded-xl bg-blue-500 px-6 py-3 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCompleting ? tCommon("loading") : tNewPet("completeProfile")}
            </button>
          ) : (
            <button className="rounded-xl bg-[#0F5D4A] px-6 py-3 text-white font-medium hover:bg-[#0b4a3a] transition-colors">
              {t("editSubmit")}
            </button>
          )}
        </div>

        {/* Medical Record Modals */}
        <MedicalRecordModal
          isOpen={openModal === "surgery"}
          onClose={() => setOpenModal(null)}
          title={t("surgeryHistory")}
          records={(editedData || petData).surgeryHistory}
          isEditMode={isEditMode && isProfileIncomplete}
          onAddRecord={(record) => handleAddRecord("surgery", record)}
        />
        <MedicalRecordModal
          isOpen={openModal === "lab"}
          onClose={() => setOpenModal(null)}
          title={t("labTests")}
          records={(editedData || petData).labTests}
          isEditMode={isEditMode && isProfileIncomplete}
          onAddRecord={(record) => handleAddRecord("lab", record)}
        />
        <MedicalRecordModal
          isOpen={openModal === "radiology"}
          onClose={() => setOpenModal(null)}
          title={t("radiologyImages")}
          records={(editedData || petData).radiologyImages}
          isEditMode={isEditMode && isProfileIncomplete}
          onAddRecord={(record) => handleAddRecord("radiology", record)}
        />
      </div>
    </div>
  );
}

