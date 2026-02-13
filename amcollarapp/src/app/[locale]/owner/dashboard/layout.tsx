"use client";

import { useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { useRouter } from "@/i18n/routing";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    if (!auth || auth.role !== "owner") {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
