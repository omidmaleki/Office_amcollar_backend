// This file should not exist when using localePrefix: "always"
// The middleware redirects / to /fa, which renders [locale]/page.tsx
// If you need to keep this file, it should just redirect
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/fa");
}