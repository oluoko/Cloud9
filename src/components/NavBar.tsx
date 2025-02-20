"use client";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ModeToggle } from "./dark-mode-toggel";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function NavBar() {
  const { user } = useUser();
  return (
    <header className="flex items-center justify-center py-1 fixed shadow-xl top-0 w-screen z-99 bg-background/90">
      <nav className="flex items-center justify-between  gap-10 container font-semibold w-11/12 ">
        <Link href="/">
          <BrandLogo styling="h-[45px] md:h-[60px] w-[90px] md:w-[120px]" />
        </Link>
        <div className="flex items-center justify-between  gap-5">
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Menu className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {isAdmin(user) && (
                    <Link
                      href="/admin-dashboard"
                      className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
                    >
                      Admin
                    </Link>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-up">
              <span className="bg-primary hover:bg-primary/80 text-background border border-secondary rounded-[10px] px-2 py-1">
                Get Started
              </span>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-[10px] px-2 py-1">Sign In</Button>
            </Link>
          </SignedOut>
          <div className="">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
