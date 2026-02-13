"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Phone } from "lucide-react";

export default function VetSupportPage() {
  const t = useTranslations("support.ticket");
  const tCommon = useTranslations("common");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!title.trim()) {
      setError(tCommon("required"));
      return;
    }

    if (!message.trim()) {
      setError(tCommon("required"));
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/vet/support/ticket', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title: title.trim(), message: message.trim() })
      // });
      // if (!response.ok) throw new Error('Failed to submit ticket');

      // Mock success for development
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - clear form and show message
      setTitle("");
      setMessage("");
      setSuccess(true);
    } catch (e) {
      console.error("Failed to submit ticket:", e);
      setError(
        e instanceof Error ? e.message : tCommon("submit") + " failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    // TODO: Implement direct contact logic
    console.log("Contact support clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("createTicket")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t("describeIssue")}
          </p>
        </div>

        {/* Ticket Form Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ticket Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("subject")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("subject")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
                required
              />
            </div>

            {/* Ticket Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("message")} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("describeIssue")}
                rows={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-xl bg-green-50 p-3">
                <p className="text-sm text-green-600">
                  {t("ticketSubmitted")}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#D4AF37] py-3 font-medium text-white transition hover:bg-[#0b4a3a] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? t("submitting") : t("submitTicket")}
            </button>
          </form>

          {/* Contact Support Button */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              onClick={handleContactSupport}
              className="w-full rounded-xl bg-gray-100 py-4 font-medium text-gray-800 transition hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              {t("contactSupport")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
