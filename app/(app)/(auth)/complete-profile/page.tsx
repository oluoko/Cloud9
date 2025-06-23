"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/loader";
import axios from "axios";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { updateProfile } from "@/actions/users";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/custom-button";
import { profileSchema } from "@/lib/zodSchemas";
import { PhoneInput } from "@/components/phone-input";
import { getImageKey } from "@/lib/utils";
import AuthLayout from "@/components/auth-layout";
import { twMerge } from "tailwind-merge";

export default function CompleteProfile() {
  const { toast } = useToast();
  const { isLoaded: isUserLoaded, user } = useUser();
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
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
    typeof fields.phoneNumber.value === "string" ? fields.phoneNumber.value : ""
  );

  useEffect(() => {
    if (lastResult?.success && lastResult?.redirectTo) {
      window.location.href = lastResult.redirectTo;
    }
  }, [lastResult]);

  useEffect(() => {
    if (isUserLoaded && user) {
      if (user.firstName) fields.firstName.initialValue = user.firstName;
      if (user.lastName) fields.lastName.initialValue = user.lastName;
    }
  }, [isUserLoaded, user, fields]);

  if (!isUserLoaded) {
    return (
      <Loader mainText="Loading your profile" subText="Please wait a moment" />
    );
  }

  const isOAuthUser = Boolean(user?.firstName || user?.lastName);

  const handleDeleteImage = async (imageUrl: string) => {
    await axios.post("/api/uploadthing/delete", {
      imageKey: getImageKey(imageUrl),
    });
    setProfileImage(undefined);
  };

  return (
    <AuthLayout mode="register">
      <div className="flex flex-col items-center justify-center">
        <Card className="mx-2">
          <CardHeader>
            <CardTitle className="font-bold text-center text-2xl">
              Complete Your Profile
              <div className="font-normal text-sm text-muted-foreground mt-2">
                {isOAuthUser
                  ? "Please provide your phone number to complete your profile"
                  : "Please provide your details to complete your profile"}
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
              {isOAuthUser ? (
                <div className="hidden">
                  <Input
                    type="hidden"
                    name={fields.firstName.name}
                    value={user?.firstName || ""}
                  />
                  <Input
                    type="hidden"
                    name={fields.lastName.name}
                    value={user?.lastName || ""}
                  />
                </div>
              ) : (
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
                        config={{ cn: twMerge }}
                        className="bg-primary hover:bg-primary/70 text-background"
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
                        defaultValue={fields.firstName.value}
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
                        defaultValue={fields.lastName.value}
                      />
                      <p className="text-red-500">{fields.lastName.errors}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Phone Number</Label>

                <PhoneInput
                  value={phoneNumber}
                  onChange={(value) =>
                    setPhoneNumber(value ? String(value) : "")
                  }
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

              <SubmitButton text="Complete Profile" />
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              This information helps us provide you with a better experience
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  );
}
