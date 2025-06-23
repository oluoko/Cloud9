"use client";

import logoWhiteText from "@/public/logo white text.svg";
import logoBlackText from "@/public/logo black text.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  styling: string;
  inverted?: boolean;
}

export function BrandLogo({ styling, inverted }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component is not yet mounted, return null or a placeholder
  if (!mounted) {
    return null;
  }

  if (inverted) {
    return (
      <div className={`${styling}`}>
        {resolvedTheme === "dark" ? (
          <Image
            src={logoBlackText}
            className="size-full"
            alt="Logo in black text"
          />
        ) : (
          <Image
            src={logoWhiteText}
            className="size-full"
            alt="Logo in white text"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`${styling}`}>
      {resolvedTheme === "dark" ? (
        <Image
          src={logoWhiteText}
          className="size-full"
          alt="Logo in white text"
        />
      ) : (
        <Image
          src={logoBlackText}
          className="size-full"
          alt="Logo in black text"
        />
      )}
    </div>
  );
}
