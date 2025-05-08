"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { getImageKey } from "@/utils/utils";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { updateProfile } from "@/app/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/CustomButton";
import { profileSchema } from "@/lib/zodSchemas";
import { PhoneInput } from "@/components/ui/phone-input";
import ApplyAdmin from "./ApplyAdmin";

interface ProfileEditorProps {
  data: {
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    profileImage: string | null;
  };
}

export function ProfileEditor({ data }: ProfileEditorProps) {
  const { toast } = useToast();

  const [profileImage, setProfileImage] = useState<string | undefined>(
    data.profileImage || undefined
  );

  const [lastResult, action] = useFormState(updateProfile, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: profileSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [phoneNumber, setPhoneNumber] = useState<string>(
    typeof data.phoneNumber === "string" ? data.phoneNumber : ""
  );

  //   useEffect(() => {
  //     if (lastResult?.success && lastResult?.redirectTo) {
  //       window.location.href = lastResult.redirectTo;
  //     }
  //   }, [lastResult]);

  const handleDeleteImage = async (imageUrl: string) => {
    await axios.post("/api/uploadthing/delete", {
      imageKey: getImageKey(imageUrl),
    });
    setProfileImage(undefined);
  };
  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      <ApplyAdmin />
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="font-bold text-center text-2xl">
            Edit Your Profile Information
            <div className="font-normal text-sm text-muted-foreground mt-2">
              Please provide your profile information for editing
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
            className="space-y-4"
          >
            <input type="hidden" name="userId" value={data.clerkUserId} />
            <div className="flex justify-between space-x-4">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <Input
                  type="hidden"
                  value={profileImage || ""}
                  name={fields.profileImage.name}
                  key={fields.profileImage.key}
                  defaultValue={fields.profileImage.initialValue}
                />
                {profileImage ? (
                  <div className="relative size-[100px] rounded-full hover:border hover:border-primary">
                    <Image
                      src={profileImage}
                      alt="Profile Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                    <button
                      onClick={() => handleDeleteImage(profileImage)}
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 p-1 rounded-lg text-white"
                      title="Delete Image"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="profileImageRoute"
                    onClientUploadComplete={(res) => {
                      setProfileImage(res[0].url);
                      toast({
                        title: "Image Uploaded",
                        variant: "success",
                        description:
                          "Profile image has been uploaded successfully",
                      });
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        variant: "destructive",
                        title: "Error Uploading Profile Image",
                        description: `Error! : ${error.message}`,
                      });
                    }}
                  />
                )}
                <p className="text-red-500">{fields.profileImage.errors}</p>
              </div>
              <div className="">
                <div className="space-y-2 w-full">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name={fields.firstName.name}
                    key={fields.firstName.key}
                    defaultValue={data.firstName || ""}
                  />
                  <p className="text-red-500">{fields.firstName.errors}</p>
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name={fields.lastName.name}
                    key={fields.lastName.key}
                    defaultValue={data.lastName || ""}
                  />
                  <p className="text-red-500">{fields.lastName.errors}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>

              <PhoneInput
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value ? String(value) : "")}
                key={fields.phoneNumber.key}
                defaultValue={fields.phoneNumber.value}
                international={false}
                placeholder="Enter a phone number"
              />
              <Input
                type="hidden"
                name={fields.phoneNumber.name}
                value={phoneNumber || ""}
              />
              <p className="text-red-500">{fields.phoneNumber.errors}</p>
            </div>

            {lastResult && lastResult.status === "error" && (
              <Alert>
                <AlertDescription>{lastResult.error}</AlertDescription>
              </Alert>
            )}

            <SubmitButton text="Update Profile" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
