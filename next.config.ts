import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    "pctmxd-3000.csb.app",
    "local-origin.dev",
    "*.local-origin.dev",
    "dqc5xz-3000.csb.app",
    "cloud9-git-paystack-and-stripe-fo-4ffcbd-brian-otienos-projects.vercel.app"
  ],
};

export default nextConfig;
