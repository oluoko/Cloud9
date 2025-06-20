"use client";

import React, { useState, useEffect } from "react";
import { isAdmin } from "@/lib/isAdmin";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AdminButton() {
  const { user } = useUser();
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
      // Phase 1: Fade out text
      setIsTextVisible(false);

      // Wait for text to fade out
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Phase 2: Start width transition
      setIsWidthTransitioning(true);
      setDisplayText(isHovered ? textStates[0] : textStates[textState]);

      // Wait for width transition
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Phase 3: Show new text
      setIsWidthTransitioning(false);
      setIsTextVisible(true);
    };

    handleTextTransition();
  }, [textState, isHovered]);

  const getButtonWidth = () => {
    switch (textState) {
      case 0:
        return "w-64"; // widest
      case 1:
        return "w-48"; // medium
      case 2:
        return "w-24"; // smallest
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

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 md:left-10 z-50">
      <Link href="/admin" className="block">
        <Button
          className={`
            rounded-full transition-all duration-500 ease-in-out origin-left font-bold
            ${getButtonWidth()}
            ${isWidthTransitioning ? "overflow-hidden" : ""}
          `}
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          onClick={handleHover}
        >
          <span
            className={`
              transition-opacity duration-150 ease-in-out block
              ${isTextVisible ? "opacity-100" : "opacity-0"}
            `}
          >
            {displayText}
          </span>
        </Button>
      </Link>
    </div>
  );
}
