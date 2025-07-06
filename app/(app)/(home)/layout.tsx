"use client";

import { NavBar } from "@/components/nav-bar";
import { ReactNode } from "react";
import { BookIcon, PlaneIcon } from "lucide-react";
import NavLinks from "@/components/nav-links";
import AdminButton from "@/components/admin-button";
import Footer from "@/components/footer";

export default function HomePageLayout({ children }: { children: ReactNode }) {
  const HomePageNavLinks = [
    {
      label: "Flights",
      Icon: PlaneIcon,
      href: "/flights",
    },
    {
      label: "Bookings",
      Icon: BookIcon,
      href: "/bookings",
    },
  ];
  return (
    <div className="selection:bg-foreground/20 overflow-x-hidden">
      <NavBar>
        <NavLinks links={HomePageNavLinks} />
      </NavBar>
      <AdminButton />
      <div className="">{children}</div>
      <Footer />
    </div>
  );
}
