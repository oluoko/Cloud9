import { ErrorImage } from "@/components/error-image";
import UserCard from "@/components/user-card";
import { getUserByClerkId } from "@/lib/auth";
import prisma from "@/utils/db";
import Link from "next/link";

export default async function Users() {
  const self = await getUserByClerkId();

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: self?.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <p className="mb-4">
        Here you can view and manage all users(Except you😉) in the system;
        delete a user or change role from &quot;USER&quot; to &quot;ADMIN&quot;
      </p>
      {users.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-2">
          {users.map((user) => (
            <div className="relative" key={user.id}>
              <UserCard user={user} />
              <Link
                href={`/admin/users/${user.id}`}
                className="absolute z-10 right-2 top-2 bg-background text-foreground px-2 rounded-lg border hover:bg-primary transition-colors"
              >
                View {user.firstName}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <ErrorImage />
          <p className="text-xl font-bold">No Users Yet.</p>
        </div>
      )}
    </div>
  );
}
