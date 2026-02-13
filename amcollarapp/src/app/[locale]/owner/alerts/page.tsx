"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AlertCircle, User, MessageSquare, Clock, Shield } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  message: string;
  priority: "critical" | "high" | "normal";
  source: "support" | "system" | "vet";
  ticketId?: string; // For support-related alerts
  petName?: string; // For pet-related alerts
  timestamp: string;
  isRead: boolean;
}

interface AlertsData {
  alerts: Alert[];
  unreadCount: number;
  criticalUnreadCount: number;
}

export default function OwnerAlertsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("ownerAlerts");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
  const [loading, setLoading] = useState(true);

  // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
  // Mock data ONLY when NODE_ENV === "development"
  const MOCK_ALERTS_DATA: AlertsData = {
    alerts: [
      {
        id: "alert-1",
        title: locale === "fa" ? "هشدار: اتصال قلاده قطع شد" : "Critical: Collar Connection Lost",
        message: locale === "fa" 
          ? "اتصال قلاده حیوان خانگی شما قطع شده است. لطفاً وضعیت اتصال را بررسی کنید."
          : "Your pet's collar has lost connection. Please check the connection status.",
        priority: "critical",
        source: "system",
        petName: locale === "fa" ? "نانا" : "Nana",
        timestamp: "2024-01-15T10:30:00Z",
        isRead: false,
      },
      {
        id: "alert-2",
        title: locale === "fa" ? "پاسخ تیکت پشتیبانی" : "Support Ticket Reply",
        message: locale === "fa"
          ? "به تیکت پشتیبانی شما پاسخ داده شده است. لطفاً پیام‌های خود را بررسی کنید."
          : "Your support ticket has been replied to. Please check your messages.",
        priority: "high",
        source: "support",
        ticketId: "ticket-123",
        timestamp: "2024-01-15T09:15:00Z",
        isRead: false,
      },
      {
        id: "alert-3",
        title: locale === "fa" ? "پیام دامپزشک" : "Veterinarian Message",
        message: locale === "fa"
          ? "دامپزشک شما پیام مهمی درباره سلامت حیوان خانگی شما ارسال کرده است."
          : "Your veterinarian has sent you an important message about your pet's health.",
        priority: "high",
        source: "vet",
        petName: locale === "fa" ? "نانا" : "Nana",
        timestamp: "2024-01-15T08:30:00Z",
        isRead: false,
      },
      {
        id: "alert-4",
        title: locale === "fa" ? "به‌روزرسانی سیستم" : "System Update",
        message: locale === "fa"
          ? "ویژگی‌های جدیدی به داشبورد شما اضافه شده است. آن‌ها را بررسی کنید!"
          : "New features have been added to your dashboard. Check them out!",
        priority: "normal",
        source: "system",
        timestamp: "2024-01-14T16:45:00Z",
        isRead: true,
      },
      {
        id: "alert-5",
        title: locale === "fa" ? "تیکت پشتیبانی حل شد" : "Support Ticket Resolved",
        message: locale === "fa"
          ? "تیکت پشتیبانی شما حل شده است. از تماس با ما متشکریم."
          : "Your support ticket has been resolved. Thank you for contacting us.",
        priority: "normal",
        source: "support",
        ticketId: "ticket-456",
        timestamp: "2024-01-14T12:00:00Z",
        isRead: true,
      },
    ],
    unreadCount: 3,
    criticalUnreadCount: 1,
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
        // Use mock data ONLY in development
        if (process.env.NODE_ENV === "development") {
          setAlertsData(MOCK_ALERTS_DATA);
        } else {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/owner/alerts');
          // const data = await response.json();
          // setAlertsData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [locale]);

  const handleAlertClick = async (alert: Alert) => {
    // Mark alert as read
    if (alertsData) {
      const updatedAlerts = alertsData.alerts.map((a) =>
        a.id === alert.id ? { ...a, isRead: true } : a
      );

      const unreadCount = updatedAlerts.filter((a) => !a.isRead).length;
      const criticalUnreadCount = updatedAlerts.filter(
        (a) => !a.isRead && a.priority === "critical"
      ).length;

      setAlertsData({
        alerts: updatedAlerts,
        unreadCount,
        criticalUnreadCount,
      });

      // TODO: Update backend
      // await fetch(`/api/owner/alerts/${alert.id}/read`, { method: 'POST' });

      // Navigate based on alert source
      if (alert.source === "support" && alert.ticketId) {
        // Navigate to support page (ticket will be opened via URL param or state)
        router.push("/owner/support");
      }
      // For other alerts, just mark as read (could show details modal in future)
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return t("minutesAgo", { count: diffMins, s: diffMins > 1 ? "s" : "" });
    if (diffHours < 24) return t("hoursAgo", { count: diffHours, s: diffHours > 1 ? "s" : "" });
    if (diffDays < 7) return t("daysAgo", { count: diffDays, s: diffDays > 1 ? "s" : "" });
    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US");
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          border: "border-red-500",
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-500",
        };
      case "high":
        return {
          border: "border-orange-500",
          bg: "bg-orange-50",
          text: "text-orange-700",
          badge: "bg-orange-500",
        };
      default:
        return {
          border: "border-gray-300",
          bg: "bg-white",
          text: "text-gray-700",
          badge: "bg-gray-400",
        };
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "support":
        return MessageSquare;
      case "vet":
        return User;
      case "system":
        return Shield;
      default:
        return AlertCircle;
    }
  };

  const priorityOrder = { critical: 0, high: 1, normal: 2 };

  if (loading || !alertsData) {
    return (
      <div className={`flex h-screen items-center justify-center p-10 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  // Sort alerts by priority (critical > high > normal) and then by timestamp (newest first)
  const sortedAlerts = [...alertsData.alerts].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className={`min-h-screen bg-gray-50 p-5 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div>
              <h1 className={`text-2xl font-bold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("title")}</h1>
              <p className={`mt-2 text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>{t("subtitle")}</p>
            </div>
            {alertsData.unreadCount > 0 && (
              <div className="rounded-full bg-red-500 px-4 py-2">
                <span className="text-sm font-semibold text-white">
                  {alertsData.unreadCount} {t("unread")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Alerts List */}
        {sortedAlerts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400" />
            <p className={`mt-4 text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>{t("noAlerts")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAlerts.map((alert) => {
              const styles = getPriorityStyles(alert.priority);
              const isUnread = !alert.isRead;
              const SourceIcon = getSourceIcon(alert.source);

              return (
                <button
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`
                    w-full rounded-xl border-2 p-4 transition-all hover:shadow-md
                    ${styles.border} ${styles.bg}
                    ${isUnread ? "opacity-100" : "opacity-70"}
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    {/* Priority Indicator */}
                    <div
                      className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${styles.badge}`}
                    />

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-start justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <h3
                          className={`text-lg font-semibold ${styles.text} ${
                            isUnread ? "" : "line-through"
                          } ${isRTL ? "text-right" : "text-left"}`}
                        >
                          {alert.title}
                        </h3>
                        {isUnread && (
                          <span className="flex-shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">
                            {t("new")}
                          </span>
                        )}
                      </div>

                      <p className={`mt-2 text-sm text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>{alert.message}</p>

                      {/* Metadata */}
                      <div className={`mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <SourceIcon size={14} />
                          <span>{t(`source${alert.source.charAt(0).toUpperCase() + alert.source.slice(1)}`)}</span>
                        </div>

                        {alert.petName && (
                          <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span>{t("relatedPet")}:</span>
                            <span className="font-medium">{alert.petName}</span>
                          </div>
                        )}

                        {alert.ticketId && (
                          <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span>{t("ticketId")}:</span>
                            <span className="font-medium">{alert.ticketId}</span>
                          </div>
                        )}

                        <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Clock size={14} />
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}