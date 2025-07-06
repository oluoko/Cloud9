import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorImage } from "@/components/error-image";

export default function AppNotFoundPage() {
  return (
    <div className="h-screen flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <h1 className="text-4xl font-bold">404</h1>
      <ErrorImage size="lg" />
      <p>We couldn&apos;t find the page you were looking for.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
