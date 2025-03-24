import { authMiddleware } from "@clerk/nextjs/server";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-up",
    "/sign-in",
    "/saving-info",
    "/api/uploadthing",
    "/sso-callback",
    "/terms-and-conditions",
    "/privacy-policy",
    "/blog",
    "/destination",
  ],
});
