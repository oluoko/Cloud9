"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type SizeMode = "sm" | "md" | "lg";

interface ModeToggleProps {
  className?: string;
  size?: SizeMode;
}

const sizeConfig = {
  sm: {
    container: "h-6 w-11",
    toggle: "h-4 w-4",
    icon: "h-2 w-2",
    positions: "left-0.5 left-6",
  },
  md: {
    container: "h-8 w-14",
    toggle: "h-6 w-6",
    icon: "h-3 w-3",
    positions: "left-1 left-7",
  },
  lg: {
    container: "h-10 w-18",
    toggle: "h-8 w-8",
    icon: "h-4 w-4",
    positions: "left-1 left-9",
  },
};

export function ModeToggle({ className, size = "md" }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const config = sizeConfig[size];
  const [leftPos, rightPos] = config.positions.split(" ");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton
        className={`relative bg-accent/70 inline-flex ${config.container} items-center rounded-full border border-foreground/40`}
      >
        <Skeleton
          className={`absolute ${config.toggle} ${leftPos} rounded-full border`}
        />
      </Skeleton>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative ${config.container} rounded-full p-1 bg-muted hover:bg-muted/80 border border-foreground/40 ${className}`}
    >
      <div
        className={`absolute ${
          config.toggle
        } rounded-full shadow-sm transition-all duration-300 flex items-center justify-center ${
          isDark ? `${leftPos} bg-slate-600` : `${rightPos} bg-orange-500`
        }`}
      >
        {isDark ? (
          <Moon className={`${config.icon} text-white`} />
        ) : (
          <Sun className={`${config.icon} text-white`} />
        )}
      </div>
    </Button>
  );
}
