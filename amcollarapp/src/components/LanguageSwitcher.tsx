"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
];

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = (params?.locale as string) || "en";
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    // Replace the locale in the current pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
    
    // Persist language preference
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLocale", newLocale);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm transition-shadow hover:shadow-md"
        aria-label="Switch language"
      >
        <Globe size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.flag} {currentLanguage.label}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  currentLocale === lang.code ? "bg-[#0F5D4A]/5" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium text-gray-700">
                  {lang.label}
                </span>
                {currentLocale === lang.code && (
                  <span className="ml-auto text-[#0F5D4A]">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}



















