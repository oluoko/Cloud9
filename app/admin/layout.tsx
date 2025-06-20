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

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  if (!isAdmin(user)) return <AdminFallBack />;

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
    <div className="selection:bg-foreground/20">
      <NavBar logoLink="/admin">
        <NavLinks links={AdminPageNavLinks} />

        <Link href="/">
          <div className="flex gap-2 items-center rounded-xl hover:bg-primary/20 p-1.5 cursor-pointer">
            <LogOut className="size-4" />
            Exit
          </div>
        </Link>
      </NavBar>
      <div className="my-3 md:my-5 bg-[radial-gradient(hsl(0,32%,17%,40%),hsl(24,27%,23%,2 9%),hsl(var(--background))_60%)] mt-20 md:mt-20 mx-5 md:mx-24">
        {children}
      </div>
    </div>
  );
}
