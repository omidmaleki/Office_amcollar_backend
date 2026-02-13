"use client";

import Sidebar from "./layout/Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b1f1a] flex flex-col">
      <Sidebar />
      <main className="flex-1 ml-14 md:ml-32  overflow-y-auto">
        {children}
      </main>
    </div>
  );
}