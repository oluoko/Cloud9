"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateBanner() {
  const { toast } = useToast();
  const onSubmit = () => {
    toast({
      title: "Banner Created",
      description: "Banner has been created successfully",
      variant: "success",
    });
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex justify-between items-center w-[95vw] md:w-[80vw] mb-4">
          <Link
            href="/admin-dashboard/banners"
            className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
          >
            <ChevronLeft className="size-4 md:size-5" />
          </Link>

          <h1 className="text-xl font-semibold tracking-tight">
            Create New Banner
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banner Details</CardTitle>
            <CardDescription>
              Create your banner right here. We need two images: one for small
              sreens(phones) and another for large screens(laptops and PCs ).
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="rounded-xl bg-primary border border-gray-800/30 p-2"
            >
              Create Banner
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
