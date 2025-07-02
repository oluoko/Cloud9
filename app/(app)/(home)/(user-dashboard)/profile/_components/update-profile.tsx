"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import { PhoneInput } from "@/components/phone-input";
import { getImageKey } from "@/lib/utils";
import { User } from "@prisma/client";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { DeleteButton, SubmitButton } from "@/components/custom-button";

interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage?: string;
}

export function UpdateProfile() {
  const router = useRouter();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false); // Separate state for delete operation
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profileImage: undefined,
  });

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
        setUser(userData);
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

  const handleInputChange = (
    field: keyof UpdateProfileFormData,
    value: string
  ) => {
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

  const handleUpdate = async (e: React.FormEvent) => {
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
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add confirmation dialog
    if (
      !confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete profile");
      }

      toast.success("Profile deleted successfully");
      router.push("/");
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError(err instanceof Error ? err.message : "Failed to delete profile");
      toast.error("Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Loader mainText="Loading your profile" subText="Please wait a moment" />
    );
  }

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
    <div className="relative flex flex-col items-center justify-center">
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
          <form className="space-y-4" onSubmit={handleUpdate}>
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
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <PhoneInput
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value ? String(value) : "")}
                international={false}
                placeholder="Enter a phone number"
              />
            </div>

            <div className="grid gap-2">
              <SubmitButton
                type="submit"
                text="Update Profile"
                loadingText="Updating Profile"
                isPending={updating}
                className="w-full"
                disabled={updating || deleting}
              />
              <DeleteButton
                type="button"
                onClick={handleDeleteProfile}
                text="Delete Profile"
                loadingText="Deleting Profile"
                isPending={deleting}
                className="w-full"
                disabled={updating || deleting}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
