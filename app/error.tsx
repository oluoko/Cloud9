"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AppErrorPage() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <p>Something went wrong.</p>
      <div className="flex gap-2 md:gap-4">
        <Button
          variant="primaryOutline"
          className="flex-1"
          onClick={() => {
            router.refresh();
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
