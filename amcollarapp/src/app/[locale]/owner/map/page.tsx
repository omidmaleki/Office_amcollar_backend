"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Script from "next/script";

type GeofenceStep = "idle" | "select-center" | "adjust-radius" | "done";

export default function OwnerMapPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const isRTL = locale === "fa";
  const t = useTranslations("map");
  
  const appRef = useRef<any>(null);
  const ownerMarkerRef = useRef<any>(null);
  const petMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const geofenceRef = useRef<any>(null);
  const geofenceCenterRef = useRef<any>(null);
  const liveIntervalRef = useRef<any>(null);

  const [geofenceStep, setGeofenceStep] = useState<GeofenceStep>("idle");
  const [geofenceEnabled, setGeofenceEnabled] = useState(false);
  const [liveEnabled, setLiveEnabled] = useState(false);

  const ownerLocation = { lat: 35.6892, lng: 51.389 };
  const petStartLocation = { lat: 35.691, lng: 51.392 };

  const createAvatarIcon = (imageUrl: string, borderColor: string) =>
    (window as any).L.divIcon({
      className: "",
      html: `
        <div style="
          width:32px;
          height:32px;
          border-radius:50%;
          overflow:hidden;
          border:3px solid ${borderColor};
          box-shadow:0 4px 10px rgba(0,0,0,.25);
          background:#fff;
        ">
          <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  /* ---------- init map ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).Mapp && (window as any).L && !appRef.current) {
        clearInterval(interval);

        const app = new (window as any).Mapp({
          element: "#map",
          presets: { latlng: ownerLocation, zoom: 13 },
          apiKey: process.env.NEXT_PUBLIC_MAP_IR_API_KEY,
        });

        app.addLayers();
        appRef.current = app;

        ownerMarkerRef.current = (window as any).L.marker(
          [ownerLocation.lat, ownerLocation.lng],
          { icon: createAvatarIcon("/images/owner-avatar.jpg", "#0F5D4A") }
        ).addTo(app.map);

        petMarkerRef.current = (window as any).L.marker(
          [petStartLocation.lat, petStartLocation.lng],
          { icon: createAvatarIcon("/images/pet-avatar.jpg", "#D4AF37") }
        ).addTo(app.map);

        polylineRef.current = (window as any).L.polyline(
          [[petStartLocation.lat, petStartLocation.lng]],
          { color: "#16a34a", weight: 4 }
        ).addTo(app.map);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /* ---------- realtime movement ---------- */
  useEffect(() => {
    if (!liveEnabled || !petMarkerRef.current) {
      clearInterval(liveIntervalRef.current);
      return;
    }

    liveIntervalRef.current = setInterval(() => {
      const c = petMarkerRef.current.getLatLng();
      const lat = c.lat + (Math.random() - 0.5) * 0.0005;
      const lng = c.lng + (Math.random() - 0.5) * 0.0005;

      petMarkerRef.current.setLatLng([lat, lng]);
      polylineRef.current.addLatLng([lat, lng]);
    }, 2000);

    return () => clearInterval(liveIntervalRef.current);
  }, [liveEnabled]);

  /* ---------- geofence logic ---------- */
  useEffect(() => {
    if (!appRef.current || geofenceStep === "idle") return;

    const map = appRef.current.map;
    const L = (window as any).L;

    const onClick = (e: any) => {
      if (geofenceStep === "select-center") {
        geofenceCenterRef.current = e.latlng;

        geofenceRef.current?.remove();
        geofenceRef.current = L.circle(e.latlng, {
          radius: 10, // initial radius
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.25,
        }).addTo(map);

        setGeofenceStep("adjust-radius");
      } else if (geofenceStep === "adjust-radius") {
        setGeofenceStep("done");
        setGeofenceEnabled(true);
        map.getContainer().style.cursor = "";
      }
    };

    const onMouseMove = (e: any) => {
      if (geofenceStep !== "adjust-radius") return;
      const center = geofenceCenterRef.current;
      if (!center || !geofenceRef.current) return;

      const centerLatLng = L.latLng(center.lat ?? center[0], center.lng ?? center[1]);
      const distanceMeters = centerLatLng.distanceTo(e.latlng);
      if (!Number.isFinite(distanceMeters)) return;

      geofenceRef.current.setRadius(distanceMeters);
    };

    map.on("click", onClick);
    map.on("mousemove", onMouseMove);
    map.getContainer().style.cursor = "crosshair";

    return () => {
      map.off("click", onClick);
      map.off("mousemove", onMouseMove);
      map.getContainer().style.cursor = "";
    };
  }, [geofenceStep]);

  /* ---------- toggle geofence ---------- */
  useEffect(() => {
    if (!geofenceRef.current || !appRef.current) return;
    geofenceEnabled
      ? geofenceRef.current.addTo(appRef.current.map)
      : geofenceRef.current.remove();
  }, [geofenceEnabled]);

  return (
    <>
      <link rel="stylesheet" href="https://cdn.map.ir/web-sdk/1.4.2/css/mapp.min.css" />
      <link rel="stylesheet" href="https://cdn.map.ir/web-sdk/1.4.2/css/fa/style.css" />

      <Script src="https://cdn.map.ir/web-sdk/1.4.2/js/jquery-3.2.1.min.js" />
      <Script src="https://cdn.map.ir/web-sdk/1.4.2/js/mapp.env.js" />
      <Script src="https://cdn.map.ir/web-sdk/1.4.2/js/mapp.min.js" />

      <div className={`relative ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div id="map" className="w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-7rem)] relative z-0" />

        {/* hint */}
        {geofenceStep !== "idle" && geofenceStep !== "done" && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white px-4 py-2 rounded-xl shadow text-xs font-medium text-[#0F5D4A] ${isRTL ? "text-right" : "text-left"}`}>
            {geofenceStep === "select-center" && t("selectCenterHint")}
            {geofenceStep === "adjust-radius" && t("adjustRadiusHint")}
          </div>
        )}

        {/* define geofence button - positioned below sidebar on mobile, centered, gold background with green text */}
        <button
          onClick={() => setGeofenceStep("select-center")}
          className={`absolute ${isRTL ? "right-4 md:right-1/2 md:translate-x-1/2" : "left-4 md:left-1/2 md:-translate-x-1/2"} top-20 md:top-16 z-10 bg-[#D4AF37] px-3 py-2 rounded-xl shadow-md text-sm font-medium text-[#0F5D4A] ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("defineGeofence")}
        </button>

        {/* bottom controls - fixed center bottom, narrower width, below sidebar */}
        <div className={`
          absolute bottom-4 left-1/2 -translate-x-1/2
          max-w-xs w-full space-y-2 z-10
          ${isRTL ? "font-fa" : "font-en"}
        `}>
          <ToggleCard
            label={t("geofence")}
            active={geofenceEnabled}
            onToggle={() => setGeofenceEnabled((p) => !p)}
            isRTL={isRTL}
          />

          <ToggleCard
            label={t("realTimeLocation")}
            active={liveEnabled}
            onToggle={() => setLiveEnabled((p) => !p)}
            isRTL={isRTL}
          />

          {/* Lost button - centered text with green color */}
          <button className="w-full bg-[#D4AF37] text-[#0F5D4A] py-3 rounded-2xl font-semibold shadow-md text-center">
            {t("lost")}
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- toggle ---------- */
function ToggleCard({
  label,
  active,
  onToggle,
  isRTL,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  isRTL: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-[#0F5D4A] text-white ${isRTL ? "flex-row-reverse" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <span className={`text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{label}</span>
      <div className={`w-11 h-6 rounded-full p-1 transition-colors ${active ? "bg-green-400" : "bg-gray-300"}`}>
        <div className={`h-4 w-4 bg-white rounded-full transition-transform ${active ? (isRTL ? "-translate-x-5" : "translate-x-5") : ""}`} />
      </div>
    </button>
  );
}