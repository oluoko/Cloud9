"use client";

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
import { useMe } from "@/contexts/use-user";
import { User } from "@prisma/client";

export default function EditUser({ user }: { user: User }) {
  const { me, isLoading, error } = useMe();
  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingDots text="Loading your details" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit User</CardTitle>
        <CardDescription className="text-muted-foreground">
          Update user details and role.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4"></CardContent>

      <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-2 w-full">
        <SubmitButton
          text="Update User Role"
          loadingText="Updating Role"
          className="w-full md:w-max"
        />
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
                <p className="text-red-500">
                  You can view this user, but you do not have permission to
                  delete this user.
                </p>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
