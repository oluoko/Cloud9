"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

import { usePathname } from "next/navigation";
import React from "react";
import CustomUserButton from "@/components/custom-user-button";
import { ModeToggle } from "@/components/dark-mode-toggle";
import Link from "next/link";

interface NavLink {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface NavLinksProps {
  links: NavLink[];
}

export default function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                <DropdownMenuItem
                  className={cn(
                    "flex gap-2 items-center hover:bg-primary/20",
                    pathname.includes(link.href) &&
                      "bg-primary/20 border border-primary/30"
                  )}
                >
                  <link.Icon className="size-4" />
                  {link.label}
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuItem>
              <CustomUserButton size="sm" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ModeToggle size="sm" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              <div
                className={cn(
                  "flex gap-2 items-center rounded-xl hover:bg-primary/20 p-1.5 cursor-pointer",
                  pathname.includes(link.href) &&
                    "bg-primary/20 border border-primary/30"
                )}
              >
                <link.Icon className="size-4" />
                {link.label}
              </div>
            </Link>
          ))}
        </>
      )}
    </>
  );
}
