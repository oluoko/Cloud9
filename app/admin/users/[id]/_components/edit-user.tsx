"use client";

import { updateUserProfile } from "@/actions/users";
import { SubmitButton } from "@/components/custom-button";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import LoadingDots from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe } from "@/contexts/use-user";
import { userRoles } from "@/lib/enums";
import { defaultProfileImage, getImageKey } from "@/lib/utils";
import { profileSchema } from "@/lib/zodSchemas";
import { UploadButton } from "@/utils/uploadthing";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { User } from "@prisma/client";
import axios from "axios";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function EditUser({ user }: { user: User }) {
  const { me, isLoading } = useMe();
  const [profileImage, setProfileImage] = useState(
    user.profileImage || undefined
  );
  const [lastResult, action] = useFormState(updateUserProfile, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: profileSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

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
      toast.success("Profile image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete profile image");
      console.error("Error deleting image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingDots text="Loading your details" />
      </div>
    );
  }

  // if (error) {
  //   return <div className="p-4 text-red-500">{error}</div>;
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit User</CardTitle>
        <CardDescription className="text-muted-foreground">
          Update user details and role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
          <input type="hidden" name="userId" value={user.id} />
          <div className="flex justify-between space-x-4">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <input
                type="hidden"
                value={profileImage}
                key={fields.profileImage.key}
                name={fields.profileImage.name}
                defaultValue={fields.profileImage.initialValue as string}
              />
              {profileImage ? (
                <div className="relative size-[60px] md:size-[100px] rounded-full hover:border hover:border-primary">
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
              <div className="grid md:flex gap-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    key={fields.firstName.key}
                    name={fields.firstName.name}
                    defaultValue={user.firstName || ""}
                    placeholder="Change user's first name"
                  />
                  <p className="text-red-500">{fields.firstName.errors}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    key={fields.lastName.key}
                    name={fields.lastName.name}
                    defaultValue={user.lastName || ""}
                    placeholder="Change user's  last name"
                  />
                  <p className="text-red-500">{fields.lastName.errors}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  key={fields.role.key}
                  name={fields.role.name}
                  defaultValue={user.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent className="flex-1">
                    {userRoles.map((role) => (
                      <SelectItem key={role.id} value={role.value}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-red-500">{fields.role.errors}</p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-2 w-full">
        {/* <SubmitButton
          
          text="Update User"
          loadingText="Updating User"
          className="w-full md:w-max"
        /> */}
        <Button type="submit" form={form.id} className="w-full md:w-max">
          Update User
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full md:w-max">
              Delete User
            </Button>
          </DialogTrigger>
          <DialogContent>
            {me?.role === "MAIN_ADMIN" ? (
              <>
                <DialogTitle>Delete User</DialogTitle>
                <DeleteConfirmation
                  id={user.id}
                  title={user.email}
                  modelType="user"
                />
              </>
            ) : (
              <>
                <DialogTitle className="text-red-500">
                  Permission Denied
                </DialogTitle>
                <p className="text-red-400">
                  You can view and update this user, but you do not have
                  permission to delete this user.
                </p>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
