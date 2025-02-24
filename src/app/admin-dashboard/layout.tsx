"use client";

import { isAdmin } from "@/lib/isAdmin";
import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import AdminFallBack from "./_components/AdminFallback";
import { NavBar } from "./_components/Navbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();
  if (!isAdmin(user)) return <AdminFallBack />;
  return (
    <div className="selection:bg-foreground/20">
      <NavBar />
      <div className="min-h-screen bg-[radial-gradient(hsl(0,32%,17%,40%),hsl(24,27%,23%,2 9%),hsl(var(--background))_60%)] text-balance px-4 pt-[70px] md:pt-[100px]">
        {children}
      </div>
    </div>
  );
}
