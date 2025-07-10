"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { UserProvider } from "@/contexts/use-user";
import { FlightsProvider } from "@/contexts/use-flights";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider>
        <UserProvider>
          <FlightsProvider>
            <Toaster className="bg-primary" position="bottom-center" />

            <NextTopLoader color="#16A34A" showSpinner={false} />
            {children}
          </FlightsProvider>
        </UserProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
