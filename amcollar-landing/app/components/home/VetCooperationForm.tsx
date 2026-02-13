"use client";

import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import PersianDatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar } from "lucide-react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

import "react-datepicker/dist/react-datepicker.css";
import { brand } from "@/app/lib/brand";
import {
  phoneSchema,
  nameSchema,
  formatPhoneInput,
  formatNameInput,
  getErrorMessage,
} from "@/app/lib/validators";

type Props = {
  dict: any;
  locale: "fa" | "en";
};

export default function VetCooperationForm({ dict, locale }: Props) {
  const isFa = locale === "fa";
  const t = dict.vetCooperation;

  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const gregorianRef = useRef<any>(null);
  const persianRef = useRef<any>(null);

  const textInView = useInView(textRef, { once: true, amount: 0.3 });
  const formInView = useInView(formRef, { once: true, amount: 0.3 });

  const textControls = useAnimation();
  const formControls = useAnimation();

  if (textInView) textControls.start("visible");
  if (formInView) formControls.start("visible");

  const textVariants: Variants = {
    hidden: { opacity: 0, x: isFa ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, x: isFa ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
  };

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{ fullName: string; phone: string; datetime: Date | null }>({
    fullName: "",
    phone: "",
    datetime: null,
  });

  const [errors, setErrors] = useState<{ fullName?: string | null; phone?: string | null; datetime?: string | null }>({});
  const [touched, setTouched] = useState<{ fullName?: boolean; phone?: boolean; datetime?: boolean }>({});

  // ------------- HANDLERS -------------
  const handleFullNameChange = (value: string) => {
    const formatted = formatNameInput(value);
    setFormData((prev) => ({ ...prev, fullName: formatted }));
    setTouched((prev) => ({ ...prev, fullName: true }));
    
    const result = nameSchema.safeParse(formatted);
    setErrors((prev) => ({ 
      ...prev, 
      fullName: result.success ? null : getErrorMessage(result.error, locale) 
    }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneInput(value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    setTouched((prev) => ({ ...prev, phone: true }));
    
    const result = phoneSchema.safeParse(formatted);
    setErrors((prev) => ({ 
      ...prev, 
      phone: result.success ? null : getErrorMessage(result.error, locale) 
    }));
  };

  const handleFullNameBlur = () => {
    setTouched((prev) => ({ ...prev, fullName: true }));
    const result = nameSchema.safeParse(formData.fullName);
    setErrors((prev) => ({ 
      ...prev, 
      fullName: result.success ? null : getErrorMessage(result.error, locale) 
    }));
  };

  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, phone: true }));
    const result = phoneSchema.safeParse(formData.phone);
    setErrors((prev) => ({ 
      ...prev, 
      phone: result.success ? null : getErrorMessage(result.error, locale) 
    }));
  };

  const handleDateTimeChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, datetime: date }));
    setTouched((prev) => ({ ...prev, datetime: true }));
    
    if (!date) {
      setErrors((prev) => ({ 
        ...prev, 
        datetime: isFa ? "تاریخ و ساعت الزامی است" : "Date and time are required" 
      }));
    } else {
      // Check if date is in the future
      const now = new Date();
      if (date <= now) {
        setErrors((prev) => ({ 
          ...prev, 
          datetime: isFa ? "تاریخ باید در آینده باشد" : "Date must be in the future" 
        }));
      } else {
        setErrors((prev) => ({ ...prev, datetime: null }));
      }
    }
  };

  const handleDateTimeBlur = () => {
    setTouched((prev) => ({ ...prev, datetime: true }));
    if (!formData.datetime) {
      setErrors((prev) => ({ 
        ...prev, 
        datetime: isFa ? "تاریخ و ساعت الزامی است" : "Date and time are required" 
      }));
    } else {
      const now = new Date();
      if (formData.datetime <= now) {
        setErrors((prev) => ({ 
          ...prev, 
          datetime: isFa ? "تاریخ باید در آینده باشد" : "Date must be in the future" 
        }));
      } else {
        setErrors((prev) => ({ ...prev, datetime: null }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, datetime: true });
    setError(null);

    // Validate all fields
    const nameResult = nameSchema.safeParse(formData.fullName);
    const phoneResult = phoneSchema.safeParse(formData.phone);
    
    const newErrors: typeof errors = {};
    
    if (!nameResult.success) {
      newErrors.fullName = getErrorMessage(nameResult.error, locale);
    }
    
    if (!phoneResult.success) {
      newErrors.phone = getErrorMessage(phoneResult.error, locale);
    }
    
    if (!formData.datetime) {
      newErrors.datetime = isFa ? "تاریخ و ساعت الزامی است" : "Date and time are required";
    } else {
      const now = new Date();
      if (formData.datetime <= now) {
        newErrors.datetime = isFa ? "تاریخ باید در آینده باشد" : "Date must be in the future";
      }
    }
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err !== null)) {
      return;
    }

    setLoading(true);

    try {
      const fullName = formData.fullName.trim().replace(/\s+/g, " ");
      const [firstName, ...lastNameParts] = fullName.split(" ");
      const lastName = lastNameParts.join(" ");
      
      const res = await fetch("https://amcollar.com/api/notification/veterinary/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName || fullName,
          last_name: lastName || "",
          phone_number: formData.phone,
          meeting_date_time: formData.datetime ? formData.datetime.toISOString() : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Submit failed");
      }

      setFormData({ fullName: "", phone: "", datetime: null });
      setErrors({});
      setTouched({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isFa
          ? "خطا در ارسال اطلاعات"
          : "Error while submitting the form"
      );
    } finally {
      setLoading(false);
    }
  };

  const isNameValid = nameSchema.safeParse(formData.fullName).success;
  const isPhoneValid = phoneSchema.safeParse(formData.phone).success;
  const isDateTimeValid = formData.datetime !== null && formData.datetime > new Date();

  return (
    <section dir={isFa ? "rtl" : "ltr"} className="py-32 px-6" style={{ background: `linear-gradient(180deg, ${brand.primarygreen}, ${brand.BackgroundDark})` }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
        <motion.div ref={textRef} initial="hidden" animate={textControls} variants={textVariants} className={isFa ? "text-right" : "text-left"}>
          <h1 className="text-[56px] md:text-[88px] font-bold text-white leading-tight">{t.title}</h1>
          <p className="mt-6 text-white/60 max-w-md text-sm md:text-base">{t.description}</p>
        </motion.div>

        <motion.form ref={formRef} initial="hidden" animate={formControls} variants={formVariants} onSubmit={handleSubmit} className="space-y-12">
          {/* Full Name */}
          <Field label={t.fields.fullName || (isFa ? "نام و نام خانوادگی" : "Full Name")}>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleFullNameChange(e.target.value)}
              onBlur={handleFullNameBlur}
              required
              disabled={loading}
              className={`w-full bg-transparent border-b pb-3 text-sm text-white focus:outline-none ${
                touched.fullName && errors.fullName
                  ? "border-red-400"
                  : touched.fullName && isNameValid
                  ? "border-green-400"
                  : "border-white/30"
              }`}
            />
            {touched.fullName && errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
          </Field>

          {/* Phone */}
          <Field label={t.fields.phone || (isFa ? "شماره تماس" : "Phone Number")}>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={handlePhoneBlur}
              required
              maxLength={11}
              disabled={loading}
              className={`w-full bg-transparent border-b pb-3 text-sm text-white focus:outline-none ${
                touched.phone && errors.phone
                  ? "border-red-400"
                  : touched.phone && isPhoneValid
                  ? "border-green-400"
                  : "border-white/30"
              }`}
            />
            {touched.phone && errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </Field>

          {/* Date */}
          <Field label={t.fields.datetime || (isFa ? "تاریخ و ساعت جلسه" : "Date & Time")}>
            <div className="relative border-b text-white border-white/30 pb-3">
              {isFa ? (
                <PersianDatePicker
                  ref={persianRef}
                  className="custom-persian-calendar"
                  value={formData.datetime}
                  onChange={(d) => handleDateTimeChange(d?.toDate?.() || null)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD HH:mm"
                  editable={false}
                  disabled={loading}
                  inputClass={`w-full text-white bg-transparent text-sm focus:outline-none ${
                    touched.datetime && errors.datetime ? "text-red-400" : ""
                  }`}
                />
              ) : (
                <DatePicker
                  ref={gregorianRef}
                  selected={formData.datetime}
                  onChange={(d: Date | null) => handleDateTimeChange(d)}
                  onBlur={handleDateTimeBlur}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="yyyy/MM/dd - HH:mm"
                  minDate={new Date()}
                  disabled={loading}
                  className={`w-full text-white bg-transparent text-sm focus:outline-none ${
                    touched.datetime && errors.datetime ? "text-red-400" : ""
                  }`}
                />
              )}
              <Calendar
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 cursor-pointer text-white ${isFa ? "left-3" : "right-3"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (loading) return;
                  isFa ? persianRef.current?.openCalendar?.() : gregorianRef.current?.setOpen?.(true);
                }}
              />
            </div>
            {touched.datetime && errors.datetime && <ErrorText>{errors.datetime}</ErrorText>}
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 text-sm tracking-widest text-white hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isFa ? "در حال ارسال..." : "Submitting...") : isFa ? "ارسال درخواست" : "Submit request"}
            {!loading && <span className="text-xl">→</span>}
          </button>

          {submitted && (
            <p className="text-sm text-[#D4AF37]">
              {isFa ? "درخواست با موفقیت ثبت شد. تیم ما در اولین فرصت با شما تماس خواهد گرفت." : "Request submitted successfully. Our team will contact you shortly."}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs tracking-widest text-white/60">{label}</label>
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-red-400 mt-1">{children}</p>;
}