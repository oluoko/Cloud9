"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { parseWithZod } from "@conform-to/zod";
import { profileSchema } from "@/lib/zodSchemas";

export async function updateUserProfile(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return redirect("/login");
    }

    if (user.role === "MAIN_ADMIN" || user.role === "ADMIN") {
      const userId = formData.get("userId") as string;

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const submission = parseWithZod(formData, {
        schema: profileSchema,
      });

      if (submission.status !== "success") {
        return submission.reply();
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          firstName: submission.value.firstName,
          lastName: submission.value.lastName,
          profileImage: submission.value.profileImage,
          role: submission.value.role,
        },
      });

      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/${userId}`);
      revalidatePath("/admin");
      redirect("/admin/users");
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      status: "error" as const,
      error: "Failed to update profile. Please try again.",
    };
  }
}

export async function deleteUserProfile(userId: string) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return redirect("/login");
    }

    if (user.role !== "MAIN_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const clerk = await clerkClient();

    await prisma.user.delete({
      where: { id: userId },
    });

    await clerk.users.deleteUser(userId);

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    redirect("/admin/users");
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
