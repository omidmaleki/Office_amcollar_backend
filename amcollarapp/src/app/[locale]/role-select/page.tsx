"use client";

import { useState } from "react";
import { useParams, usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const languages = [
  { code: "fa" as const, label: "فارسی", flag: "🇮🇷" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const t = useTranslations("roleSelect");

  const params = useParams();
  const locale = (params?.locale as "fa" | "en") || "fa";

  const fullPathname = useNextPathname();
  const nextRouter = useNextRouter();

  const goToLogin = (role: "owner" | "vet") => {
    router.push(`/login?role=${role}`);
  };

  const changeLanguage = (newLocale: "fa" | "en") => {
    if (newLocale === locale) {
      return;
    }

    localStorage.setItem("preferredLocale", newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    const currentPath = fullPathname || `/${locale}/role-select`;
    const currentLocale = currentPath.split("/")[1];
    const hasLocale = currentLocale === "fa" || currentLocale === "en";
    const pathWithoutLocale = hasLocale ? (currentPath.replace(`/${currentLocale}`, "") || "/") : currentPath;
    const newPath = `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

    nextRouter.replace(newPath);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b1f1a] p-4">
      {/* Language Selection - Above the card */}
      <div className="mb-6 flex gap-3">
        {languages.map((l) => {
          const isActive = l.code === locale;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => changeLanguage(l.code)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[#D4AF37] text-white shadow-lg"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              } active:scale-[0.98]`}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* Role Selection Card */}
      <div className="w-full max-w-sm rounded-2xl bg-[#102a23] p-6 text-center shadow-lg">
        <h1 className="mb-6 text-xl font-semibold text-white">{t("title")}</h1>

        <button
          onClick={() => goToLogin("owner")}
          className="mb-3 w-full rounded-xl bg-[#0F5D4A] py-3 font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
        >
          {t("owner")}
        </button>

        <button
          onClick={() => goToLogin("vet")}
          className="w-full rounded-xl bg-[#D4AF37] py-3 font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
        >
          {t("vet")}
        </button>
      </div>
    </div>
  );
}