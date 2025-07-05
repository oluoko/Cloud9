"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Cloud, MapPin } from "lucide-react";
import { FaPlane, FaCloud } from "react-icons/fa";
import LoadingDots from "./loading-dots";

interface AirlineLoaderProps {
  mainText?: string;
  subText?: string;
}

const Loader = ({
  mainText = "Finding the Best Flights",
  subText = "Searching across airlines",
}: AirlineLoaderProps) => {
  return (
    <div className="absolute top-0 left-0 z-20 h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-background">
      {/* Main animation container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer rotating circle */}
        <div className="absolute w-full h-full rounded-full border-4 border-primary border-dashed animate-[spin_8s_linear_infinite]" />

        {/* Inner circle with pulsing effect */}
        <div className="absolute w-48 h-48 rounded-full border-4 border-primary opacity-50 animate-pulse" />

        {/* Rotating plane */}
        <div className="absolute w-full h-full animate-[spin_4s_linear_infinite] z-99 ">
          <FaPlane
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 size-14 text-primary"
            // style={{ transform: "rotate(90deg)" }}
          />
        </div>

        {/* Floating clouds */}
        <Cloud className="absolute top-4 -left-1/4 size-10 text-muted-foreground " />
        <FaCloud className="absolute top-0 right-1/4 size-12 text-muted-foreground animate-bounce delay-100 " />
        <Cloud className="absolute top-[50%] left-[101%] size-12 text-muted-foreground animate-bounce delay-200 " />
        <FaCloud className="absolute bottom-20 right-[98%] size-10 text-muted-foreground animate-bounce delay-400 " />
        <Cloud className="absolute bottom-0 right-1/4 size-8 text-muted-foreground animate-bounce delay-300 " />
        <FaCloud className="absolute bottom-0 left-[10%] size-8 text-muted-foreground delay-400 " />
        {/* Center loading spinner */}
        <Loader2 className="w-10 h-10 text-primary animate-spin " />
      </div>

      {/* Destination markers */}
      <div className="flex items-center space-x-4 mt-8">
        <MapPin className="w-6 h-6 text-primary animate-bounce delay-100" />
      </div>

      {/* Loading text */}
      <div className="mt-8 flex flex-col items-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          {mainText}
        </h2>
        <LoadingDots text={subText} />
      </div>
    </div>
  );
};

export default Loader;
