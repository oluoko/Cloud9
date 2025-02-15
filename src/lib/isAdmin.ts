export function isAdmin(user) {
  if (
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "main_admin"
  ) {
    return true;
  }
}

export function isMainAdmin(user) {
  if (user.publicMetadata.role === "main_admin") {
    return true;
  }
}
