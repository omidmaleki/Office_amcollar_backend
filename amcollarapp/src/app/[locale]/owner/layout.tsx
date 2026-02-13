"use client";

import SidebarLayout from "@/components/SidebarLayout";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
