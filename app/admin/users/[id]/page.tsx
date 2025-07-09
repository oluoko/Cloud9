import prisma from "@/utils/db";
import EditUser from "./_components/edit-user";
import ItemNotFound from "@/components/item-not-found";

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
    return <ItemNotFound item="user" />;
  }

  return (
    <div>
      <EditUser user={user} />
    </div>
  );
}
