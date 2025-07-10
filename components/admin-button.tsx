"use client";

import React, { useState, useEffect } from "react";
import { isAdmin } from "@/lib/isAdmin";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMe } from "@/contexts/use-user";

export default function AdminButton() {
  const { user } = useUser();
  const { me, isLoading } = useMe();

  const [textState, setTextState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [isWidthTransitioning, setIsWidthTransitioning] = useState(false);

  const textStates = [
    "Go to the Administration Dashboard",
    "Go to the Admin Dashboard",
    "Admin",
  ];

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setTextState((prev) => (prev + 1) % 3);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  useEffect(() => {
    const handleTextTransition = async () => {
      setIsTextVisible(false);

      await new Promise((resolve) => setTimeout(resolve, 150));

      setIsWidthTransitioning(true);
      setDisplayText(isHovered ? textStates[0] : textStates[textState]);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsWidthTransitioning(false);
      setIsTextVisible(true);
    };

    handleTextTransition();
  }, [textState, isHovered]);

  const getButtonWidth = () => {
    switch (textState) {
      case 0:
        return "w-64";
      case 1:
        return "w-48";
      case 2:
        return "w-24";
      default:
        return "w-64";
    }
  };

  const handleHover = () => {
    setIsHovered(true);
    setTextState(0);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (isAdmin(user) || me?.role === "ADMIN" || me?.role == "MAIN_ADMIN") {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Link href="/admin">
          <Button
            className={`
            ${getButtonWidth()}
            ${isWidthTransitioning ? "transition-all duration-500 ease-in-out" : ""}
            h-12 bg-primary hover:bg-primary/90 text-background rounded-full p-0 px-4 font-medium
            shadow-lg hover:shadow-xl transform hover:scale-105
            transition-all duration-300 ease-in-out
          `}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
          >
            <span
              className={`
              transition-opacity duration-150 ease-in-out
              ${isTextVisible ? "opacity-100" : "opacity-0"}
            `}
            >
              {displayText}
            </span>
          </Button>
        </Link>
      </div>
    );
  } else {
    return null;
  }
}
