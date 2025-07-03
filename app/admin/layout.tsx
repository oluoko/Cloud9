"use client";

import { isAdmin } from "@/lib/isAdmin";
import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import AdminFallBack from "./_components/AdminFallback";
import NavLinks from "@/components/nav-links";
import { NavBar } from "@/components/nav-bar";
import {
  BookIcon,
  Plane,
  Users,
  LogOut,
  Image,
  LayoutList,
} from "lucide-react";
import Link from "next/link";
import { useMe } from "@/contexts/use-user";
import LoadingDots from "@/components/loading-dots";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { me, isLoading, error } = useMe();
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingDots text="Loading admin dashboard" />
      </div>
    );
  }

  if (
    !isAdmin(user) ||
    !me ||
    (me.role !== "ADMIN" && me.role !== "MAIN_ADMIN")
  ) {
    return <AdminFallBack />;
  }

  const AdminPageNavLinks = [
    {
      label: "Users",
      Icon: Users,
      href: "/admin/users",
    },
    {
      label: "Bookings",
      Icon: BookIcon,
      href: "/admin/bookings",
    },
    {
      label: "Flights",
      Icon: Plane,
      href: "/admin/flights",
    },
    {
      label: "Banners",
      Icon: Image,
      href: "/admin/banners",
    },
    {
      label: "Testimonials",
      Icon: LayoutList,
      href: "/admin/testimonials",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <NavBar />

        <nav className="mt-8 px-4">
          <NavLinks links={AdminPageNavLinks} />

          <Link
            href="/dashboard"
            className="flex items-center mt-6 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Exit
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
