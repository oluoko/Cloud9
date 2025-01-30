import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ModeToggle } from "./dark-mode-toggel";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function NavBar() {
  return (
    <header className="flex items-center justify-center py-1 fixed shadow-xl top-0 w-screen z-99 bg-background/90">
      <nav className="flex items-center justify-between  gap-10 container font-semibold w-11/12 ">
        <Link href="/">
          <BrandLogo />
        </Link>
        <div className="flex items-center justify-between  gap-5">
          <SignedIn>
            <Link
              href="/dashboard"
              className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/new-user">
              <span className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1">
                Get Started
              </span>
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
