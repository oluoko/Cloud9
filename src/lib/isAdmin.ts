import type { UserResource } from "@clerk/types";

export function isAdmin(user: UserResource | null | undefined) {
  return (
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "main_admin"
  );
}

export function isMainAdmin(user: UserResource | null | undefined) {
  return user?.publicMetadata?.role === "main_admin";
}
