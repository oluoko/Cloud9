"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";

export async function updateProfile(prevState: unknown, formData: FormData) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return redirect("/sign-in");
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
        profileImage: submission.value.profileImage || undefined,
      },
    });

    // Redirects in server actions need special handling
    return { success: true, redirectTo: "/" };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      status: "error" as const,
      error: "Failed to update profile. Please try again.",
    };
  }
}

export async function editProfile(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/sign-in");
  }

  const submission = parseWithZod(formData, {
    schema: profileSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const userId = formData.get("userId") as string;

  await prisma.user.update({
    where: {
      clerkUserId: userId,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      phoneNumber: submission.value.phoneNumber,
      profileImage: submission.value.profileImage || undefined,
    },
  });

  revalidatePath("/");
  redirect("/profile");
}
