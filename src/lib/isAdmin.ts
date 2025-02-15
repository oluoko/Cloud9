// import { UserResource } from "@clerk/types";

// type Props = {
//   user: UserResource | null | undefined;
// };
import type { User } from "@clerk/nextjs/server";
export function isAdmin(user: User | null | undefined) {
  if (
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "main_admin"
  ) {
    return true;
  }
}

export function isMainAdmin(user: User | null | undefined) {
  if (user?.publicMetadata.role === "main_admin") {
    return true;
  }
}
