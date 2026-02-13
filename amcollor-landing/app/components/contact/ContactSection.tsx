"use client";

import ContactForm from "./ContactForm";
import ContactInfoSection from "./ContactInfoSection";

type Props = {
  locale: "fa" | "en";
};

export default function ContactSection({ locale }: Props) {
  const isFa = locale === "fa";

  return (
    <section
      dir={isFa ? "rtl" : "ltr"}
      className="relative py-32 px-6"
    >
      {/* TITLE */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          {isFa ? "ارتباط با ما" : "Contact Us"}
        </h2>
        <p className="mt-4 text-white/60 text-sm md:text-base">
          {isFa
            ? "از طریق فرم یا اطلاعات زیر با ما در ارتباط باشید."
            : "Reach us through the form or the contact details below."}
        </p>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
       

        <div className="h-full">
          <ContactInfoSection locale={locale} />
        </div>
         <div className="h-full">
          <ContactForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
