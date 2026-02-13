// app/fonts.ts
import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const vazir = localFont({
  src: "./fonts/Vazirmatn.ttf",
  variable: "--font-vazir",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export { inter, vazir };