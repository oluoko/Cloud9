import { defaultProfileImage, formatDate } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function UserCard({ user }: { user: User }) {
  return (
    <Card className="flex flex-row items-center gap-2 p-4 md:p-6">
      <Image
        src={user.profileImage || defaultProfileImage()}
        alt={`${user.firstName} ${user.lastName}`}
        width={100}
        height={100}
        className="rounded-full size-[60px] md:size-[80px] border hover:border-primary transition-colors"
      />
      <div>
        <h2 className="font-bold">
          {user.firstName} {user.lastName}
        </h2>
        <p>Email: {user.email}</p>
        <p className="text-sm text-muted-foreground">Role: {user.role}</p>
        <p className="text-sm text-muted-foreground">
          Joined on {formatDate(user.createdAt)}
        </p>
      </div>
    </Card>
  );
}
