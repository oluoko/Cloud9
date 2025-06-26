"use client";

import { createFlight } from "@/actions/flights";
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
import { DateTimePicker } from "../../_components/DateTimePicker";
import { SubmitButton } from "@/components/custom-button";
import axios from "axios";
import { getImageKey } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

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

  const handleDeleteImage = async (index: number) => {
    await axios.post("/api/uploadthing/delete", {
      imageKey: getImageKey(images[index]),
    });
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
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
                    defaultValue={fields.flightName.value}
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
                    defaultValue={fields.airlineName.value}
                    placeholder="Enter the name of the Airline"
                  />
                  <p className="text-red-500">{fields.airlineName.errors}</p>
                </div>
              </div>

              <DateTimePicker
                dateFieldName={fields.flightDate.name}
                timeFieldName={fields.flightTime.name}
                dateFieldValue={fields.flightDate.value}
                timeFieldValue={fields.flightTime.value}
                dateFieldKey={fields.flightDate.key}
                timeFieldKey={fields.flightTime.key}
                dateFieldErrors={fields.flightDate.errors}
                timeFieldErrors={fields.flightTime.errors}
              />

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Economy Seats</Label>
                  <Input
                    type="text"
                    name={fields.economySeats.name}
                    key={fields.economySeats.key}
                    defaultValue={fields.economySeats.value}
                    placeholder="Enter the number of economy seats"
                  />
                  <p className="text-red-500">{fields.economySeats.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Economy Seat Price</Label>
                  <Input
                    type="text"
                    name={fields.economyPrice.name}
                    key={fields.economyPrice.key}
                    defaultValue={fields.economyPrice.value}
                    placeholder="Enter the price per economy seat"
                  />
                  <p className="text-red-500">{fields.economyPrice.errors}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Business Seats</Label>
                  <Input
                    type="text"
                    name={fields.businessSeats.name}
                    key={fields.businessSeats.key}
                    defaultValue={fields.businessSeats.value}
                    placeholder="Enter the number of business seats"
                  />
                  <p className="text-red-500">{fields.businessSeats.errors}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Business Seat Price</Label>
                  <Input
                    type="text"
                    name={fields.businessPrice.name}
                    key={fields.businessPrice.key}
                    defaultValue={fields.businessPrice.value}
                    placeholder="Enter the price per business seat"
                  />
                  <p className="text-red-500">{fields.businessPrice.errors}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>First Class Seats</Label>
                  <Input
                    type="text"
                    name={fields.firstClassSeats.name}
                    key={fields.firstClassSeats.key}
                    defaultValue={fields.firstClassSeats.value}
                    placeholder="Enter the number of first class seats"
                  />
                  <p className="text-red-500">
                    {fields.firstClassSeats.errors}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>First Class Seat Price</Label>
                  <Input
                    type="text"
                    name={fields.firstClassPrice.name}
                    key={fields.firstClassPrice.key}
                    defaultValue={fields.firstClassPrice.value}
                    placeholder="Enter the price per first class seat"
                  />
                  <p className="text-red-500">
                    {fields.firstClassPrice.errors}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Arrival Airport</Label>
                  <Input
                    type="text"
                    name={fields.arrivalAirport.name}
                    key={fields.arrivalAirport.key}
                    defaultValue={fields.arrivalAirport.value}
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
                    defaultValue={fields.departureAirport.value}
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
              text="Create a Flight"
              loadingText="Creating Flight"
            />
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
