"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import DashboardHeader from "../components/DashboardHeader";
import ConcentricActivityRings from "../components/ConcentricActivityRings";
import StatusIndicator from "../components/StatusIndicator";
import DailyPerformanceChart, {
  DailyPerformanceDataPoint,
} from "../components/DailyPerformanceChart";

// Types for dashboard data (from backend)
interface DashboardData {
  petName: string;
  isOnline: boolean;
  heartRate: number;
  burnedCalories: number; // percentage 0-100
  waterConsumption: number; // percentage 0-100
  foodConsumption: number; // percentage 0-100
  sleepHours: number;
  activeAlarms: number;
  bodyTemperature: number; // in Celsius
  dailyPerformance: DailyPerformanceDataPoint[]; // Array of hourly data points
}

export default function OwnerDashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual API call to fetch dashboard data
  useEffect(() => {
    // Simulate API call - replace with actual fetch
    const fetchDashboardData = async () => {
      try {
        // Example API call (uncomment when backend is ready):
        // const response = await fetch('/api/dashboard');
        // const dashboardData = await response.json();
        // setData(dashboardData);

        // Temporary: Set loading to false so UI renders
        // Remove this when implementing real API call
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`h-full p-10 flex items-center justify-center ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  // Default/fallback data structure (replace with actual backend data)
  // Use locale-aware pet name
  const dashboardData: DashboardData = data || {
    petName: locale === "fa" ? "نانا" : "Nana",
    isOnline: true,
    heartRate: 80,
    burnedCalories: 0,
    waterConsumption: 0,
    foodConsumption: 0,
    sleepHours: 0,
    activeAlarms: 0,
    bodyTemperature: 0,
    // TODO: Replace with actual backend data
    // Temporary sample data for testing - remove when backend is connected
    dailyPerformance: [
      { time: "00:00", sleep: 8, activity: 5, heartRate: 60, water: 0, food: 0 },
      { time: "04:00", sleep: 7, activity: 3, heartRate: 58, water: 0, food: 0 },
      { time: "08:00", sleep: 0, activity: 25, heartRate: 75, water: 150, food: 50 },
      { time: "12:00", sleep: 0, activity: 45, heartRate: 85, water: 200, food: 100 },
      { time: "16:00", sleep: 0, activity: 35, heartRate: 80, water: 180, food: 80 },
      { time: "20:00", sleep: 1, activity: 20, heartRate: 70, water: 100, food: 60 },
      { time: "24:00", sleep: 6, activity: 10, heartRate: 65, water: 50, food: 0 },
    ],
  };

  return (
    <div className={`min-h-full w-full bg-gray-50 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full md:mx-auto md:max-w-6xl space-y-4 md:space-y-6 py-4 md:py-6 px-0 md:px-6">
        {/* Header Section */}
        <DashboardHeader
          petName={dashboardData.petName}
          isOnline={dashboardData.isOnline}
          heartRate={dashboardData.heartRate}
        />

        {/* Center Section - Activity Rings with Animation Placeholder */}
        <div className="rounded-2xl bg-white p-4 md:p-6 lg:p-8 shadow-sm mx-4 md:mx-0">
          {/* Concentric Activity Rings - Apple Watch Style */}
          {/* Animation placeholder is integrated at the center of the rings */}
          {/* Rings are horizontally centered, labels are below */}
          <ConcentricActivityRings
            burnedCalories={dashboardData.burnedCalories}
            waterConsumption={dashboardData.waterConsumption}
            foodConsumption={dashboardData.foodConsumption}
          />
        </div>

        {/* Status Indicators Row */}
        <div className="grid grid-cols-3 gap-4 px-4 md:px-0">
          <StatusIndicator
            icon="moon"
            value={dashboardData.sleepHours}
            label={t("sleepHours")}
            unit="h"
          />
          <StatusIndicator
            icon="bell"
            value={dashboardData.activeAlarms}
            label={t("activeAlarms")}
          />
          <StatusIndicator
            icon="thermometer"
            value={dashboardData.bodyTemperature}
            label={t("bodyTemperature")}
            unit="°C"
          />
        </div>

        {/* Bottom Section - Daily Performance Chart */}
        <div className="px-4 md:px-0 pb-4 md:pb-0">
          <DailyPerformanceChart data={dashboardData.dailyPerformance} />
        </div>
      </div>
    </div>
  );
}