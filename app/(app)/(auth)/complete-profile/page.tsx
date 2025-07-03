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
import { toast } from "sonner";
import { SubmitButton } from "@/components/custom-button";
import { PhoneInput } from "@/components/phone-input";
import { defaultProfileImage, getImageKey } from "@/lib/utils";
import AuthLayout from "@/components/auth-layout";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/contexts/use-user";

export default function CompleteProfile() {
  const { isLoaded: isUserLoaded, user } = useUser();
  const {
    me,
    isLoading: isUserDataLoading,
    error: userError,
    mutate,
  } = useMe();
  const router = useRouter();

  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    defaultProfileImage()
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profileImage: undefined,
  });

  useEffect(() => {
    if (me) {
      setProfileImage(me.profileImage || undefined);
      setPhoneNumber(me.phoneNumber || "");
      setFormData({
        firstName: me.firstName || "",
        lastName: me.lastName || "",
        phoneNumber: me.phoneNumber || "",
        profileImage: me.profileImage || undefined,
      });

      if (me.phoneNumber) {
        setProfileComplete(true);
        window.location.replace("/");
      }
    }
  }, [me]);

  useEffect(() => {
    if (userError) {
      setError(`Failed to load user details: ${userError.message}`);
    }
  }, [userError]);

  const handleInputChange = (field: keyof Partial<User>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      if (imageUrl !== defaultProfileImage()) {
        if (
          !confirm(
            "Are you sure you want to delete your profile image? This action cannot be undone."
          )
        ) {
          return;
        }

        await axios.post("/api/uploadthing/delete", {
          imageKey: getImageKey(imageUrl),
        });
      } else {
      }

      setProfileImage(undefined);
      setFormData((prev) => ({
        ...prev,
        profileImage: undefined,
      }));
      toast.success("Profile image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete profile image");
      console.error("Error deleting image:", error);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const updateData = {
        ...formData,
        phoneNumber: phoneNumber,
        profileImage: profileImage,
      };

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await mutate();

      toast.success("Profile updated successfully");
      setProfileComplete(true);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (!isUserLoaded || isUserDataLoading) {
    return (
      <Loader mainText="Loading your profile" subText="Please wait a moment" />
    );
  }

  const isOAuthUser = Boolean(user?.firstName || user?.lastName);

  if (error) {
    return (
      <div className="relative flex flex-col items-center justify-center">
        <Card className="mx-2">
          <CardContent className="p-6">
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              {isOAuthUser ? (
                <div className="hidden">
                  <Input type="hidden" value={user?.firstName || ""} />
                  <Input type="hidden" value={user?.lastName || ""} />
                </div>
              ) : (
                <div className="flex justify-between space-x-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
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
                        className="bg-primary hover:bg-primary/70 rounded-lg mt-4  md:mt-8 text-background"
                        onClientUploadComplete={(res) => {
                          setProfileImage(res[0].url);
                          toast.success(
                            "Profile image has been uploaded successfully"
                          );
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error! : ${error.message}`);
                        }}
                      />
                    )}
                  </div>
                  <div className="">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter your last name"
                      />
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
                  international={false}
                  placeholder="Enter a phone number"
                />
              </div>

              {profileComplete ? (
                <div className="grid gap-4 w-full h-auto">
                  <Link href="/profile">
                    <Button asChild variant="primaryOutline" className="w-full">
                      Go to Profile
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button asChild variant="outline" className="w-full">
                      Go to Home
                    </Button>
                  </Link>
                  <Link href="/flights">
                    <Button asChild variant="outline" className="w-full">
                      Book a flight
                    </Button>
                  </Link>
                </div>
              ) : (
                <SubmitButton
                  type="submit"
                  text="Complete Profile"
                  loadingText="Completing Profile"
                  className="w-full"
                  isPending={updating}
                  disabled={updating || isUserDataLoading}
                />
              )}
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
