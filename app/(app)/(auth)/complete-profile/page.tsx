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
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { completeProfile } from "@/actions/users";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/custom-button";
import { profileSchema } from "@/lib/zodSchemas";
import { PhoneInput } from "@/components/phone-input";
import { defaultProfileImage, getImageKey } from "@/lib/utils";
import AuthLayout from "@/components/auth-layout";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

export default function CompleteProfile() {
  const { isLoaded: isUserLoaded, user } = useUser();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);
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

  const [lastResult, action] = useFormState(completeProfile, undefined);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Error while fetching user");
        }
        const userData = await response.json();
        setCurrentUser(userData);
        setProfileImage(userData.profileImage);
        setPhoneNumber(userData.phoneNumber || "");
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phoneNumber: userData.phoneNumber || "",
          profileImage: userData.profileImage,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(`Failed to load user details: ${err}`);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (field: keyof Partial<User>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      await axios.post("/api/uploadthing/delete", {
        imageKey: getImageKey(imageUrl),
      });

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

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      toast.success("Profile updated successfully");
      router.push("/");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (!isUserLoaded) {
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

              <SubmitButton
                type="submit"
                text="Complete Profile"
                loadingText="Completing Profile"
                className="w-full"
                isPending={updating}
                disabled={updating || loading}
              />
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
