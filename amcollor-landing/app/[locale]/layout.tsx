import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getDictionary } from "../lib/dictionaries";
export async function generateMetadata() {
  return {
    other: {
      enamad: "68768112",
    },
  };
}


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // ← این خط کلید حل است
  const safeLocale = locale === "fa" ? "fa" : "en";
  const dict = getDictionary(safeLocale);

  return (
    <>
      <Navbar locale={safeLocale} dict={dict} />
      {children}
      <Footer locale={safeLocale} dict={dict} />
    </>
  );
}
