"use client";

import { deleteBanner } from "@/actions/banners";
import { deleteFlight } from "@/actions/flights";
import { deleteTestimonial } from "@/actions/testimonials";
import LoadingDots from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { capitalize } from "@/lib/utils";
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import Link from "next/link";
import { useEffect, useState } from "react";

interface ModelProps {
  id: string;
  title: string;
  modelType: "banner" | "flight" | "testimonial";
}

export default function DeleteConfirmation({
  id,
  title,
  modelType,
}: ModelProps) {
  const [match, setMatch] = useState(false);
  const [input, setInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // Add loading state

  useEffect(() => {
    setMatch(input === title);
  }, [input, title]);

  const handleDelete = async () => {
    if (match) {
      setIsDeleting(true); // Set loading state to true before deletion
      try {
        if (modelType === "banner") {
          await deleteBanner(id);
        } else if (modelType === "flight") {
          await deleteFlight(id);
        } else if (modelType === "testimonial") {
          await deleteTestimonial(id);
        }
        // Handle successful deletion (could add navigation here)
      } catch (error) {
        console.error(`Error deleting ${modelType}:`, error);
        // Handle error if needed
      } finally {
        setIsDeleting(false); // Reset loading state regardless of success/failure
      }
    }
  };

  const entityName = capitalize(modelType);

  return (
    <Card className="border-none shadow-none bg-transparent max-w-xl">
      <CardHeader>
        <CardTitle>
          Are you absolutely sure you want to delete this {modelType}?
        </CardTitle>
      </CardHeader>
      <CardFooter className="grid">
        <div className="my-2">
          This will permanently delete the {modelType}. First match the{" "}
          {modelType}&apos;s title{" "}
          <span className="font-extrabold">{title}</span> below
        </div>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type "${title}" to confirm`}
          className="mb-4"
        />

        {isDeleting ? (
          <Button disabled variant="destructive" className="text-xl">
            <Loader2 className="animate-spin mr-2 size-4" />
            <LoadingDots text={`Deleting ${entityName}`} />
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="text-xl"
            disabled={!match}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
