"use client";
import { brand } from "../../lib/brand";
 type Props = {
  locale: "fa" | "en";
};

export default function ContactInfoSection({ locale }: Props) {
  const isFa = locale === "fa";

  return (
    <section
      dir={isFa ? "rtl" : "ltr"}
      className="max-w-2xl mx-auto my-24 px-6"
    >
      {/* Title */}
      <div className="text-center mb-10">
        <p className="mt-3 text-white/60 text-sm md:text-base">
          {isFa
            ? "راه‌های ارتباطی و اطلاعات دفتر ما"
            : "Our office contact details and working hours"}
        </p>
      </div>

      {/* Info Card */}
      <div className="grid grid-cols-1 gap-6  bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-10 shadow-xl">
        {/* Phone */}
        <div className="flex items-start gap-4 py-10">
          <span className="text-2xl">📞</span>
          <div>
            <p className="text-sm text-white/80">
              {isFa ? "تلفن" : "Phone"}
            </p>
            <p className="text-white font-medium">+98 21 88970654</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4 py-10">
          <span className="text-2xl">✉️</span>
          <div>
            <p className="text-sm text-white/80">Email</p>
            <p className="text-white font-medium">amcollarco@gmail.com</p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-start gap-4 py-10">
          <span className="text-2xl">🕒</span>
          <div>
            <p className="text-sm text-white/80">
              {isFa ? "ساعت کاری" : "Working Hours"}
            </p>
            <p className="text-white font-medium">09:00 – 17:00</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4 pb-5">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-sm text-white/80">
              {isFa ? "آدرس" : "Address"}
            </p>
            <p className="text-white font-medium">
              {isFa ?  "ایران تهران خیابان فلسطین شمالی کوچه رنجبر پلاک ۲۹ واحد ۱" : "Tehran, Iran,  phelestin Street,ranjbar alley, No.29, Unit 1"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
