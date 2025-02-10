"use client";

import logoWhiteText from "../../public/logo white text.svg";
import logoBlackText from "../../public/logo black text.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AuthImageProps {
  containerStyling: string;
  heading: string;
  headingStyling: string;
  text: string;
  textStyling: string;
}

export function AuthImage({
  containerStyling,
  heading,
  headingStyling,
  text,
  textStyling,
}: AuthImageProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component is not yet mounted, return null or a placeholder
  if (!mounted) {
    return null;
  }

  return (
    <div className={"w-[70% ] flex flex-col items-center justify-center"}>
      <div className="w-[50vw] md:w-[30vw]">
        {theme === "dark" ? (
          <Image src={logoWhiteText} alt="Logo in white text" />
        ) : (
          <Image src={logoBlackText} alt="Logo in black text" />
        )}
      </div>

      <div
        className={`${containerStyling} flex flex-col items-center justify-center `}
      >
        <div className={`${headingStyling} text-4xl font-black mb-3`}>
          {heading}
        </div>
        <div
          className={`${textStyling} w-[70%] text-2xl tracking-wider text-secondary-foreground/70`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
