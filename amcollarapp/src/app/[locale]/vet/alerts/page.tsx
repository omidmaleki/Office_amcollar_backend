"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AlertCircle, User, MessageSquare, Clock } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  message: string;
  priority: "critical" | "high" | "normal";
  source: "support" | "owner";
  petName?: string;
  timestamp: string;
  isRead: boolean;
}

interface AlertsData {
  alerts: Alert[];
  unreadCount: number;
  criticalUnreadCount: number;
}

export default function VetAlertsPage() {
  const t = useTranslations("vetAlerts");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
  const [loading, setLoading] = useState(true);

  // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
  // Mock data ONLY when NODE_ENV === "development"
  const getMockAlertsData = (): AlertsData => ({
    alerts: [
      {
        id: "alert-1",
        title: locale === "fa" ? "بحرانی: وضعیت اضطراری حیوان" : "Critical: Pet Emergency",
        message: locale === "fa" ? "حیوان 'نانا' علائم ناراحتی نشان می‌دهد. نیاز به توجه فوری دارد." : "Pet 'Nana' showing signs of distress. Immediate attention required.",
        priority: "critical",
        source: "owner",
        petName: "Nana",
        timestamp: "2024-01-15T10:30:00Z",
        isRead: false,
      },
      {
        id: "alert-new-pet",
        title: locale === "fa" ? "حیوان جدید اختصاص داده شد" : "New Pet Assigned",
        message: locale === "fa" ? "حیوان جدید اختصاص داده شد – پروفایل نیاز به تکمیل دارد" : "New pet assigned – profile needs completion",
        priority: "high",
        source: "support",
        petName: locale === "fa" ? "حیوان جدید" : "New Pet",
        timestamp: "2024-01-15T09:30:00Z",
        isRead: false,
      },
      {
        id: "alert-2",
        title: locale === "fa" ? "اولویت بالا: نتایج آزمایشگاه در دسترس است" : "High Priority: Lab Results Available",
        message: locale === "fa" ? "نتایج آزمایش برای حیوان 'ماکس' اکنون برای بررسی در دسترس است." : "Lab test results for pet 'Max' are now available for review.",
        priority: "high",
        source: "support",
        petName: "Max",
        timestamp: "2024-01-15T09:15:00Z",
        isRead: false,
      },
      {
        id: "alert-3",
        title: locale === "fa" ? "درخواست پشتیبانی" : "Support Request",
        message: locale === "fa" ? "تیکت پشتیبانی جدید نیاز به توجه شما دارد." : "New support ticket requires your attention.",
        priority: "normal",
        source: "support",
        timestamp: "2024-01-15T08:00:00Z",
        isRead: true,
      },
      {
        id: "alert-4",
        title: locale === "fa" ? "سوال مالک" : "Owner Question",
        message: locale === "fa" ? "مالک سوالی در مورد برنامه داروی حیوان دارد." : "Owner has a question about pet medication schedule.",
        priority: "normal",
        source: "owner",
        petName: "Bella",
        timestamp: "2024-01-14T16:45:00Z",
        isRead: true,
      },
    ],
    unreadCount: 3,
    criticalUnreadCount: 1,
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // TEMP MOCK DATA – REMOVE AFTER BACKEND INTEGRATION
        // Use mock data ONLY in development
        if (process.env.NODE_ENV === "development") {
          setAlertsData(getMockAlertsData());
        } else {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/vet/alerts');
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

  const handleAlertClick = async (alertId: string) => {
    // Mark alert as read
    if (alertsData) {
      const updatedAlerts = alertsData.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
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
      // await fetch(`/api/vet/alerts/${alertId}/read`, { method: 'POST' });
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

  const priorityOrder = { critical: 0, high: 1, normal: 2 };

  if (loading || !alertsData) {
    return (
      <div className="flex h-screen items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
              <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
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
            <p className="mt-4 text-gray-500">{t("noAlerts")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAlerts.map((alert) => {
              const styles = getPriorityStyles(alert.priority);
              const isUnread = !alert.isRead;

              return (
                <button
                  key={alert.id}
                  onClick={() => handleAlertClick(alert.id)}
                  className={`
                    w-full rounded-xl border-2 p-4 text-left transition-all hover:shadow-md
                    ${styles.border} ${styles.bg}
                    ${isUnread ? "opacity-100" : "opacity-70"}
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Priority Indicator */}
                    <div
                      className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${styles.badge}`}
                    />

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`text-lg font-semibold ${styles.text} ${
                            isUnread ? "" : "line-through"
                          }`}
                        >
                          {alert.title}
                        </h3>
                        {isUnread && (
                          <span className="flex-shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">
                            {t("new")}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-gray-700">{alert.message}</p>

                      {/* Metadata */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          {alert.source === "support" ? (
                            <MessageSquare size={14} />
                          ) : (
                            <User size={14} />
                          )}
                          <span>{t(`source${alert.source.charAt(0).toUpperCase() + alert.source.slice(1)}`)}</span>
                        </div>

                        {alert.petName && (
                          <div className="flex items-center gap-1">
                            <span>{t("relatedPet")}:</span>
                            <span className="font-medium">{alert.petName}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
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