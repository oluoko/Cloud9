"use client";

import errorImage from "@/public/assets/no-flight-found.svg";
import Image from "next/image";

interface ErrorImageProps {
  styling?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function ErrorImage({ styling, size = "md" }: ErrorImageProps) {
  return (
    <span
      className={`${styling} ${
        size === "xs"
          ? "m-1"
          : size === "sm"
            ? "m-2"
            : size === "md"
              ? "m-3"
              : size === "lg"
                ? "m-4"
                : size === "xl"
                  ? "m-5"
                  : "m-3"
      }`}
    >
      <Image
        src={errorImage}
        alt="Error Image"
        className={`${
          size === "xs"
            ? "w-16 h-16"
            : size === "sm"
              ? "w-24 h-24"
              : size === "md"
                ? "w-32 h-32"
                : size === "lg"
                  ? "w-48 h-48"
                  : size === "xl"
                    ? "w-64 h-64"
                    : "w-32 h-32"
        }`}
      />
    </span>
  );
}
