"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editTestimonial } from "@/actions/testimonials";
import { toast } from "sonner";
import { testimonialSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { useState } from "react";
import { SubmitButton } from "@/components/custom-button";
import { Textarea } from "@/components/ui/textarea";
import { Testimonial } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { getFirstWords } from "@/lib/utils";
import { Button } from "../ui/button";

export default function EditTestimonial({ data }: { data: Testimonial }) {
  const [rating, setRating] = useState(data?.rating);
  const [hoverRating, setHoverRating] = useState(data.rating);

  const [lastResult, action] = useFormState(editTestimonial, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: testimonialSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  interface StarClickHandler {
    (starIndex: number): void;
  }

  const handleStarClick: StarClickHandler = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarHover: StarClickHandler = (starIndex) => {
    setHoverRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= ((hoverRating || rating) ?? 0);
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          className="focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded transition-colors duration-150"
        >
          {isFilled ? (
            <StarFilledIcon className="size-4 text-yellow-500 hover:text-yellow-400 transition-colors duration-150" />
          ) : (
            <StarIcon className="size-4 text-muted-foreground hover:text-yellow-300 transition-colors duration-150" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        className="m-4"
      >
        <input type="hidden" name="testimonialId" value={data.id} />
        <Card>
          <CardHeader>
            <CardTitle>Edit Testimonial</CardTitle>

            <CardDescription>
              Share your experience when flying with Cloud9, the service or
              their customer care. You can also rate them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label>Rating</Label>
                  <Input
                    hidden
                    type="number"
                    name={fields.rating.name}
                    key={fields.rating.key}
                    value={rating ?? ""}
                    onChange={() => {}} // Controlled by star clicks
                  />
                  <div className="flex items-center gap-1">{renderStars()}</div>
                  {(rating ?? 0) > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {rating} out of 5 stars
                    </p>
                  )}
                  <p className="text-red-500">{fields.rating.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Descriptive Title</Label>
                  <Input
                    type="text"
                    name={fields.descriptiveTitle.name}
                    key={fields.descriptiveTitle.key}
                    defaultValue={data?.descriptiveTitle ?? ""}
                    placeholder="How would you describe yourself"
                  />
                  <p className="text-red-500">
                    {fields.descriptiveTitle.errors}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Your Testimonial</Label>
                <Textarea
                  name={fields.comment.name}
                  key={fields.comment.key}
                  defaultValue={data.comment}
                  placeholder="Describe in detail your testimonial"
                />
                <p className="text-red-500">{fields.comment.errors}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid md:flex justify-between items-center gap-2">
            <SubmitButton
              text="Update Testimonial"
              loadingText="Updating Testimonial"
              className="w-full md:w-max"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-max">
                  Delete Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Testimonial</DialogTitle>
                <DeleteConfirmation
                  id={data.id}
                  title={getFirstWords(data.comment, 4)}
                  modelType="testimonial"
                />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
