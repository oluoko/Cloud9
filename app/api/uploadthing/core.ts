import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Define proper types for our route configuration
type ImageRouteConfig = {
  routeSlug: string;
  image: {
    maxFileSize:
      | "4MB"
      | "4B"
      | "4KB"
      | "4GB"
      | "1B"
      | "1KB"
      | "1MB"
      | "1GB"
      | "2B"
      | "2KB"
      | "2MB"
      | "2GB"
      | "8B"
      | "8KB"
      | "8MB"
      | "8GB"
      | "16B"
      | "16KB"
      | "16MB"
      | "16GB"
      | "32B"
      | "32KB"
      | "32MB"
      | "32GB";
    maxFileCount: number;
  };
};

// Define your routes in an array
const imageRoutes: ImageRouteConfig[] = [
  {
    routeSlug: "bannerImageRoute",
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  },
  {
    routeSlug: "flightImagesRoute",
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  },
  {
    routeSlug: "profileImageRoute",
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  },
];

// Create a common middleware and onUploadComplete handler
const createAuthMiddleware =
  () =>
  async ({ req }: { req: Request }) => {
    const userId = "chill-iguana";

    return { userId };
  };

const createUploadCompleteHandler =
  () =>
  async ({
    metadata,
    file,
  }: {
    metadata: { userId: string };
    file: { url: string };
  }) => {
    return { uploadedBy: metadata.userId };
  };

// Dynamically generate the router based on the routes array
const generateFileRouter = () => {
  const router: Partial<FileRouter> = {};

  imageRoutes.forEach((route) => {
    // Use the correct structure for the f() function
    router[route.routeSlug] = f({
      image: route.image,
    })
      .middleware(createAuthMiddleware())
      .onUploadComplete(createUploadCompleteHandler());
  });

  return router as FileRouter;
};

export const ourFileRouter = generateFileRouter();

export type OurFileRouter = typeof ourFileRouter;
