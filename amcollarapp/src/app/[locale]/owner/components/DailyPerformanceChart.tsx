"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface DailyPerformanceDataPoint {
  time: string; // e.g., "00:00", "01:00", etc.
  sleep: number; // Sleep metric value (hours)
  activity: number; // Activity/Movement metric value
  heartRate: number; // Heart rate (bpm)
  water: number; // Water intake value (ml)
  food: number; // Food intake value (g)
}

interface DailyPerformanceChartProps {
  data: DailyPerformanceDataPoint[]; // Array of data points for the day
}

export default function DailyPerformanceChart({
  data,
}: DailyPerformanceChartProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  if (!data || data.length === 0) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-xl bg-white p-8 shadow-sm ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
        <p className={`text-sm text-gray-400 ${isRTL ? "text-right" : "text-left"}`}>
          {tCommon("noRecords")}
        </p>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`rounded-lg border border-gray-200 bg-white p-3 shadow-lg ${isRTL ? "font-fa text-right" : "font-en text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
          <p className={`mb-2 text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
            {payload[0].payload.time}
          </p>
          {payload.map((entry: any, index: number) => {
            let unit = "";
            let label = entry.name;
            
            if (entry.dataKey === "heartRate") {
              unit = "";
              label = t("heartRateChart");
            } else if (entry.dataKey === "sleep") {
              unit = locale === "fa" ? " ساعت" : " hrs";
              label = t("sleep");
            } else if (entry.dataKey === "water") {
              unit = " ml";
              label = t("waterChart");
            } else if (entry.dataKey === "food") {
              unit = " g";
              label = t("foodChart");
            } else if (entry.dataKey === "activity") {
              unit = "";
              label = t("activityChart");
            }
            
            return (
              <p
                key={index}
                className={`text-xs ${isRTL ? "text-right" : "text-left"}`}
                style={{ color: entry.color }}
              >
                {label}: {entry.value}{unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full rounded-xl bg-white p-4 shadow-sm sm:p-6 ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
      <h3 className={`mb-4 text-sm font-semibold text-gray-700 sm:text-base ${isRTL ? "text-right" : "text-left"}`}>
        {t("dailyPerformance")}
      </h3>
      
      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          {/* Minimal grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          
          {/* X-axis - Time */}
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          
          {/* Y-axis */}
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Legend */}
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
            formatter={(value) => {
              // Map English names to translated names
              const nameMap: Record<string, string> = {
                "Sleep": t("sleep"),
                "Activity": t("activityChart"),
                "Heart Rate": t("heartRateChart"),
                "Water": t("waterChart"),
                "Food": t("foodChart"),
              };
              return (
                <span className={`text-xs text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
                  {nameMap[value] || value}
                </span>
              );
            }}
          />
          
          {/* Sleep Line - Smooth monotone curve */}
          <Line
            type="monotone"
            dataKey="sleep"
            name={t("sleep")}
            stroke="#6366f1"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 5 }}
            connectNulls
          />
          
          {/* Activity/Movement Line - Smooth monotone curve */}
          <Line
            type="monotone"
            dataKey="activity"
            name={t("activityChart")}
            stroke="#D4AF37"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 5 }}
            connectNulls
          />
          
          {/* Heart Rate Line - Smooth monotone curve */}
          <Line
            type="monotone"
            dataKey="heartRate"
            name={t("heartRateChart")}
            stroke="#ef4444"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 5 }}
            connectNulls
          />
          
          {/* Water Intake Line - Smooth monotone curve */}
          <Line
            type="monotone"
            dataKey="water"
            name={t("waterChart")}
            stroke="#0F5D4A"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 5 }}
            connectNulls
          />
          
          {/* Food Intake Line - Smooth monotone curve */}
          <Line
            type="monotone"
            dataKey="food"
            name={t("foodChart")}
            stroke="#10b981"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 5 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}