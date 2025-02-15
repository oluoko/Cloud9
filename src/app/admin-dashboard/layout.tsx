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
      <div>{children}</div>
    </div>
  );
}
