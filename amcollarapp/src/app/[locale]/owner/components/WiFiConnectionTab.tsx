"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Wifi, Lock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface WiFiNetwork {
  id: string;
  ssid: string;
  signalStrength: number; // 0-100
  isSecured: boolean;
  isConnected: boolean;
}

interface WiFiConnectionTabProps {
  onConnect?: (ssid: string, password: string) => void;
  onDisconnect?: () => void;
}

export default function WiFiConnectionTab({
  onConnect,
  onDisconnect,
}: WiFiConnectionTabProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("connection.wifi");
  const tCommon = useTranslations("common");
  
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [password, setPassword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState<WiFiNetwork | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock Wi-Fi networks (since Web Wi-Fi API doesn't exist in browsers)
  const mockNetworks: WiFiNetwork[] = [
    { id: "1", ssid: "HomeWiFi", signalStrength: 85, isSecured: true, isConnected: false },
    { id: "2", ssid: "Office_Network", signalStrength: 72, isSecured: true, isConnected: false },
    { id: "3", ssid: "PublicWiFi", signalStrength: 45, isSecured: false, isConnected: false },
    { id: "4", ssid: "Neighbor_5G", signalStrength: 60, isSecured: true, isConnected: false },
    { id: "5", ssid: "GuestNetwork", signalStrength: 30, isSecured: true, isConnected: false },
  ];

  useEffect(() => {
    // In production, fetch from backend API
    // For now, we'll use mock data
    const fetchNetworks = async () => {
      try {
        // Simulate API call
        // const response = await fetch('/api/collar/wifi/networks');
        // const data = await response.json();
        // setNetworks(data.networks);
        // setConnectedNetwork(data.connectedNetwork);
        
        // Mock: Check if any network is connected
        const connected = mockNetworks.find(n => n.isConnected);
        if (connected) {
          setConnectedNetwork(connected);
        }
      } catch (err) {
        console.error("Failed to fetch networks:", err);
      }
    };

    fetchNetworks();
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);

    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, call backend API
      // const response = await fetch('/api/collar/wifi/scan', { method: 'POST' });
      // const data = await response.json();
      // setNetworks(data.networks);

      // Mock: Return networks with randomized signal strength
      const scannedNetworks = mockNetworks.map(network => ({
        ...network,
        signalStrength: Math.floor(Math.random() * 100),
      }));

      // Sort by signal strength (strongest first)
      scannedNetworks.sort((a, b) => b.signalStrength - a.signalStrength);

      setNetworks(scannedNetworks);
    } catch (err: any) {
      console.error("Scan error:", err);
      setError(err.message || t("scanning") + " failed");
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedNetwork) return;

    if (selectedNetwork.isSecured && !password.trim()) {
      setError(locale === "fa" ? "رمز عبور برای شبکه‌های محافظت شده الزامی است." : "Password is required for secured networks.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, call backend API
      // const response = await fetch('/api/collar/wifi/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     ssid: selectedNetwork.ssid, 
      //     password: selectedNetwork.isSecured ? password : undefined 
      //   })
      // });
      // const data = await response.json();

      // Mock: Simulate successful connection
      const connected = { ...selectedNetwork, isConnected: true };
      setConnectedNetwork(connected);
      setNetworks(prev =>
        prev.map(n =>
          n.id === selectedNetwork.id
            ? { ...n, isConnected: true }
            : { ...n, isConnected: false }
        )
      );

      if (onConnect) {
        onConnect(selectedNetwork.ssid, password);
      }

      setPassword("");
      setSelectedNetwork(null);
    } catch (err: any) {
      console.error("Connect error:", err);
      setError(err.message || (locale === "fa" ? "اتصال به شبکه ناموفق بود. لطفاً رمز عبور را بررسی کنید و دوباره تلاش کنید." : "Failed to connect to network. Please check your password and try again."));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, call backend API
      // await fetch('/api/collar/wifi/disconnect', { method: 'POST' });

      setConnectedNetwork(null);
      setSelectedNetwork(null);
      setNetworks(prev =>
        prev.map(n => ({ ...n, isConnected: false }))
      );

      if (onDisconnect) {
        onDisconnect();
      }
    } catch (err: any) {
      console.error("Disconnect error:", err);
      setError(err.message || (locale === "fa" ? "قطع اتصال از شبکه ناموفق بود." : "Failed to disconnect from network."));
    } finally {
      setIsConnecting(false);
    }
  };

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 70) return "bg-green-500";
    if (strength >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSignalStrengthBars = (strength: number) => {
    return Math.ceil(strength / 25);
  };

  return (
    <div className={`space-y-6 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Error Message */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
          <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div className="flex-1">
              <p className={`font-semibold text-red-800 mb-1 ${isRTL ? "text-right" : "text-left"}`}>
                {locale === "fa" ? "خطا" : "Error"}
              </p>
              <p className={`text-sm text-red-700 ${isRTL ? "text-right" : "text-left"}`}>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {connectedNetwork ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CheckCircle2 className="text-green-600" size={24} />
              <div>
                <p className={`font-semibold text-green-800 ${isRTL ? "text-right" : "text-left"}`}>{t("connected")}</p>
                <p className={`text-sm text-green-600 ${isRTL ? "text-right" : "text-left"}`}>{connectedNetwork.ssid}</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={isConnecting}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {t("disconnect")}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <XCircle className="text-gray-400" size={24} />
            <div>
              <p className={`font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("disconnected")}</p>
              <p className={`text-sm text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>{t("noNetworks")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Scan Button */}
      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 rounded-xl bg-[#0F5D4A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            size={18}
            className={isScanning ? "animate-spin" : ""}
          />
          <span>{isScanning ? t("scanning") : t("scanNetworks")}</span>
        </button>
      </div>

      {/* Networks List */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className={`font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>{t("availableNetworks")}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {networks.length === 0 ? (
            <div className="p-8 text-center">
              <Wifi className="mx-auto mb-2 text-gray-400" size={32} />
              <p className={`text-sm text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                {t("noNetworks")}
              </p>
            </div>
          ) : (
            networks.map((network) => (
              <button
                key={network.id}
                onClick={() => !network.isConnected && setSelectedNetwork(network)}
                disabled={network.isConnected}
                className={`w-full p-4 transition-colors ${
                  network.isConnected
                    ? "bg-green-50 cursor-default"
                    : selectedNetwork?.id === network.id
                    ? "bg-[#0F5D4A]/5 hover:bg-[#0F5D4A]/10"
                    : "hover:bg-gray-50"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Wifi
                      size={20}
                      className={
                        network.isConnected
                          ? "text-[#0F5D4A]"
                          : "text-gray-400"
                      }
                    />
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <p className="font-medium text-gray-800">
                          {network.ssid}
                        </p>
                        {network.isConnected && (
                          <CheckCircle2
                            size={16}
                            className="text-[#0F5D4A]"
                          />
                        )}
                        {network.isSecured && (
                          <Lock size={14} className="text-gray-400" />
                        )}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={`h-1 w-1.5 rounded-full ${
                                bar <= getSignalStrengthBars(network.signalStrength)
                                  ? getSignalStrengthColor(network.signalStrength)
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {network.signalStrength}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Password Input & Connect Button */}
      {selectedNetwork && selectedNetwork.isSecured && !connectedNetwork && (
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className={`mb-2 block text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
              {t("passwordFor")} "{selectedNetwork.ssid}"
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("enterPassword")}
              dir={isRTL ? "rtl" : "ltr"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && password.trim()) {
                  handleConnect();
                }
              }}
              className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-[#0F5D4A] focus:outline-none focus:ring-2 focus:ring-[#0F5D4A]/20 ${isRTL ? "text-right placeholder:text-right" : "text-left placeholder:text-left"}`}
            />
          </div>
          <button
            onClick={handleConnect}
            disabled={isConnecting || !password.trim()}
            className="w-full rounded-xl bg-[#0F5D4A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? t("connecting") : t("connect")}
          </button>
        </div>
      )}

      {selectedNetwork && !selectedNetwork.isSecured && !connectedNetwork && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full rounded-xl bg-[#0F5D4A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0b1f1a] disabled:opacity-50"
          >
            {isConnecting ? t("connecting") : t("connectOpenNetwork")}
          </button>
        </div>
      )}
    </div>
  );
}