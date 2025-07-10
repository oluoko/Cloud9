"use client";

import { editBanner } from "@/actions/banners";
import { SubmitButton } from "@/components/custom-button";
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
import { Switch } from "@/components/ui/switch";
import { bannerSchema } from "@/lib/zodSchemas";
import { UploadButton } from "@/utils/uploadthing";
import { getImageKey } from "@/lib/utils";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import axios from "axios";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { Banner } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function EditBannerForm({ data }: { data: Banner }) {
  const [smallImage, setSmallImage] = useState<string | undefined>(
    data.smallImageUrl
  );
  const [largeImage, setLargeImage] = useState<string | undefined>(
    data.largeImageUrl
  );
  const [lastResult, action] = useFormState(editBanner, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bannerSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = async (
    imageType: "small" | "large",
    imageUrl: string
  ) => {
    if (
      !confirm(
        "Are you sure you want to delete this banner image? This action cannot be undone."
      )
    ) {
      return;
    }

    if (imageType === "small") {
      await axios.post("/api/uploadthing/delete", {
        imageKey: getImageKey(imageUrl),
      });
      setSmallImage(undefined);
    } else if (imageType === "large") {
      await axios.post("/api/uploadthing/delete", {
        imageKey: getImageKey(imageUrl),
      });
      setLargeImage(undefined);
    }
  };

  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <input type="hidden" name="bannerId" value={data.id} />
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/admin/banners"
            className="rounded-full bg-secondary-foreground/40 p-2 hover:bg-primary"
          >
            <ChevronLeft className="size-4 md:size-5" />
          </Link>

          <h1 className="text-xl font-semibold tracking-tight">Edit Banner</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banner Details</CardTitle>
            <CardDescription>
              Edit the already createed banner right here.
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
                    defaultValue={data.title}
                    placeholder="Enter the title of the banner"
                  />
                  <p className="text-red-500">{fields.title.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Destination City</Label>
                  <Input
                    type="text"
                    name={fields.destinationAirport.name}
                    key={fields.destinationAirport.key}
                    defaultValue={data.destinationAirport}
                    placeholder="Enter the destination city"
                  />
                  <p className="text-red-500">
                    {fields.destinationAirport.errors}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                  type="text"
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={data.description ?? ""}
                  placeholder="Enter the description of the banner"
                />
                <p className="text-red-500">{fields.description.errors}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Is It Active</Label>
                <Switch
                  key={fields.isActive.key}
                  name={fields.isActive.name}
                  defaultChecked={data.isActive}
                />
                <p className="text-red-500">{fields.isActive.errors}</p>
              </div>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-2 border-dashed border-2 border-gray-300 p-2 md:p-4 rounded-lg">
                  <Label className="text-xl font-bold">
                    Large Screen Image
                  </Label>
                  <Input
                    type="hidden"
                    value={largeImage || ""}
                    name={fields.largeImageUrl.name}
                    key={fields.largeImageUrl.key}
                    defaultValue={fields.largeImageUrl.initialValue}
                  />
                  {largeImage ? (
                    <div className="relative w-[170px] h-[95px] md:w-[200px] md:h-[120px]">
                      <Image
                        src={largeImage}
                        alt="Banner Image"
                        height={200}
                        width={200}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleDeleteImage("large", largeImage)}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-1 rounded-lg text-white"
                        title="Delete Image"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="bannerImageRoute"
                      config={{ cn: twMerge }}
                      className="bg-primary hover:bg-primary/70 rounded-lg mt-4  md:mt-8 text-background"
                      onClientUploadComplete={(res) => {
                        setLargeImage(res[0].url);
                        toast.success(
                          "The selected image, for the large screen banner, has been uploaded successfully"
                        );
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Error! : ${error.message}`);
                      }}
                    />
                  )}
                  <p className="text-red-500">{fields.largeImageUrl.errors}</p>
                </div>
                <div className="flex flex-col gap-2 border-dashed border-2 border-gray-300 p-2 md:p-4 rounded-lg">
                  <Label className="text-xl font-bold">
                    Small Screen Image
                  </Label>
                  <Input
                    type="hidden"
                    value={smallImage || ""}
                    name={fields.smallImageUrl.name}
                    key={fields.smallImageUrl.key}
                    defaultValue={fields.smallImageUrl.initialValue}
                  />
                  {smallImage ? (
                    <div className="relative h-[170px] w-[95px] md:h-[200px] md:w-[120px]">
                      <Image
                        src={smallImage}
                        alt="Banner Image"
                        height={350}
                        width={170}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleDeleteImage("small", smallImage)}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-1 rounded-lg text-white"
                        title="Delete Image"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="bannerImageRoute"
                      config={{ cn: twMerge }}
                      className="bg-primary hover:bg-primary/70 rounded-lg mt-4  md:mt-8 text-background"
                      onClientUploadComplete={(res) => {
                        setSmallImage(res[0].url);
                        toast.success(
                          "The selected image, for the small screen banner, has been uploaded successfully"
                        );
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Error! : ${error.message}`);
                      }}
                    />
                  )}
                  <p className="text-red-500">{fields.smallImageUrl.errors}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton
              text="Update This Banner"
              loadingText="Updating Banner"
            />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
