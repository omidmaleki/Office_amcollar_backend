"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "../../lib/dictionaries";
import { brand } from "../../lib/brand";

type Props = {
  locale: Locale;
  dict: any;
};

export default function Navbar({ locale, dict }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFa = locale === "fa";
  const switchLocale = isFa ? "en" : "fa";

  // ===== URLs =====
  const APP_BASE_URL = "https://app.amcollar.com";
  const loginUrl = `${APP_BASE_URL}/${locale}`;

  const loginLabel = isFa ? "ورود به اپ" : "Login";

  const safeMenu = dict?.menu || {
    Monitor: isFa ? "پایش سلامت" : "Monitoring",
    Demo: isFa ? "دمو" : "Demo",
    HowItWorks: isFa ? "نحوه عملکرد" : "How It Works",
    Vet: isFa ? "پزشکان" : "Vets",
    ContactUs: isFa ? "تماس با ما" : "Contact",
    buy: isFa ? "خرید" : "Buy",
  };

  const menuItems = [
    { label: safeMenu.Monitor, hash: "monitor" },
    { label: safeMenu.Demo, hash: "demo" },
    { label: safeMenu.HowItWorks, hash: "how-it-works" },
    { label: safeMenu.Vet, hash: "vetlist" },
  ];

  return (
    <>
      {/* ===== Header ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b border-white/10"
        style={{ background: brand.BackgroundDark }}
        dir={isFa ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center">
              <Image
                src="/images/logotype.svg"
                alt="AMCOLLOR"
                width={200}
                height={32}
                className="h-8 md:h-10 w-auto"
                priority
                loading="eager"
              />
            </Link>

            {/* ===== Desktop Menu ===== */}
            <div className="hidden md:flex items-center w-full">
              <nav className="flex-1 flex justify-center items-center gap-6 lg:gap-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.hash}
                    href={`/${locale}#${item.hash}`}
                    className="h-10 flex items-center text-white/85 hover:text-white font-medium transition"
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href={`/${locale}/contact`}
                  className="h-10 flex items-center text-white/85 hover:text-white font-medium"
                >
                  {safeMenu.ContactUs}
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <a
                  href={loginUrl}
                  className="h-10 flex items-center font-medium transition"
                  style={{ color: "#d4af37" }}
                >
                  {loginLabel}
                </a>

                <span className="h-6 w-px bg-white/20 mx-1" />

                <Link
                  href={`/${locale}/buy`}
                  className="rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0C4E3F] transition"
                  style={{
                    background: brand.primarygold,
                    color: brand.primarygreen,
                  }}
                >
                  {safeMenu.buy}
                </Link>

                <Link
                  href={`/${switchLocale}`}
                  className="h-10 flex items-center text-white/60 hover:text-white text-xs font-medium uppercase tracking-widest"
                >
                  {switchLocale}
                </Link>
              </div>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-white text-3xl"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent layout shift when header is fixed */}
      <div className="h-16 md:h-20" aria-hidden="true" />

      {/* ===== Mobile Menu ===== */}
      <div
        className={`fixed inset-0 z-[110] transition ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 right-0 transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{ background: brand.BackgroundDark }}
        >
          <div className="px-8 py-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 left-8 text-3xl text-white"
            >
              ✕
            </button>

            <div className="text-center mt-4 mb-10">
              <Link href={`/${locale}`} className="flex justify-center items-center">
                <Image
                  src="/images/LOGOTYPEr.svg"
                  alt="AMCOLLOR"
                  width={200}
                  height={32}
                  className="h-10 w-auto"
                  loading="eager"
                />
              </Link>
            </div>

            <nav className="flex flex-col gap-6 text-center">
              {menuItems.map((item) => (
                <Link
                  key={item.hash}
                  href={`/${locale}#${item.hash}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium py-3 border-b border-white/10"
                  style={{ color: "#d4af37" }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-medium py-3 border-b border-white/10"
                style={{ color: "#d4af37" }}
              >
                {safeMenu.ContactUs}
              </Link>

              <a
                href={loginUrl}
                className="text-xl font-medium py-3 border-b border-white/10"
                style={{ color: "#d4af37" }}
              >
                {loginLabel}
              </a>

              <Link
                href={`/${locale}/buy`}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-8 py-4 rounded-full font-bold text-xl shadow-xl"
                style={{
                  background: brand.primarygold,
                  color: brand.primarygreen,
                }}
              >
                {safeMenu.buy}
              </Link>

              <Link
                href={`/${switchLocale}`}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 text-white/70 uppercase tracking-wider text-lg"
              >
                {switchLocale}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}