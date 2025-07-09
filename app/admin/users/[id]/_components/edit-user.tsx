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
            "Are you sure you want to delete the user's profile image? This action cannot be undone."
          )
        ) {
          return;
        }
        await axios.post("/api/uploadthing/delete", {
          imageKey: getImageKey(imageUrl),
        });
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
      <div className="flex items-center justify-center p-8">
        <LoadingDots text="Loading your details" />
      </div>
    );
  }

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="userId" value={user.id} />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="text-2xl font-bold">Edit User</CardTitle>
          <CardDescription>Update user details and role</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 pb-6">
            <Label className="text-sm font-medium">Profile Image</Label>
            <input
              type="hidden"
              value={profileImage}
              key={fields.profileImage.key}
              name={fields.profileImage.name}
              defaultValue={fields.profileImage.initialValue as string}
            />

            {profileImage ? (
              <div className="relative">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-muted hover:border-primary transition-colors">
                  <Image
                    src={profileImage}
                    alt="Profile Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => handleDeleteImage(profileImage)}
                  type="button"
                  className="absolute -top-2 -right-2 cursor-pointer bg-red-500 hover:bg-red-600 p-1.5 rounded-full text-white transition-colors"
                  title="Delete Image"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint="profileImageRoute"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                onClientUploadComplete={(res) => {
                  setProfileImage(res[0].url);
                  toast.success("Profile image uploaded successfully");
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  key={fields.firstName.key}
                  name={fields.firstName.name}
                  defaultValue={user.firstName || ""}
                  placeholder="First name"
                  className="w-full"
                />
                {fields.firstName.errors && (
                  <p className="text-sm text-red-500">
                    {fields.firstName.errors}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  key={fields.lastName.key}
                  name={fields.lastName.name}
                  defaultValue={user.lastName || ""}
                  placeholder="Last name"
                  className="w-full"
                />
                {fields.lastName.errors && (
                  <p className="text-sm text-red-500">
                    {fields.lastName.errors}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                key={fields.role.key}
                name={fields.role.name}
                defaultValue={user.role}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.id} value={role.value}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fields.role.errors && (
                <p className="text-sm text-red-500">{fields.role.errors}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <SubmitButton
            text="Update User"
            loadingText="Updating User"
            className="w-full sm:w-auto sm:flex-1"
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
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
    </form>
  );
}
