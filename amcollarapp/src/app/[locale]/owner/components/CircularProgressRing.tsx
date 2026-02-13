"use client";

import { useEffect, useState } from "react";

interface CircularProgressRingProps {
  percentage: number; // 0-100
  size: number; // Outer size in pixels
  strokeWidth: number; // Ring thickness
  color: string; // Ring color
  label: string; // Label text
  className?: string;
}

export default function CircularProgressRing({
  percentage,
  size,
  strokeWidth,
  color,
  label,
  className = "",
}: CircularProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate percentage change
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, percentage);
      setAnimatedPercentage(current);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedPercentage(percentage);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(animatedPercentage)}%
        </span>
      </div>
      {/* Label */}
      <span className="mt-2 text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}



















