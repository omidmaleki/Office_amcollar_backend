"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { BuyState } from "../types";
import { brand } from "@/app/lib/brand";

type Vet = {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  specialty?: string;
  rating?: number;
  vet_license_number?: string;
  rank?: string;
  activated?: boolean;
  image?: string;
};

type Props = {
  state: BuyState;
  onChange: (patch: Partial<BuyState>) => void;
  onNext: () => void;
  onPrev: () => void;
  dict: any;
  locale: "fa" | "en";
};

export default function Step4Veterinarian({ state, onChange, onNext, onPrev, dict, locale }: Props) {
  const isFa = locale === "fa";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Veterinarian list state
  const [vets, setVets] = useState<Vet[]>([]);
  const [isLoadingVets, setIsLoadingVets] = useState(true);
  const [vetsError, setVetsError] = useState<string | null>(null);

  // Fetch veterinarians from API
  useEffect(() => {
    async function fetchVets() {
      try {
        setIsLoadingVets(true);
        setVetsError(null);

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Add access token if available
        if (state.accessToken) {
          headers["Authorization"] = `Bearer ${state.accessToken}`;
        }

        console.log("📤 Fetching veterinarians from API...");

        const response = await fetch("https://amcollar.com/api/vet/vets/", {
          method: "GET",
          headers,
        });

        console.log("📥 Vets API response:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch veterinarians: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type");
        let data: Vet[] = [];

        if (contentType && contentType.includes("application/json")) {
          const responseText = await response.text();
          console.log("📄 Vets response text:", responseText);
          
          if (responseText.trim()) {
            data = JSON.parse(responseText);
            console.log("✅ Parsed vets data:", data);
          }
        } else {
          const textResponse = await response.text();
          console.warn("⚠️ Non-JSON vets response:", textResponse);
          throw new Error("Invalid response format from veterinarians API");
        }

        // Filter only activated vets if the field exists
        const activeVets = data.filter((vet) => vet.activated !== false);
        
        // Map API response to our format
        const mappedVets: Vet[] = activeVets.map((vet) => ({
          id: vet.id,
          name: vet.name,
          phone: vet.phone,
          address: vet.address,
          specialty: vet.rank || vet.vet_license_number || "Veterinarian",
          rating: 4.5, // Default rating if not provided
          vet_license_number: vet.vet_license_number,
          rank: vet.rank,
          activated: vet.activated,
          image: vet.image,
        }));

        setVets(mappedVets);
        console.log("✅ Loaded veterinarians:", mappedVets.length);
      } catch (error: any) {
        console.error("❌ Failed to fetch veterinarians:", error);
        setVetsError(
          error.message || (isFa ? "خطا در بارگذاری لیست دامپزشکان" : "Failed to load veterinarians")
        );
        setVets([]);
      } finally {
        setIsLoadingVets(false);
      }
    }

    fetchVets();
  }, [state.accessToken, isFa]);

  // Filter veterinarians by name
  const filteredVets = useMemo(() => {
    if (!searchQuery.trim()) return vets;
    const query = searchQuery.toLowerCase();
    return vets.filter((vet) => 
      vet.name.toLowerCase().includes(query) ||
      vet.specialty?.toLowerCase().includes(query)
    );
  }, [vets, searchQuery]);

  // Handle vet selection (just store the ID, don't submit yet)
  const handleVetClick = (vetId: string) => {
    const selectedVet = vets.find((v) => String(v.id) === vetId);
    
    // Only store vet ID and name in state
    onChange({ 
      vetId,
      vetName: selectedVet?.name, // Store vet name for review step
    });
    
    // Clear any previous errors
    setApiError(null);
  };

  // Handle form submission to API
  const handleSubmit = async () => {
    // Validate that all required data is present
    if (!state.ownerName?.trim() || !state.petName?.trim() || !state.address?.trim() || !state.petType) {
      setApiError(
        isFa 
          ? "لطفاً تمام اطلاعات مورد نیاز را در مرحله قبل وارد کنید" 
          : "Please fill in all required information from the previous step"
      );
      return;
    }

    if (!state.vetId) {
      setApiError(
        isFa 
          ? "لطفاً یک دامپزشک انتخاب کنید" 
          : "Please select a veterinarian"
      );
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      // Prepare request body exactly as specified - only send required fields
      const requestBody = {
        owner: {
          name: state.ownerName.trim(),
          phone: state.phone?.trim() || "",
          address: state.address.trim(),
        },
        pet: {
          name: state.petName.trim(),
          species: state.petType, // "dog" or "cat"
          sex: state.petSex || "male", // Default to "male" if not set
          age: state.petAge || 1, // Default to 1 if not set
          race: state.petBreed?.trim() || "", // Breed/race
        },
        vet: parseInt(state.vetId, 10), // Convert vet ID to number
      };

      console.log("📤 Submitting registration:", JSON.stringify(requestBody, null, 2));

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add access token if available
      if (state.accessToken) {
        headers["Authorization"] = `Bearer ${state.accessToken}`;
      }

      const response = await fetch("https://amcollar.com/api/register/", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Registration response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        try {
          const responseText = await response.text();
          console.log("📄 Response text:", responseText);
          
          if (responseText.trim()) {
            data = JSON.parse(responseText);
            console.log("✅ Parsed response data:", data);
          }
        } catch (jsonError) {
          console.error("❌ Failed to parse JSON response:", jsonError);
          throw new Error(
            isFa 
              ? "خطا در دریافت پاسخ از سرور" 
              : "Failed to parse server response"
          );
        }
      } else {
        const textResponse = await response.text();
        console.log("📄 Non-JSON response:", textResponse);
        
        if (response.ok) {
          // Non-JSON success response
          setSuccessMessage(
            isFa 
              ? "ثبت‌نام با موفقیت انجام شد" 
              : "Registration successful"
          );
          setTimeout(() => {
            onNext();
          }, 1500);
          return;
        } else {
          throw new Error(
            textResponse || (isFa ? "خطا در ثبت‌نام" : "Registration failed")
          );
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = extractErrorMessage(data);
        
        console.error("❌ API Error:", {
          status: response.status,
          statusText: response.statusText,
          data,
          extractedMessage: errorMessage,
        });
        
        throw new Error(errorMessage);
      }

      // Success
      console.log("✅ Registration successful:", data);
      setSuccessMessage(
        isFa 
          ? "ثبت‌نام با موفقیت انجام شد" 
          : "Registration successful"
      );
      
      // Proceed to next step after a short delay
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error: any) {
      console.error("❌ Registration Error:", error);
      
      // Handle different error types
      let errorMessage: string;
      
      if (error instanceof TypeError) {
        if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          // Network error (CORS, connection failure, etc.)
          errorMessage = isFa 
            ? "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید."
            : "Network error. Please check your internet connection.";
        } else {
          errorMessage = error.message || (isFa ? "خطا در ثبت‌نام" : "Registration failed");
        }
      } else if (error.message) {
        // Use the extracted error message
        errorMessage = error.message;
      } else {
        errorMessage = isFa 
          ? "خطا در ثبت‌نام" 
          : "Registration failed";
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to extract error message from nested error responses
  const extractErrorMessage = (errorData: any): string => {
    if (!errorData) return isFa ? "خطا در ثبت‌نام" : "Registration failed";
    
    // Handle string errors
    if (typeof errorData === "string") {
      return errorData;
    }
    
    // Handle object errors - check multiple possible fields
    const errorFields = [
      "message",
      "error",
      "detail",
      "error_message",
      "error_detail",
      "msg",
    ];
    
    for (const field of errorFields) {
      if (errorData[field]) {
        const value = errorData[field];
        // If it's a nested object, try to extract from it
        if (typeof value === "object" && value !== null) {
          const nested = extractErrorMessage(value);
          if (nested !== (isFa ? "خطا در ثبت‌نام" : "Registration failed")) {
            return nested;
          }
        } else if (typeof value === "string") {
          return value;
        }
      }
    }
    
    // Check if error is in the root level with common error patterns
    const errorString = JSON.stringify(errorData);
    if (errorString.includes("column") && errorString.includes("does not exist")) {
      return isFa 
        ? "خطای پایگاه داده: ستون مورد نظر در دیتابیس وجود ندارد. لطفاً با پشتیبانی تماس بگیرید."
        : "Database error: Column does not exist. Please contact support.";
    }
    
    if (errorString.includes("Failed to create owner")) {
      // Extract the actual error message after "Failed to create owner:"
      const match = errorString.match(/Failed to create owner[:\s]+([^"]+)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return isFa ? "خطا در ثبت‌نام" : "Registration failed";
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {isFa ? "انتخاب دامپزشک" : "Select Veterinarian"}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {isFa ? "دامپزشک مورد نظر خود را انتخاب کنید" : "Choose your preferred veterinarian"}
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border-2 border-green-400 text-green-200"
        >
          {successMessage}
        </motion.div>
      )}

      {/* API Error Message */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-200"
        >
          <div className="font-semibold mb-1">{isFa ? "خطا:" : "Error:"}</div>
          <div className="whitespace-pre-wrap">{apiError}</div>
          {apiError.includes("column") && apiError.includes("does not exist") && (
            <div className="mt-2 text-sm opacity-90">
              {isFa 
                ? "این یک خطای فنی در سرور است. لطفاً با پشتیبانی تماس بگیرید."
                : "This is a technical server error. Please contact support."}
            </div>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoadingVets && (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mb-4"
          />
          <p className="text-white/80">
            {isFa ? "در حال بارگذاری دامپزشکان..." : "Loading veterinarians..."}
          </p>
        </div>
      )}

      {/* Vets Loading Error */}
      {vetsError && !isLoadingVets && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-yellow-500/20 border-2 border-yellow-400 text-yellow-200"
        >
          <div className="font-semibold mb-1">{isFa ? "هشدار:" : "Warning:"}</div>
          <div>{vetsError}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline hover:no-underline"
          >
            {isFa ? "تلاش مجدد" : "Retry"}
          </button>
        </motion.div>
      )}

      {/* Search Input - Only show when vets are loaded */}
      {!isLoadingVets && vets.length > 0 && (
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFa ? "جستجوی دامپزشک..." : "Search veterinarian..."}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
          />
        </div>
      )}

      {/* Veterinarians List */}
      {!isLoadingVets && (
        <div className="space-y-4">
          {filteredVets.length > 0 ? (
            filteredVets.map((vet) => (
              <motion.button
                key={vet.id}
                whileHover={{ scale: state.vetId === String(vet.id) ? 1 : 1.02, y: state.vetId === String(vet.id) ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVetClick(String(vet.id))}
                disabled={isSubmitting}
                className={`w-full p-4 sm:p-6 rounded-xl border-2 transition-all text-left disabled:opacity-50 ${
                  state.vetId === String(vet.id)
                    ? "border-white bg-white text-[#0F5D4A] shadow-lg"
                    : "border-white/30 bg-white/10 text-white hover:border-white/60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base sm:text-lg mb-1 truncate">{vet.name}</div>
                    {vet.specialty && (
                      <div className={`text-xs sm:text-sm mb-2 ${state.vetId === String(vet.id) ? "opacity-80" : "opacity-60"}`}>
                        {vet.specialty}
                      </div>
                    )}
                    {vet.rating && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-white/40 flex items-center justify-center">
                          <svg className="w-2 h-2 fill-current text-white/90" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{vet.rating}</span>
                      </div>
                    )}
                  </div>
                  {state.vetId === String(vet.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-current flex items-center justify-center"
                    >
                      <div className="w-3 h-3 rounded-full bg-white/95 flex items-center justify-center">
                        <svg className="w-2 h-2 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))
          ) : !isLoadingVets ? (
            <div className="text-center py-8 text-white/60">
              {vets.length === 0
                ? (isFa ? "دامپزشکی یافت نشد" : "No veterinarians available")
                : (isFa ? "دامپزشکی با این نام یافت نشد" : "No veterinarian found with this name")}
            </div>
          ) : null}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold border-2 border-white/30 text-white hover:border-white/60 transition-colors disabled:opacity-50"
        >
          {isFa ? "← بازگشت" : "← Back"}
        </button>
        <motion.button
          whileHover={{ scale: state.vetId && !isSubmitting ? 1.02 : 1 }}
          whileTap={{ scale: state.vetId && !isSubmitting ? 0.98 : 1 }}
          onClick={handleSubmit}
          disabled={!state.vetId || isSubmitting || isLoadingVets}
          className="flex-1 py-3 sm:py-4 rounded-xl font-semibold text-neutral-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: (state.vetId && !isSubmitting && !isLoadingVets) ? brand.primarygold : `${brand.primarygold}40`,
          }}
          onMouseEnter={(e) => {
            if (state.vetId && !isSubmitting && !isLoadingVets) {
              e.currentTarget.style.backgroundColor = '#B8941F';
            }
          }}
          onMouseLeave={(e) => {
            if (state.vetId && !isSubmitting && !isLoadingVets) {
              e.currentTarget.style.backgroundColor = brand.primarygold;
            }
          }}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full"
              />
              {isFa ? "در حال ثبت..." : "Submitting..."}
            </>
          ) : (
            isFa ? "ادامه" : "Continue"
          )}
        </motion.button>
      </div>
    </div>
  );
}