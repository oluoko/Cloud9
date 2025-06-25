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
import { useToast } from "@/hooks/use-toast";
import { testimonialSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { useState } from "react";
import { SubmitButton } from "../custom-button";
import { Textarea } from "../ui/textarea";
import { Testimonial } from "@prisma/client";

export default function EditTestimonial({ data }: { data: Testimonial }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(data.rating);

  const [lastResult, action] = useFormState(editTestimonial, undefined);

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
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <input type="hidden" name="testimonialId" value={data.id} />
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
                    defaultValue={data.rating}
                  />
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="size-4 fill-yellow-500 stroke-muted-foreground" />
                    <StarFilledIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
                    <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
                    <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
                    <StarIcon className="size-4 fill-muted-foreground stroke-muted-foreground" />
                  </div>
                  <p className="text-red-500">{fields.rating.errors}</p>
                  {/* Rating Ui to go here */}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Destination City</Label>
                  <Input
                    type="text"
                    name={fields.descriptiveTitle.name}
                    key={fields.descriptiveTitle.key}
                    defaultValue={data.descriptiveTitle}
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
          <CardFooter>
            <SubmitButton text="Create Testimonial" />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
