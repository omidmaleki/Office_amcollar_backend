"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Send, MessageCircle, CheckCircle2 } from "lucide-react";

interface TicketFormProps {
  onSubmit?: (subject: string, message: string) => void;
  onContactSupport?: () => void;
  onChatWithAI?: () => void;
}

export default function TicketForm({
  onSubmit,
  onContactSupport,
  onChatWithAI,
}: TicketFormProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("support.ticket");
  
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      // TODO: Call backend API to submit ticket
      // await fetch('/api/support/tickets', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ subject, message }) 
      // });
      
      if (onSubmit) {
        onSubmit(subject, message);
      }
      
      // Reset form
      setSubject("");
      setMessage("");
      
      // Show success message
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to submit ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Success Message */}
      {showSuccess && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
            <p className={`text-sm text-green-800 ${isRTL ? "text-right" : "text-left"}`}>
              {t("ticketSubmitted")}
            </p>
          </div>
        </div>
      )}

      {/* Ticket Submission Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className={`mb-4 text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
          {t("createTicket")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Input */}
          <div>
            <label
              htmlFor="subject"
              className={`mb-2 block text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("subject")} <span className="text-red-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder={t("subject")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20 ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label
              htmlFor="message"
              className={`mb-2 block text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("message")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder={t("describeIssue")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20 resize-none ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !message.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F5D4A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span>{isSubmitting ? t("submitting") : t("submitTicket")}</span>
          </button>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Contact Support Button - Fixed at bottom */}
        <button
          onClick={onContactSupport}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#0F5D4A] bg-white px-6 py-3 font-medium text-[#0F5D4A] transition-colors hover:bg-[#0F5D4A] hover:text-white"
        >
          <MessageCircle size={18} />
          <span>{t("contactSupport")}</span>
        </button>

        {/* Chat with AI Shortcut */}
        <button
          onClick={onChatWithAI}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <MessageCircle size={18} />
          <span>{t("chatWithAI")}</span>
        </button>
      </div>
    </div>
  );
}