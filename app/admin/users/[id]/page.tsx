import EditUser from "./_components/edit-user";
import ItemNotFound from "@/components/item-not-found";
import { getUserById } from "@/lib/auth";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    return <ItemNotFound item="user" />;
  }

  return (
    <div id={`${params.id}`}>
      <EditUser user={user} />
    </div>
  );
}
