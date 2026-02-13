"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function LocaleAttributes() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa"; // Changed from "en" to "fa"

  useEffect(() => {
    // Update html lang and dir attributes based on locale
    const direction = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;

    // Apply font class to body based on locale
    const fontClass = locale === "fa" ? "font-fa" : "font-en";
    document.body.className = document.body.className
      .replace(/font-(fa|en)/g, "")
      .trim();
    document.body.classList.add(fontClass);
  }, [locale]);

  return null;
}