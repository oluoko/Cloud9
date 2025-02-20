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
    <div className="fixed bottom-10 left-10 z-50">
      <Link href="/admin-dashboard" className="block">
        <Button
          className={`transition-all duration-500 ease-in-out origin-left  font-bold ${getButtonWidth()}`}
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          onClick={handleHover}
        >
          {isHovered ? textStates[0] : textStates[textState]}
        </Button>
      </Link>
    </div>
  );
}
