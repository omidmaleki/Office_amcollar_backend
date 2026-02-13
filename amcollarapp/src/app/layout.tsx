import "./globals.css";
import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/config";
import { NextIntlClientProvider } from "next-intl";
import { Suspense } from "react";
import { Vazirmatn, Inter } from "next/font/google";

// Configure Vazirmatn for Persian
const vazirmatn = Vazirmatn({
  subsets: ["latin", "arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  adjustFontFallback: false,
});

// Configure Inter for English
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "AMCOLLAR",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" suppressHydrationWarning className={`${vazirmatn.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider locale={defaultLocale} messages={{}}>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}