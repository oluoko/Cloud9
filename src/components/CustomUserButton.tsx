import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { getInitials } from "@/utils/utils";
import userImage from "../../public/assets/userProfile.png";
import Link from "next/link";

import { getUserByClerkId } from "@/lib/auth";
import { redirect } from "next/navigation";

const CustomUserButton = async () => {
  const dbUser = await getUserByClerkId();
  if (!dbUser.phoneNumber) {
    redirect("/complete-profile");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative size-[35px] "
        >
          <Avatar className="size-[35px]">
            <AvatarImage
              src={dbUser?.profileImage ?? undefined}
              alt="dbUserImage"
            />
            {dbUser?.firstName || dbUser?.lastName ? (
              <AvatarFallback>
                {getInitials(dbUser?.firstName ?? "", dbUser?.lastName ?? "")}
              </AvatarFallback>
            ) : (
              <AvatarImage src={userImage.src} alt="userImage" />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex flex-col space-y-1 p-3">
          <p className="text-sm font-medium leading-none">
            {dbUser?.firstName
              ? `${dbUser?.firstName} ${dbUser?.lastName}`
              : ""}
          </p>
          <p className="text-[10px] leading-none text-muted-foreground">
            {dbUser?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href="/dashboard/profile"
            className="text-sm font-medium leading-none p-1"
          >
            {dbUser?.firstName ? `${dbUser?.firstName}'s Profile` : "Profile"}
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
};

export default CustomUserButton;
