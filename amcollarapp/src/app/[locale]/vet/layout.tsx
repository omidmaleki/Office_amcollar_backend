"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { getAuth } from "@/lib/auth";
import { useRouter } from "@/i18n/routing";
import { VetAPI } from "@/lib/api";
import VetSidebarLayout from "@/components/VetSidebarLayout";

export default function VetDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Allow access to registration page without approval check
  const isRegistrationPage = pathname?.includes("/vet/register");

  useEffect(() => {
    const checkAccess = async () => {
      const auth = getAuth();
      
      // Check authentication
      if (!auth || auth.role !== "vet") {
        router.replace("/login?role=vet");
        return;
      }

      // Skip approval check for registration page
      if (isRegistrationPage) {
        setIsChecking(false);
        return;
      }

      // DEV ONLY: Vet registration check bypassed in development
      const isDevelopment = process.env.NODE_ENV === "development";
      if (isDevelopment) {
        setIsChecking(false);
        return;
      }

      // For other vet pages, check if vet is approved (production only)
      try {
        // Get phone from auth or localStorage
        const phone = auth.user?.phone || localStorage.getItem("vetRegistrationPhone");
        
        if (phone) {
          const status = await VetAPI.checkStatus(phone);
          
          if (status.status !== "APPROVED") {
            // Not approved → redirect to registration
            router.replace("/vet/register");
            return;
          }
        } else {
          // No phone found → redirect to registration
          router.replace("/vet/register");
          return;
        }
      } catch (error) {
        console.error("Failed to check vet status:", error);
        // On error, allow access (will be checked again on next navigation)
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [router, isRegistrationPage]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Don't show sidebar on registration page
  if (isRegistrationPage) {
    return <>{children}</>;
  }

  return <VetSidebarLayout>{children}</VetSidebarLayout>;
}
