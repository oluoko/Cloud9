"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { BrandLogo } from "@/components/BrandLogo";
import { ModeToggle } from "@/components/dark-mode-toggel";
import { isAdmin } from "@/lib/isAdmin";

export function NavBar() {
  const { user } = useUser();
  const navbarLinks = [
    { id: 0, name: "Home", href: "/dashboard" },
    { id: 1, name: "Profile", href: "/dashboard/profile" },
    { id: 2, name: "Bookings", href: "/dashboard/bookings" },
    { id: 3, name: "Checkout", href: "/dashboard/check-out" },
  ];
  return (
    <header className="flex items-center justify-center py-1 fixed shadow-xl top-0 w-screen z-99 bg-background/90">
      <nav className="flex items-center justify-between  gap-10 container font-semibold w-11/12 ">
        <Link href="/">
          <BrandLogo styling="h-[45px] md:h-[60px] w-[90px] md:w-[120px]" />
        </Link>
        <div className="flex items-center justify-between  gap-5">
          {navbarLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
            >
              {link.name}
            </Link>
          ))}

          {isAdmin(user) && (
            <Link
              href="/admin-dashboard"
              className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
            >
              Admin
            </Link>
          )}

          <UserButton />

          <div className="">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
