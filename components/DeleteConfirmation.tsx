"use client";

import { deleteBanner } from "@/actions/banners";
import { deleteFlight } from "@/actions/flights";
import { deleteTestimonial } from "@/actions/testimonials";
import { DeleteButton } from "@/components/custom-button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { capitalize } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import { deleteUserProfile } from "@/actions/users";

interface ModelProps {
  id: string;
  title: string;
  modelType: "banner" | "flight" | "testimonial" | "user";
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
    console.log("Match is true");
    if (match) {
      setIsDeleting(true); // Set loading state to true before deletion
      console.log("Starting to delete ", modelType, "with ID:", id);
      try {
        if (modelType === "banner") {
          await deleteBanner(id);
        } else if (modelType === "flight") {
          await deleteFlight(id);
        } else if (modelType === "testimonial") {
          await deleteTestimonial(id);
        } else if (modelType === "user") {
          await deleteUserProfile(id);
        }
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
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete the{" "}
          {modelType} <span className="font-bold">&quot;{title}&quot;</span>
        </p>
        <p className="text-sm font-medium">
          Please type <span className="font-bold">&quot;{title}&quot;</span> to
          confirm deletion:
        </p>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type "${title}" to confirm`}
          className="mt-2"
        />
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        {isDeleting ? (
          <Button disabled variant="destructive" className="flex-1">
            <Loader2 className="animate-spin mr-2 size-4" />
            <LoadingDots text={`Deleting ${entityName}`} />
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="flex-1"
            disabled={!match || isDeleting}
            onClick={handleDelete}
          >
            Delete {entityName}
          </Button>
        )}
        {/* <DeleteButton
          text={`Delete ${entityName}`}
          loadingText={`Deleting ${entityName}`}
          disabled={!match}
          isPending={isDeleting}
          onClick={handleDelete}
          className="flex-1"
        /> */}
      </CardFooter>
    </Card>
  );
}
