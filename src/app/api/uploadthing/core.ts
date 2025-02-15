import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// Define custom routes configuration
const customRoutes = [
  {
    routeSlug: "flightImageRoute",
    options: { maxFileSize: "4MB", maxFileCount: 10 },
  },
  {
    routeSlug: "bannerImageRoute",
    options: { maxFileSize: "4MB", maxFileCount: 2 }, // Allow 2 images for banner (large and small)
  },
] as const;

// Create a type for the route slugs
type RouteSlug = (typeof customRoutes)[number]["routeSlug"];

// Helper function to create route configuration
const createRouteConfig = (
  routeSlug: RouteSlug,
  options: (typeof customRoutes)[number]["options"]
) => {
  return f({
    image: {
      maxFileSize: options.maxFileSize,
      maxFileCount: options.maxFileCount,
    },
  })
    .middleware(async ({ req }) => {
      const { userId } = auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      return {
        userId: userId,
        routeSlug, // Pass the routeSlug to know which route was used
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Upload complete for ${metadata.routeSlug}`);
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Handle different routes
      switch (metadata.routeSlug) {
        case "bannerImageRoute":
          // You could add specific banner image processing here
          console.log("Processing banner image");
          break;
        case "flightImageRoute":
          // You could add specific flight image processing here
          console.log("Processing flight image");
          break;
      }

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        routeType: metadata.routeSlug,
      };
    });
};

// Create the file router with dynamic routes
export const ourFileRouter = Object.fromEntries(
  customRoutes.map(({ routeSlug, options }) => [
    routeSlug,
    createRouteConfig(routeSlug, options),
  ])
) satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
