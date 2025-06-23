import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloud9",
  description: "An Airplane Booking System",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative `}
      >
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400vw] w-[400vw] bg-gradient-to-r from-primary/5 from-30% via-primary/10 via-50% to-primary/15 to-80% opacity-15 animate-pulse duration-5000 -z-50" />
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// bg-[radial-gradient(hsl(142.1,76.2%,36.3%,20%),hsl(01,2%,3%,9%),hsl(var(--background))_60%)]
