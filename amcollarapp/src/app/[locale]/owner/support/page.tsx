"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import SupportTabs from "../components/SupportTabs";
import TicketForm from "../components/TicketForm";
import ChatWindow from "../components/ChatWindow";

type TabId = "support-team" | "chat-vet" | "chat-ai";

export default function OwnerSupportPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("support");
  const [activeTab, setActiveTab] = useState<TabId>("support-team");

  const tabs = [
    { id: "support-team" as TabId, label: t("tabs.supportTeam") },
    { id: "chat-vet" as TabId, label: t("tabs.chatVet") },
    { id: "chat-ai" as TabId, label: t("tabs.chatAI") },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  const handleTicketSubmit = (subject: string, message: string) => {
    // TODO: Implement ticket submission logic
    console.log("Ticket submitted:", { subject, message });
  };

  const handleContactSupport = () => {
    // TODO: Implement direct support contact logic
    console.log("Contact support clicked");
  };

  const handleChatWithAI = () => {
    // Switch to AI chat tab
    setActiveTab("chat-ai");
  };

  const handleSendVetMessage = (message: string) => {
    // TODO: Implement veterinarian message sending logic
    console.log("Vet message sent:", message);
  };

  const handleSendAIMessage = (message: string) => {
    // TODO: Implement AI message sending logic
    console.log("AI message sent:", message);
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("title")}</h1>
        </div>

        {/* Tabs */}
        <SupportTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "support-team" && (
            <TicketForm
              onSubmit={handleTicketSubmit}
              onContactSupport={handleContactSupport}
              onChatWithAI={handleChatWithAI}
            />
          )}

          {activeTab === "chat-vet" && (
            <ChatWindow
              chatType="veterinarian"
              onSendMessage={handleSendVetMessage}
            />
          )}

          {activeTab === "chat-ai" && (
            <ChatWindow chatType="ai" onSendMessage={handleSendAIMessage} />
          )}
        </div>
      </div>
    </div>
  );
}