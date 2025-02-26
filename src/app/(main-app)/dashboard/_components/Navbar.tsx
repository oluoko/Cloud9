import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ModeToggle } from "@/components/dark-mode-toggel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import CustomUserButton from "@/components/CustomUserButton";

export function NavBar() {
  const navbarLinks = [
    { id: 0, name: "Home", href: "/dashboard" },
    { id: 1, name: "Profile", href: "/dashboard/profile" },
    { id: 2, name: "Bookings", href: "/dashboard/bookings" },
    { id: 3, name: "Checkout", href: "/dashboard/check-out" },
  ];
  return (
    <header className="flex items-center justify-center py-1 fixed shadow-xl top-0 w-screen z-99 bg-background">
      <nav className="flex items-center justify-between container font-semibold w-11/12 ">
        <Link href="/">
          <BrandLogo styling="h-[45px] md:h-[60px] w-[90px] md:w-[120px]" />
        </Link>
        <div className="flex items-center justify-between gap-5 md:gap-10">
          <div className="hidden md:flex items-center justify-between  gap-5">
            {navbarLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <CustomUserButton />

            <div className="">
              <ModeToggle />
            </div>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Menu className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navbarLinks.map((link) => (
                  <DropdownMenuItem key={link.id} asChild>
                    <Link
                      href={link.href}
                      className="bg-secondary/50 border border-secondary rounded-[10px] px-2 py-1 my-1 md:my-0"
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
