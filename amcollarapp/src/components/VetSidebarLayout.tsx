"use client";

import VetSidebar from "./layout/VetSidebar";

export default function VetSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1f1a] flex flex-col">
      <VetSidebar />
      <main className="flex-1 ml-14 md:ml-28 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}