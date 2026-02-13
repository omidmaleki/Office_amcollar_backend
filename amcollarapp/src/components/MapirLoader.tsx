"use client";

import Script from "next/script";

export default function MapirLoader() {
  return (
    <Script
      src="https://map.ir/web-sdk/mapir.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("map.ir loaded");
      }}
    />
  );
}
