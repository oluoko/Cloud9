"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ErrorImage } from "@/components/error-image";

export default function AppErrorPage() {
  return (
    <div className="h-screen flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <ErrorImage size="lg" />
      <p>Something went wrong.</p>
      <div className="flex gap-2 md:gap-4">
        <Button
          variant="primaryOutline"
          className="flex-1"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh
        </Button>{" "}
        <Button asChild className="flex-1">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
