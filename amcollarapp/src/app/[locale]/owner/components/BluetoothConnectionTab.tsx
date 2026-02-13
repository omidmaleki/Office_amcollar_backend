"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bluetooth, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface BluetoothConnectionTabProps {
  onConnect?: (deviceId: string) => void;
  onDisconnect?: () => void;
  onPair?: (deviceId: string) => void;
}

export default function BluetoothConnectionTab({
  onConnect,
  onDisconnect,
  onPair,
}: BluetoothConnectionTabProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("connection.bluetooth");

  const [status, setStatus] = useState<
    "idle" | "searching" | "connected" | "error"
  >("idle");
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deviceRef = useRef<any | null>(null);

  const handleSearchAndConnect = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.bluetooth) {
        throw new Error(
          locale === "fa"
            ? "بلوتوث پشتیبانی نمی‌شود"
            : "Bluetooth not supported"
        );
      }

      // ✅ Must be immediately after click: opens browser popup
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });

      setStatus("searching");
      setError(null);

      deviceRef.current = device;
      await device.gatt?.connect();

      setDeviceName(
        device.name || (locale === "fa" ? "دستگاه ناشناس" : "Unknown device")
      );
      setStatus("connected");

      if (device.id) {
        onConnect?.(device.id);
        onPair?.(device.id);
      }

      device.addEventListener("gattserverdisconnected", () => {
        setStatus("idle");
        setDeviceName(null);
        deviceRef.current = null;
        onDisconnect?.();
      });
    } catch (err: any) {
      if (err?.name !== "NotFoundError") {
        setError(
          err?.message ||
            (locale === "fa" ? "اتصال ناموفق بود" : "Connection failed")
        );
        setStatus("error");
      } else {
        setStatus("idle");
      }
    }
  };

  const handleDisconnect = () => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    setStatus("idle");
    setDeviceName(null);
    deviceRef.current = null;
    onDisconnect?.();
  };

  return (
    <div
      className={`rounded-2xl bg-white p-6 space-y-4 ${
        isRTL ? "font-fa" : "font-en"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex items-center gap-2 text-gray-800 font-semibold ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <Bluetooth size={20} />
        {t("title")}
      </div>

      <p
        className={`text-sm text-gray-600 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("description")}
      </p>

      {status === "connected" && (
        <div
          className={`flex items-center gap-2 text-green-600 text-sm ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <CheckCircle2 size={18} />
          {t("connected")} {deviceName}
        </div>
      )}

      {error && (
        <div
          className={`flex items-center gap-2 text-red-600 text-sm ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {status === "connected" ? (
          <button
            onClick={handleDisconnect}
            className="w-full rounded-xl bg-red-600 py-3 text-white hover:bg-red-700"
          >
            {t("disconnect")}
          </button>
        ) : (
          <button
            onClick={handleSearchAndConnect}
            disabled={status === "searching"}
            className="w-full rounded-xl bg-[#0F5D4A] py-3 text-white disabled:opacity-50"
          >
            {status === "searching" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {t("scanning")}
              </span>
            ) : (
              t("scanDevices")
            )}
          </button>
        )}
      </div>
    </div>
  );
}
