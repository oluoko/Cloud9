"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { defaultProfileImage } from "@/lib/utils";

export async function completeProfile(prevState: unknown, formData: FormData) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return redirect("/login");
    }

    const submission = parseWithZod(formData, {
      schema: profileSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        firstName: submission.value.firstName,
        lastName: submission.value.lastName,
        phoneNumber: submission.value.phoneNumber,
        profileImage: submission.value.profileImage || defaultProfileImage(),
      },
    });

    return { success: true, redirectTo: "/" };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      status: "error" as const,
      error: "Failed to update profile. Please try again.",
    };
  }
}

export async function updateUserRole(userId: string) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return redirect("/login");
    }

    if (user.role !== "MAIN_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userExists = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: {
        clerkUserId: userId,
      },
      data: {
        role: userExists.role === "USER" ? "ADMIN" : "USER",
      },
    });

    revalidatePath("/admin/users");
    return { success: true, redirectTo: "/" };
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
      where: { clerkUserId: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const clerk = await clerkClient();

    await prisma.user.delete({
      where: { id: userId },
    });

    await clerk.users.deleteUser(userId);

    return NextResponse.json({
      message: "The user profile has been deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
