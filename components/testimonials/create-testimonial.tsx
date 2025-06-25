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

  const [lastResult, action] = useFormState(createTestimonial, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: testimonialSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
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
                    defaultValue={fields.rating.value}
                  />
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="size-4 text-yellow-500" />
                    <StarFilledIcon className="size-4 text-yellow-500" />
                    <StarIcon className="size-4 fill-yello-300 stroke-muted-foreground" />
                    <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
                    <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
                  </div>
                  <p className="text-red-500">{fields.rating.errors}</p>
                  {/* Rating Ui to go here */}
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
            <SubmitButton text="Create Testimonial" />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
