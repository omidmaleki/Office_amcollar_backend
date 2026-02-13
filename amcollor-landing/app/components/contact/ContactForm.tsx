"use client";

import { useState } from "react";
import { brand } from "../../lib/brand";
import {
  nameSchema,
  formatNameInput,
  getErrorMessage,
} from "@/app/lib/validators";

type Props = {
  locale: "fa" | "en";
};

export default function ContactForm({ locale }: Props) {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string | null;
    subject?: string | null;
    message?: string | null;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    subject?: boolean;
    message?: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFa = locale === "fa";

  const handleNameChange = (value: string) => {
    const formatted = formatNameInput(value);
    setForm({ ...form, name: formatted });
    setTouched({ ...touched, name: true });
    
    const result = nameSchema.safeParse(formatted);
    setErrors({ 
      ...errors, 
      name: result.success ? null : getErrorMessage(result.error, locale) 
    });
  };

  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    const result = nameSchema.safeParse(form.name);
    setErrors({ 
      ...errors, 
      name: result.success ? null : getErrorMessage(result.error, locale) 
    });
  };

  const handleSubjectChange = (value: string) => {
    const trimmed = value.trim();
    setForm({ ...form, subject: trimmed });
    setTouched({ ...touched, subject: true });
    
    if (!trimmed) {
      setErrors({ 
        ...errors, 
        subject: isFa ? "موضوع الزامی است" : "Subject is required" 
      });
    } else if (trimmed.length < 3) {
      setErrors({ 
        ...errors, 
        subject: isFa ? "موضوع باید حداقل 3 کاراکتر باشد" : "Subject must be at least 3 characters" 
      });
    } else {
      setErrors({ ...errors, subject: null });
    }
  };

  const handleSubjectBlur = () => {
    setTouched({ ...touched, subject: true });
    const trimmed = form.subject.trim();
    if (!trimmed) {
      setErrors({ 
        ...errors, 
        subject: isFa ? "موضوع الزامی است" : "Subject is required" 
      });
    } else if (trimmed.length < 3) {
      setErrors({ 
        ...errors, 
        subject: isFa ? "موضوع باید حداقل 3 کاراکتر باشد" : "Subject must be at least 3 characters" 
      });
    } else {
      setErrors({ ...errors, subject: null });
    }
  };

  const handleMessageChange = (value: string) => {
    const trimmed = value.trim();
    setForm({ ...form, message: trimmed });
    setTouched({ ...touched, message: true });
    
    if (!trimmed) {
      setErrors({ 
        ...errors, 
        message: isFa ? "پیام الزامی است" : "Message is required" 
      });
    } else if (trimmed.length < 10) {
      setErrors({ 
        ...errors, 
        message: isFa ? "پیام باید حداقل 10 کاراکتر باشد" : "Message must be at least 10 characters" 
      });
    } else {
      setErrors({ ...errors, message: null });
    }
  };

  const handleMessageBlur = () => {
    setTouched({ ...touched, message: true });
    const trimmed = form.message.trim();
    if (!trimmed) {
      setErrors({ 
        ...errors, 
        message: isFa ? "پیام الزامی است" : "Message is required" 
      });
    } else if (trimmed.length < 10) {
      setErrors({ 
        ...errors, 
        message: isFa ? "پیام باید حداقل 10 کاراکتر باشد" : "Message must be at least 10 characters" 
      });
    } else {
      setErrors({ ...errors, message: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, subject: true, message: true });
    setError(null);

    // Validate all fields
    const nameResult = nameSchema.safeParse(form.name);
    const trimmedSubject = form.subject.trim();
    const trimmedMessage = form.message.trim();
    
    const newErrors: typeof errors = {};
    
    if (!nameResult.success) {
      newErrors.name = getErrorMessage(nameResult.error, locale);
    }
    
    if (!trimmedSubject) {
      newErrors.subject = isFa ? "موضوع الزامی است" : "Subject is required";
    } else if (trimmedSubject.length < 3) {
      newErrors.subject = isFa ? "موضوع باید حداقل 3 کاراکتر باشد" : "Subject must be at least 3 characters";
    }
    
    if (!trimmedMessage) {
      newErrors.message = isFa ? "پیام الزامی است" : "Message is required";
    } else if (trimmedMessage.length < 10) {
      newErrors.message = isFa ? "پیام باید حداقل 10 کاراکتر باشد" : "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err !== null)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://amcollar.com/api/notification/contactus/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedSubject,
          name: form.name.trim(),
          description: trimmedMessage,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Submit failed");
      }

      setForm({ name: "", subject: "", message: "" });
      setErrors({});
      setTouched({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isFa
          ? "خطا در ارسال پیام"
          : "Error while submitting the message"
      );
    } finally {
      setLoading(false);
    }
  };

  const isNameValid = nameSchema.safeParse(form.name).success;
  const isSubjectValid = form.subject.trim().length >= 3;
  const isMessageValid = form.message.trim().length >= 10;

  return (
    <section
      dir={isFa ? "rtl" : "ltr"}
      className="relative max-w-3xl mx-auto my-24 px-6"
    >
      {/* عنوان */}
      <div className="text-center mb-10">
        <p className="mt-3 text-white/60 text-sm md:text-base">
          {isFa
            ? "پیام خود را برای ما ارسال کنید، در اسرع وقت پاسخ می‌دهیم."
            : "Send us your message and we will get back to you shortly."}
        </p>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 space-y-7 shadow-xl">
        {/* Name */}
        <div>
          <label className="block text-sm mb-2 text-white/70">
            {isFa ? "نام" : "Name"}
          </label>
          <input
            className={`w-full rounded-2xl bg-black/30 border px-5 py-3 text-white placeholder-white/70
                       focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                         touched.name && errors.name
                           ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                           : touched.name && isNameValid
                           ? "border-green-400 focus:ring-green-400 focus:border-green-400"
                           : "border-white/15 focus:ring-yellow-500 focus:border-yellow-500"
                       }`}
            placeholder={isFa ? "نام خود را وارد کنید" : "Enter your name"}
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            disabled={loading}
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm mb-2 text-white/70">
            {isFa ? "موضوع" : "Subject"}
          </label>
          <input
            className={`w-full rounded-2xl bg-black/30 border px-5 py-3 text-white placeholder-white/70
                       focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                         touched.subject && errors.subject
                           ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                           : touched.subject && isSubjectValid
                           ? "border-green-400 focus:ring-green-400 focus:border-green-400"
                           : "border-white/15 focus:ring-yellow-500 focus:border-yellow-500"
                       }`}
            placeholder={isFa ? "موضوع پیام" : "Message subject"}
            value={form.subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            onBlur={handleSubjectBlur}
            disabled={loading}
          />
          {touched.subject && errors.subject && (
            <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm mb-2 text-white/70">
            {isFa ? "پیام" : "Message"}
          </label>
          <textarea
            rows={6}
            className={`w-full rounded-2xl bg-black/30 border px-5 py-4 text-white placeholder-white/70
                       focus:outline-none focus:ring-2 transition resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                         touched.message && errors.message
                           ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                           : touched.message && isMessageValid
                           ? "border-green-400 focus:ring-green-400 focus:border-green-400"
                           : "border-white/15 focus:ring-yellow-500 focus:border-yellow-500"
                       }`}
            placeholder={
              isFa ? "پیام خود را اینجا بنویسید..." : "Write your message here..."
            }
            value={form.message}
            onChange={(e) => handleMessageChange(e.target.value)}
            onBlur={handleMessageBlur}
            disabled={loading}
          />
          {touched.message && errors.message && (
            <p className="mt-1 text-sm text-red-400">{errors.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full font-bold tracking-wide transition
                     hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #d4af37, #f5d76e)",
            color: "#ffffff",
          }}
        >
          {loading
            ? isFa
              ? "در حال ارسال..."
              : "Submitting..."
            : isFa
            ? "ارسال پیام"
            : "Send Message"}
        </button>

        {submitted && (
          <p className="text-sm text-[#D4AF37] text-center">
            {isFa
              ? "پیام شما با موفقیت ارسال شد. در اسرع وقت پاسخ خواهیم داد."
              : "Your message has been sent successfully. We will respond shortly."}
          </p>
        )}
      </form>
    </section>
  );
}