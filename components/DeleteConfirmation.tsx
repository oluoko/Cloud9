"use client";

import { deleteBanner } from "@/actions/banners";
import { deleteFlight } from "@/actions/flights";
import { deleteTestimonial } from "@/actions/testimonials";
import { DeleteButton } from "@/components/custom-button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { capitalize } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
        <Button variant="destructive" onClick={handleDelete}>
          Delete {modelType}
        </Button>

        {/* <DeleteButton
          isPending={isDeleting}
          text={`Delete ${entityName}`}
          loadingText={`Deleting ${entityName}`}
          onClick={handleDelete}
        /> */}
      </CardFooter>
    </Card>
  );
}
