"use client";

import { editFlight } from "@/actions/flights";
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
import { SubmitButton } from "@/components/custom-button";
import axios from "axios";
import { getImageKey } from "@/lib/utils";
import { DateTimePicker } from "./date-time-picker";
import { Flight } from "@prisma/client";
import { twMerge } from "tailwind-merge";

export function EditFlightForm({ data }: { data: Flight }) {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(data.flightImages);
  const [lastResult, action] = useFormState(editFlight, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: flightSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = async (index: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this flight image? This action cannot be undone."
      )
    ) {
      return;
    }
    await axios.post("/api/uploadthing/delete", {
      imageKey: getImageKey(images[index]),
    });
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <input type="hidden" name="flightId" value={data.id} />
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/admin/flights"
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
              Create your a flight right here. You can upload upto 4 images for
              one flight.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input
                    type="text"
                    name={fields.flightName.name}
                    key={fields.flightName.key}
                    defaultValue={data.flightName}
                    placeholder="Enter the name of the flight"
                  />
                  <p className="text-red-500">{fields.flightName.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Name of the Airline</Label>
                  <Input
                    type="text"
                    name={fields.airlineName.name}
                    key={fields.airlineName.key}
                    defaultValue={data.airlineName}
                    placeholder="Enter the name of the Airline"
                  />
                  <p className="text-red-500">{fields.airlineName.errors}</p>
                </div>
              </div>

              <DateTimePicker
                dateFieldName={fields.flightDate.name}
                timeFieldName={fields.flightTime.name}
                dateFieldValue={data.flightDate}
                timeFieldValue={data.flightTime}
                dateFieldKey={fields.flightDate.key}
                timeFieldKey={fields.flightTime.key}
                dateFieldErrors={fields.flightDate.errors}
                timeFieldErrors={fields.flightTime.errors}
              />

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Low Class Seats</Label>
                  <Input
                    type="text"
                    name={fields.lowSeats.name}
                    key={fields.lowSeats.key}
                    defaultValue={data.lowSeats}
                    placeholder="Enter the number of low class seats"
                  />
                  <p className="text-red-500">{fields.lowSeats.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Low Class Seat Price</Label>
                  <Input
                    type="text"
                    name={fields.lowPrice.name}
                    key={fields.lowPrice.key}
                    defaultValue={data.lowPrice}
                    placeholder="Enter the price per low seat"
                  />
                  <p className="text-red-500">{fields.lowPrice.errors}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Middle Class Seats</Label>
                  <Input
                    type="text"
                    name={fields.middleSeats.name}
                    key={fields.middleSeats.key}
                    defaultValue={data.middleSeats}
                    placeholder="Enter the number of middle seats"
                  />
                  <p className="text-red-500">{fields.middleSeats.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Middle Class Seat Price</Label>
                  <Input
                    type="text"
                    name={fields.middlePrice.name}
                    key={fields.middlePrice.key}
                    defaultValue={data.middlePrice}
                    placeholder="Enter the price per middle seat"
                  />
                  <p className="text-red-500">{fields.middlePrice.errors}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Executive Class Seats</Label>
                  <Input
                    type="text"
                    name={fields.executiveSeats.name}
                    key={fields.executiveSeats.key}
                    defaultValue={data.executiveSeats}
                    placeholder="Enter the number of executive seats"
                  />
                  <p className="text-red-500">{fields.executiveSeats.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Executive Class Seat Price</Label>
                  <Input
                    type="text"
                    name={fields.executivePrice.name}
                    key={fields.executivePrice.key}
                    defaultValue={data.executivePrice}
                    placeholder="Enter the price per executive class seat"
                  />
                  <p className="text-red-500">{fields.executivePrice.errors}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Arrival Airport</Label>
                  <Input
                    type="text"
                    name={fields.arrivalAirport.name}
                    key={fields.arrivalAirport.key}
                    defaultValue={data.arrivalAirport}
                    placeholder="Enter the arrival airport"
                  />
                  <p className="text-red-500">{fields.arrivalAirport.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Departure Airport</Label>
                  <Input
                    type="text"
                    name={fields.departureAirport.name}
                    key={fields.departureAirport.key}
                    defaultValue={data.departureAirport}
                    placeholder="Enter the departure airport"
                  />
                  <p className="text-red-500">
                    {fields.departureAirport.errors}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-4 border-dashed border-2 border-gray-300 p-2 md:p-4 rounded-lg">
                <Label className="text-xl font-bold">Flight Images</Label>
                <Input
                  type="hidden"
                  value={images}
                  name={fields.flightImages.name}
                  key={fields.flightImages.key}
                  defaultValue={fields.flightImages.initialValue as string[]}
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
                    endpoint="flightImagesRoute"
                    config={{ cn: twMerge }}
                    className="bg-primary hover:bg-primary/70 rounded-lg mt-4  md:mt-8 text-background"
                    onClientUploadComplete={(res) => {
                      setImages(res.map((r) => r.url));
                      toast({
                        title: "Image Uploaded",
                        variant: "success",
                        description:
                          "The selected images, for the flight, have been uploaded successfully",
                      });
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        variant: "destructive",
                        title: "Error Uploading Flight Images",
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
            <SubmitButton
              text="Update Flight Details"
              loadingText="Updating Flight Details"
            />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
