"use client";

import Image from "next/image";
import { brand } from "../../lib/brand";

type Props = {
  dict: any;
  locale?: "fa" | "en";
};

export default function Monitor({ dict, locale }: Props) {
  const isFa = locale === "fa";
  const items: string[] = dict.monitor.items;

  // ===== DESKTOP =====
  const featureRadiusDesktop = 420;
  const lineEndRadiusDesktop = 360;

  const renderDesktopFeatures = () =>
    items.map((title, i) => {
      const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2;
      return {
        title,
        angle,
        style: {
          left: `calc(50% + ${Math.cos(angle) * featureRadiusDesktop}px)`,
          top: `calc(50% + ${Math.sin(angle) * featureRadiusDesktop}px)`,
          transform: "translate(-50%, -50%)",
        },
      };
    });

  const desktopFeatures = renderDesktopFeatures();

  // ===== MOBILE =====
  const mobileRadius = 130;

  const mobileOrbit = items.map((title, i) => {
    const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2;
    return {
      title,
      style: {
        left: `calc(50% + ${Math.cos(angle) * mobileRadius}px)`,
        top: `calc(50% + ${Math.sin(angle) * mobileRadius}px)`,
        transform: "translate(-50%, -50%)",
      },
    };
  });

  return (
   <section
  className="relative min-h-[auto] md:min-h-screen px-6 py-20 text-white"
  style={{
    background: `linear-gradient(180deg, ${brand.primarygreen}, ${brand.BackgroundDark})`,
  }}
  dir={isFa ? "rtl" : "ltr"}
>

      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-20 md:mb-40 text-center text-4xl font-extrabold">
          {dict.monitor.title}
        </h2>

        {/* ================= DESKTOP ================= */}
        <div className="relative mx-auto hidden md:flex h-[700px] w-[700px] items-center justify-center">
          {/* dotted lines */}
          <svg className="absolute inset-0 z-10" width="700" height="700">
            {desktopFeatures.map((f, i) => {
              const cx = 350;
              const cy = 350;
              const x2 = cx + Math.cos(f.angle) * lineEndRadiusDesktop;
              const y2 = cy + Math.sin(f.angle) * lineEndRadiusDesktop;
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
              );
            })}
          </svg>

          <Image
            src="/images/AMcollar-pro.png"
            alt="AMCOLLOR monitoring"
            width={600}
            height={600}
            priority
            className="relative z-20 w-[600px] drop-shadow-2xl"
          />

          {desktopFeatures.map((feature, i) => (
            <div
              key={i}
              className="absolute z-30 flex items-center justify-center"
              style={feature.style}
            >
              <div className="absolute h-32 w-32 animate-ping rounded-full border border-white/20" />
              <div className="relative rounded-full h-32 w-32 text-center border border-white/20 bg-[#D4AF37] text-[#0F5D4A] flex items-center justify-center">
  <p className="text-sm font-semibold m-0">{feature.title}</p>
</div>

            </div>
          ))}
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden relative mx-auto w-[280px] h-[280px]">
          <Image
            src="/images/AMcollar-pro.png"
            alt="AMCOLLOR monitoring"
            width={180}
            height={180}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl z-10"
          />

          {mobileOrbit.map((feature, i) => (
  <div key={i} className="absolute z-20" style={feature.style}>
    {/* pulse */}
   <div
  className="absolute inset-0 rounded-full border border-white/20 animate-ping"
  style={{ animationDuration: "2.5s" }}
/>


    {/* card */}
    <div
      className="relative flex items-center justify-center
                 w-20 h-20 rounded-full
                 border border-white/25
                 bg-white/10 backdrop-blur-md text-center"
    >
      <span className="text-[10px] font-semibold px-2 leading-tight">
        {feature.title}
      </span>
    </div>
  </div>
))}

        </div>
      </div>
    </section>
  );
}
