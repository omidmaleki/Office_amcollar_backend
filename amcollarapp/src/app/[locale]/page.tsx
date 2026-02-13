"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";

export default function LocalePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      router.replace("/role-select");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0b1f1a]">
      <div className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <Image
          src="/images/logotype.svg"
          alt="AMCOLLAR"
          width={280}
          height={45}
          className="animate-pulse"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}