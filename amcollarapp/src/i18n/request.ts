import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, use default if not
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load messages - use explicit imports for better compatibility
  const messages = locale === "fa"
    ? (await import("../../messages/fa.json")).default
    : (await import("../../messages/en.json")).default;

  return {
    locale,
    messages,
  };
});

