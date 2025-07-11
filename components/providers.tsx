"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { UserProvider } from "@/contexts/use-user";
import { FlightsProvider } from "@/contexts/use-flights";
import { useState } from "react";
import { NavigationBot } from "@/components/navigation-bot";
import NavigationBotProfiles from "@/components/navigation-bot-profiles";
import { BotType } from "@/hooks/use-navigation-ai";

export function Providers({ children }: { children: React.ReactNode }) {
  const [activeBot, setActiveBot] = useState<BotType>("CloudIA");
  const [isOpen, setIsOpen] = useState(false);
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

            <NavigationBotProfiles
              activeBot={activeBot}
              setActiveBot={setActiveBot}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
            <NavigationBot
              botType={activeBot}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </FlightsProvider>
        </UserProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
