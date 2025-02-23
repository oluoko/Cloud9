"use client";

import { createFlight } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { flightSchema } from "@/lib/zodSchemas";
import { UploadButton } from "@/utils/uploadthing";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function CreateFlight() {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [lastResult, action] = useFormState(createFlight, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: flightSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <div className="flex justify-between items-center w-[95vw] md:w-[60vw] mb-4">
          <Link
            href="/admin-dashboard/flights"
            className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
          >
            <ChevronLeft className="size-4 md:size-5" />
          </Link>

          <h1 className="text-xl font-semibold tracking-tight">
            Create New Flight
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Flight Details</CardTitle>
            <CardDescription>
              Create your a flight right here. You can upload upto 8 images for
              one flight.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    type="text"
                    name={fields.flightName.name}
                    key={fields.flightName.key}
                    defaultValue={fields.flightName.value}
                    placeholder="Enter the title of the banner"
                  />
                  <p className="text-red-500">{fields.flightName.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Destination City</Label>
                  <Input
                    type="text"
                    name={fields.flightDate.name}
                    key={fields.flightDate.key}
                    defaultValue={fields.flightDate.value}
                    placeholder="Enter the destination city"
                  />
                  <p className="text-red-500">{fields.flightDate.errors}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-dashed border-2 border-gray-300 p-2 md:p-4 rounded-lg">
                <Label className="text-xl font-bold">Flight Images</Label>
                <Input
                  type="hidden"
                  value={images}
                  // name={fields.largeImageUrl.name}
                  // key={fields.largeImageUrl.key}
                  // defaultValue={fields.largeImageUrl.initialValue}
                />
                {images.length > 0 ? (
                  <div className="flex gap-2 md:gap-5">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative size-[70px] md:size-[100px]"
                      >
                        <Image
                          src={image}
                          alt="Product Image"
                          height={100}
                          width={100}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          type="button"
                          className="absolute -top-3 -right-3 bg-red-500 p-1 rounded-lg text-white"
                          title="Delete Image"
                        >
                          <XIcon className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UploadButton
                    endpoint="bannerImageRoute"
                    onClientUploadComplete={(res) => {
                      setImages(res.map((r) => r.url));
                      toast({
                        title: "Image Uploaded",
                        description:
                          "The selected images, for the flight, have been uploaded successfully",
                      });
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        variant: "destructive",
                        title: "Error Uploading Banner Image",
                        description: `Error! : ${error.message}`,
                      });
                    }}
                  />
                )}
                {/* <p className="text-red-500">{fields..errors}</p> */}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto text-lg">
              Create a Flight
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
