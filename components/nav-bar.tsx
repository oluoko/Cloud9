"use client";

import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { ModeToggle } from "./dark-mode-toggle";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CustomUserButton from "./custom-user-button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavBarProps {
  children?: React.ReactNode;
  logoLink?: string;
}

export function NavBar({ children, logoLink }: NavBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-center py-1 fixed shadow-xl top-0 w-screen z-50 bg-background/70">
      <nav className="flex items-center justify-between  gap-10 container font-semibold w-11/12 ">
        <Link href={logoLink || "/"}>
          <BrandLogo styling="h-[45px] md:h-[60px] w-[90px] md:w-[120px]" />
        </Link>
        <div className="flex items-center justify-between  gap-2 md:gap-5">
          <SignedIn>
            {children}
            {!isMobile && (
              <>
                <ModeToggle size="sm" />
                <CustomUserButton />
              </>
            )}
          </SignedIn>
          <SignedOut>
            <Link href="/register">
              <Button className=" rounded-[10px] px-2 py-1">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-[10px] px-2 py-1">
                Sign In
              </Button>
            </Link>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
