"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider>
        <Toaster className="bg-primary" position="bottom-center" />
        <NextTopLoader color="#16A34A" showSpinner={false} />
        {children}
      </ClerkProvider>
    </ThemeProvider>
  );
}
