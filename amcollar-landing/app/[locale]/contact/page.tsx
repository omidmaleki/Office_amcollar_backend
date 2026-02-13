import { getDictionary, Locale } from "../../lib/dictionaries";
import AboutSection from "../../components/contact/AboutSection";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfoSection from "../../components/contact/ContactInfoSection";
import MapEmbed from "../../components/contact/MapEmbed";
import { brand } from "@/app/lib/brand";
import ContactSection from "@/app/components/contact/ContactSection";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  getDictionary(locale); // فقط برای هماهنگی ساختار

  return (
    <main  style={{
          background: `linear-gradient(180deg, ${brand.BackgroundDark}, ${brand.primarygreen})`,
        }}>

      <AboutSection locale={locale} />
      <ContactSection locale={locale} />
      <MapEmbed />
    </main>
  );
}
