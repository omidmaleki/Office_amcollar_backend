"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ConnectionTabs from "../components/ConnectionTabs";
import WiFiConnectionTab from "../components/WiFiConnectionTab";
import BluetoothConnectionTab from "../components/BluetoothConnectionTab";
import CellularConnectionTab from "../components/CellularConnectionTab";
import { AlertTriangle } from "lucide-react";

type TabId = "wifi" | "bluetooth" | "cellular";

interface ConnectionStatus {
  wifi: boolean;
  bluetooth: boolean;
  cellular: boolean;
  lastSeen?: Date;
}

export default function OwnerConnectionPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("connection");
  const tCommon = useTranslations("common");
  const [activeTab, setActiveTab] = useState<TabId>("bluetooth");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    wifi: false,
    bluetooth: false,
    cellular: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: "wifi" as TabId, label: t("tabs.wifi") },
    { id: "bluetooth" as TabId, label: t("tabs.bluetooth") },
    { id: "cellular" as TabId, label: t("tabs.cellular") },
  ];

  useEffect(() => {
    // TODO: Fetch connection status from backend
    const fetchConnectionStatus = async () => {
      try {
        // const response = await fetch('/api/collar/connection/status');
        // const data = await response.json();
        // setConnectionStatus(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch connection status:", error);
        setIsLoading(false);
      }
    };

    fetchConnectionStatus();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  const hasAnyConnection =
    connectionStatus.wifi ||
    connectionStatus.bluetooth ||
    connectionStatus.cellular;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("title")}</h1>
          <div className={`mt-2 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  hasAnyConnection ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {hasAnyConnection ? tCommon("connected") : tCommon("disconnected")}
              </span>
            </div>
            {connectionStatus.lastSeen && (
              <span className="text-xs text-gray-500">
                {t("lastSeen")}: {new Date(connectionStatus.lastSeen).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </span>
            )}
          </div>
        </div>

        {/* Warning if all disconnected */}
        {!hasAnyConnection && (
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
            <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className={`font-semibold text-yellow-800 mb-1 ${isRTL ? "text-right" : "text-left"}`}>
                  {t("noActiveConnection")}
                </p>
                <p className={`text-sm text-yellow-700 ${isRTL ? "text-right" : "text-left"}`}>
                  {t("noActiveConnectionDesc")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <ConnectionTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "wifi" && (
            <WiFiConnectionTab
              onConnect={(ssid, password) => {
                console.log("WiFi connect:", { ssid, password });
                setConnectionStatus((prev) => ({ ...prev, wifi: true }));
              }}
              onDisconnect={() => {
                console.log("WiFi disconnect");
                setConnectionStatus((prev) => ({ ...prev, wifi: false }));
              }}
            />
          )}

          {activeTab === "bluetooth" && (
            <BluetoothConnectionTab
              onConnect={(deviceId) => {
                console.log("Bluetooth connect:", deviceId);
                setConnectionStatus((prev) => ({ ...prev, bluetooth: true }));
              }}
              onDisconnect={() => {
                console.log("Bluetooth disconnect");
                setConnectionStatus((prev) => ({ ...prev, bluetooth: false }));
              }}
              onPair={(deviceId) => {
                console.log("Bluetooth pair:", deviceId);
              }}
            />
          )}

          {activeTab === "cellular" && (
            <CellularConnectionTab
              onToggle={(enabled) => {
                console.log("Cellular toggle:", enabled);
                setConnectionStatus((prev) => ({ ...prev, cellular: enabled }));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}