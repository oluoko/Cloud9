import { getUserByClerkId } from "@/lib/auth";
import { ProfileEditor } from "../_components/ProfileEditor";

export default async function Profile() {
  const user = await getUserByClerkId();
  return <ProfileEditor data={user} />;
}
