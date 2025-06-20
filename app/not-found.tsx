import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AppNotFoundPage() {
  return (
    <div className="h-screen flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <h1 className="text-4xl">404</h1>
      <p>We couldn&apos;t find the page you were looking for.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
