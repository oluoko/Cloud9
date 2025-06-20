"use client";

import { NavBar } from "@/components/nav-bar";
import { ReactNode } from "react";
import { BookIcon } from "lucide-react";
import NavLinks from "@/components/nav-links";
import AdminButton from "@/components/admin-button";

export default function HomePageLayout({ children }: { children: ReactNode }) {
  const HomePageNavLinks = [
    {
      label: "Bookings",
      Icon: BookIcon,
      href: "/bookings",
    },
  ];
  return (
    <div className="selection:bg-foreground/20">
      <NavBar>
        <NavLinks links={HomePageNavLinks} />
      </NavBar>
      <AdminButton />
      <div className="">{children}</div>
    </div>
  );
}
