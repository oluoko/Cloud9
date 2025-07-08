import { ErrorImage } from "@/components/error-image";
import prisma from "@/utils/db";

interface UserPageProps {
  params: {
    id: string;
  };
}

async function getUserDetails(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await getUserDetails(params.id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ErrorImage />
        <p className="font-semibold">User not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.email}</p>
      <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
    </div>
  );
}
