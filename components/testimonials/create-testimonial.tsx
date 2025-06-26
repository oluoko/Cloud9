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
import { createTestimonial } from "@/actions/testimonials";
import { useToast } from "@/hooks/use-toast";
import { testimonialSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { useState } from "react";
import { SubmitButton } from "../custom-button";
import { Textarea } from "../ui/textarea";

export default function CreateTestimonial() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [lastResult, action] = useFormState(createTestimonial, undefined);

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
      const isFilled = i <= (hoverRating || rating);
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
        <Card>
          <CardHeader>
            <CardTitle>Create a Testimonial</CardTitle>

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
                    value={rating}
                    onChange={() => {}} // Controlled by star clicks
                  />
                  <div className="flex items-center gap-1">{renderStars()}</div>
                  {rating > 0 && (
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
                    defaultValue={fields.descriptiveTitle.value}
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
                  defaultValue={fields.comment.value}
                  placeholder="Describe in detail your testimonial"
                />
                <p className="text-red-500">{fields.comment.errors}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton
              text="Create Testimonial"
              loadingText="Creating Testimonial"
            />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
