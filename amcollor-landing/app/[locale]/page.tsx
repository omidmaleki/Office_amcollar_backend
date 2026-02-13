import { getDictionary, Locale } from "../lib/dictionaries";
import HeroCat from "../components/home/heroCat";
import Demo from "../components/home/Demo";
import HowItWorksSlider from "../components/home/HowItWorkSlider";
import Comparison from "../components/home/Comparison";
import VetSlider from "../components/home/VetSlider";
import TestimonialSlider from "../components/home/TestimonialSlider";
import SectionDots from "../components/home/SectionDots";
import VetCooperationForm from "../components/home/VetCooperationForm";
import AiMonitoringSection from "../components/home/AiMonitoringSection";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const vets = [
    {
      id: 1,
      name: { fa: "اندی لاو", en: "Andy Law" },
      license: "45821",
      description: {
        fa: "دامپزشک با تمرکز بر درمان حیوانات خانگی و جراحی‌های پیشرفته.",
        en: "Veterinarian focused on advanced pet treatment and surgery.",
      },
    },
    {
      id: 2,
      name: { fa: "خنا قناتی", en: "hana ghanati" },
      license: "77412",
      description: {
        fa: "متخصص سلامت و تغذیه حیوانات.",
        en: "Pet health and nutrition specialist.",
      },
    },
  ];

  const testimonials = dict?.testimonial?.items ?? [];

  // Define all sections in order of appearance
  const sections = [
    "hero",
    "monitor", 
    "demo", 
    "how-it-works", 
    "comparison",
    "vetlist",
    "vet-form",
    "testimonial"
  ];

  return (
    <main className="scroll-smooth overflow-x-hidden">
      <SectionDots
        sections={sections}
        locale={locale}
      />

      <section id="hero" className="relative">
        <HeroCat locale={locale} dict={dict} />
      </section>

      <section id="monitor" className="relative">
        <AiMonitoringSection locale={locale} dict={dict} />
      </section>

      <section id="demo" className="relative">
        <Demo locale={locale} dict={dict} />
      </section>

      <section id="how-it-works" className="relative">
        <HowItWorksSlider locale={locale} dict={dict} />
      </section>

      <section id="comparison" className="relative">
        <Comparison dict={dict} locale={locale} />
      </section>

      <section id="vetlist" className="relative">
        <VetSlider locale={locale} />
      </section>

      <section id="vet-form" className="relative">
        <VetCooperationForm dict={dict} locale={locale} />
      </section>

      <section id="testimonial" className="relative">
        <TestimonialSlider items={testimonials} locale={locale} />
      </section>
    </main>
  );
}