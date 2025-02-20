import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ModeToggle } from "./dark-mode-toggel";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { isAdmin } from "@/lib/isAdmin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import CustomUserButton from "./CustomUserButton";

export function NavBar() {
  // const { user } = useUser();
  return (
    <header className="flex items-center justify-center py-1 fixed shadow-xl top-0 w-screen z-99 bg-background/90">
      <nav className="flex items-center justify-between  gap-10 container font-semibold w-11/12 ">
        <Link href="/">
          <BrandLogo styling="h-[45px] md:h-[60px] w-[90px] md:w-[120px]" />
        </Link>
        <div className="flex items-center justify-between  gap-5">
          <SignedIn>
            {" "}
            <Link
              href="/dashboard"
              className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
            >
              Dashboard
            </Link>
            <CustomUserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-up">
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
