"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { getInitials } from "@/lib/utils";
import userImage from "@/public/assets/userProfile.png";
import Link from "next/link";
import { User } from "@prisma/client";

import { useQuery } from "@tanstack/react-query";
import useSWR from "swr";

// Fetcher function
const fetcher = async (url: string): Promise<User> => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch");
  }

  return response.json();
};

type SizeMode = "sm" | "md" | "lg";

interface CustomUserButtonProps {
  size?: SizeMode;
}

const sizeConfig = {
  sm: {
    button: "size-[28px]",
    avatar: "size-[28px]",
    dropdown: "w-48",
    label: "p-2",
    nameText: "text-xs",
    emailText: "text-[9px]",
    menuItem: "text-xs",
  },
  md: {
    button: "size-[35px]",
    avatar: "size-[35px]",
    dropdown: "w-56",
    label: "p-3",
    nameText: "text-sm",
    emailText: "text-[10px]",
    menuItem: "text-sm",
  },
  lg: {
    button: "size-[42px]",
    avatar: "size-[42px]",
    dropdown: "w-64",
    label: "p-4",
    nameText: "text-base",
    emailText: "text-xs",
    menuItem: "text-base",
  },
};

function CustomUserButtonSkeleton({ size = "md" }: { size?: SizeMode }) {
  const config = sizeConfig[size];

  return (
    <Skeleton
      className={`rounded-full ${config.button} bg-accent/70 border border-foreground/40`}
    />
  );
}

export default function CustomUserButton({
  size = "md",
}: CustomUserButtonProps) {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: false, // Don't refetch on window focus
    revalidateOnReconnect: true, // Refetch on reconnect
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
  });

  const config = sizeConfig[size];

  if (isLoading) {
    return <CustomUserButtonSkeleton size={size} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full relative ${config.button}`}
        >
          <Avatar className={config.avatar}>
            <AvatarImage
              src={user?.profileImage ?? undefined}
              className="object-cover
"
              alt="userImage"
            />
            {user?.firstName || user?.lastName ? (
              <AvatarFallback>
                {getInitials(user?.firstName ?? "", user?.lastName ?? "")}
              </AvatarFallback>
            ) : (
              <AvatarImage src={userImage.src} alt="userImage" />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={config.dropdown} align="end" forceMount>
        <DropdownMenuLabel
          className={`flex flex-col space-y-1 ${config.label}`}
        >
          <p className={`${config.nameText} font-medium leading-none`}>
            {user?.firstName ? `${user?.firstName} ${user?.lastName}` : ""}
          </p>
          <p
            className={`${config.emailText} leading-none text-muted-foreground`}
          >
            {user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href="/profile"
            className={`${config.menuItem} font-medium leading-none p-1`}
          >
            {user?.firstName ? `${user?.firstName}'s Profile` : "Profile"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SignOutButton>
            <div className="w-full">Logout</div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { CustomUserButtonSkeleton };
