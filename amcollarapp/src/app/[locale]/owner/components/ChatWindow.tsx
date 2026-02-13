"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "owner" | "other"; // "other" can be veterinarian or AI
  timestamp: Date;
}

interface ChatWindowProps {
  chatType: "veterinarian" | "ai";
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

export default function ChatWindow({
  chatType,
  messages = [],
  onSendMessage,
}: ChatWindowProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("support.chat");
  
  const [inputMessage, setInputMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatTitle = chatType === "veterinarian" ? t("veterinarian") : t("aiAssistant");
  const chatDescription = chatType === "veterinarian" ? t("getHelpFromVet") : t("askAI");
  const noMessagesText = chatType === "veterinarian" ? t("startConversationVet") : t("startConversationAI");
  const placeholderText = `${t("typeMessage")} ${chatTitle.toLowerCase()}`;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Sync with external messages prop
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "owner",
      timestamp: new Date(),
    };

    setLocalMessages([...localMessages, newMessage]);
    setInputMessage("");

    // TODO: Call backend API to send message
    // await fetch(`/api/support/chat/${chatType}`, {
    //   method: 'POST',
    //   body: JSON.stringify({ message: inputMessage })
    // });

    if (onSendMessage) {
      onSendMessage(inputMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(locale === "fa" ? "fa-IR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex h-[600px] flex-col rounded-2xl bg-white shadow-sm ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Chat Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
          {t("chatWith")} {chatTitle}
        </h3>
        <p className={`text-sm text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
          {chatDescription}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {localMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-4xl">
                {chatType === "veterinarian" ? "🐾" : "🤖"}
              </div>
              <p className={`text-sm text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                {t("noMessages")} {noMessagesText}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {localMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "owner" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === "owner"
                      ? "bg-[#0F5D4A] text-white"
                      : "bg-gray-100 text-gray-800"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.sender === "owner"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholderText}
            rows={2}
            dir={isRTL ? "rtl" : "ltr"}
            className={`flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20 ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="flex items-center justify-center rounded-xl bg-[#0F5D4A] px-4 py-2 text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}