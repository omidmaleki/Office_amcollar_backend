"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Map,
  User,
  LifeBuoy,
  LogOut,
  Wifi,
  Bell,
  Globe,
  ChevronDown,
} from "lucide-react";
import { getAuth } from "@/lib/auth";
import { Link, usePathname, useRouter } from "@/i18n/routing";

const menuItems = [
  { path: "/owner/connection", icon: Wifi },
  { path: "/owner/dashboard", icon: LayoutDashboard },
  { path: "/owner/map", icon: Map },
  { path: "/owner/profile", icon: User },
  { path: "/owner/alerts", icon: Bell },
  { path: "/owner/support", icon: LifeBuoy },
];

const languages = [
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const auth = getAuth();
  const t = useTranslations("sidebar");
  const router = useRouter();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const [unreadAlertsCount] = useState(2);

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(`${path}/`);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("auth");
    
    // Navigate to role-select page using locale-aware router
    // The router will automatically add the current locale prefix
    router.push("/role-select");
  };

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsLanguageMenuOpen(false);
      return;
    }
  
    // Persist language preference
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLocale", newLocale);
    }
  
    // Get current pathname (without locale prefix)
    const currentPath = pathname || "/owner/dashboard";
    
    // Use replace instead of push to ensure URL changes and triggers re-render
    // This will cause Next.js to re-mount the [locale] layout with new locale
    router.replace(currentPath, { locale: newLocale });
    setIsLanguageMenuOpen(false);
    
    // Force a full page reload to ensure all components re-render with new locale
    // This is necessary because some components might not update immediately
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-14 md:w-28 bg-[#0B2E26] md:bg-transparent">
      {/* INNER PANEL */}
      <div className="h-full pb-5 flex flex-col md:rounded-none md:bg-gradient-to-b md:from-[#0F5D4A] md:to-[#083A30] overflow-hidden">
        {/* MENU (Scrollable) */}
        <nav className="flex-1">
          <div className="flex flex-col items-center gap-5 mt-8 pb-8">
            {menuItems.map(({ path, icon: Icon }) => {
              const active = isActive(path);
              const isAlerts = path === "/owner/alerts";

              return (
                <Link
                  key={path}
                  href={path}
                  className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={22} />
                  {isAlerts && unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {unreadAlertsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col items-center gap-3 px-2">
          {/* Language Switcher */}
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Globe size={22} />
            </button>

            {isLanguageMenuOpen && (
              <>
                {/* Mobile: Overlay */}
                <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsLanguageMenuOpen(false)} />
                
                {/* Language Menu */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 md:mb-2 bg-[#0F5D4A] md:bg-[#0F5D4A] rounded-xl shadow-xl border border-white/10 overflow-hidden min-w-[120px] md:min-w-[140px] z-50">
                  {languages.map((lang) => {
                    const isActive = lang.code === locale;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-3 py-2 md:px-4 md:py-2.5 flex items-center gap-2 text-xs md:text-sm transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </aside>
  );
}