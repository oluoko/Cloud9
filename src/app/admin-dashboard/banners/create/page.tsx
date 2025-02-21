"use client";

import { createBanner } from "@/app/actions";
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
import { bannerSchema } from "@/lib/zodSchemas";
import { UploadDropzone } from "@/utils/uploadthing";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function CreateBanner() {
  const { toast } = useToast();

  const [smallImage, setSmallImage] = useState<string | undefined>(undefined);
  const [largeImage, setLargeImage] = useState<string | undefined>(undefined);
  const [lastResult, action] = useFormState(createBanner, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: bannerSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = (image: "small" | "large") => {
    if (image === "small") {
      setSmallImage(undefined);
    } else {
      setLargeImage(undefined);
    }
  };
  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <div className="flex justify-between items-center w-[95vw] md:w-[60vw] mb-4">
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
              screens(phones) and another for large screens(laptops and PCs ).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    type="text"
                    name={fields.title.name}
                    key={fields.title.key}
                    defaultValue={fields.title.value}
                    placeholder="Enter the title of the banner"
                  />
                  <p className="text-red-500">{fields.title.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Destination City</Label>
                  <Input
                    type="text"
                    name={fields.destinationCity.name}
                    key={fields.destinationCity.key}
                    defaultValue={fields.destinationCity.value}
                    placeholder="Enter the destination city"
                  />
                  <p className="text-red-500">
                    {fields.destinationCity.errors}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                  type="text"
                  name={largeImage}
                  key={fields.description.key}
                  defaultValue={fields.description.value}
                  placeholder="Enter the description of the banner"
                />
                <p className="text-red-500">{fields.description.errors}</p>
              </div>
              <div className="md:grid md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label>Large Screen Image</Label>
                  <input
                    type="hidden"
                    value={largeImage}
                    key={fields.largeImageUrl.key}
                    name={fields.largeImageUrl.name}
                    defaultValue={fields.largeImageUrl.initialValue}
                  />
                  {largeImage !== undefined ? (
                    <div className="relative size-[140px] md:size-[200px]">
                      <Image
                        src={largeImage}
                        alt="Banner
                   Image"
                        height={200}
                        width={200}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleDeleteImage("large")}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-1 rounded-lg text-white"
                        title="Delete Image"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="bannerImageRoute"
                      onClientUploadComplete={(res) => {
                        setLargeImage(res[0].url);
                        toast({
                          title: "Image Uploaded",
                          description:
                            "The selected banner image has been uploaded successfully",
                        });
                      }}
                      onUploadError={() => {
                        toast({
                          title: "Error Uploading Banner Image",
                          description:
                            "There was an error uploading the banner image",
                          variant: "destructive",
                        });
                      }}
                    />
                  )}
                  <p className="text-red-500">{fields.largeImageUrl.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Small Screen Image</Label>
                  <input
                    type="hidden"
                    value={smallImage}
                    key={fields.smallImageUrl.key}
                    name={fields.smallImageUrl.name}
                    defaultValue={fields.smallImageUrl.initialValue}
                  />
                  {smallImage !== undefined ? (
                    <div className="relative size-[140px] md:size-[200px]">
                      <Image
                        src={smallImage}
                        alt="Banner
                   Image"
                        height={200}
                        width={200}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleDeleteImage("small")}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-1 rounded-lg text-white"
                        title="Delete Image"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="bannerImageRoute"
                      onClientUploadComplete={(res) => {
                        setLargeImage(res[0].url);
                        toast({
                          title: "Image Uploaded",
                          description:
                            "The selected banner image has been uploaded successfully",
                        });
                      }}
                      onUploadError={() => {
                        toast({
                          title: "Error Uploading Banner Image",
                          description:
                            "There was an error uploading the banner image",
                          variant: "destructive",
                        });
                      }}
                    />
                  )}
                  <p className="text-red-500">{fields.largeImageUrl.errors}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="rounded-xl bg-primary border border-gray-800/30 p-2">
              Create Banner
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
