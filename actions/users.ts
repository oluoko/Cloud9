"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";
import { parseWithZod } from "@conform-to/zod";
import { profileSchema } from "@/lib/zodSchemas";

export async function updateUserProfile(
  prevState: unknown,
  formData: FormData
) {
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
      return {
        status: "error" as const,
        error: {
          "": ["User not found"],
        },
      };
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
    return {
      status: "error" as const,
      error: {
        "": ["Unauthorized access"],
      },
    };
  }
}

export async function deleteUserProfile(userId: string) {
  const user = await getUserByClerkId();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "MAIN_ADMIN") {
    return {
      status: "error" as const,
      error: {
        "": ["Unauthorized access"],
      },
    };
  }

  const userExists = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!userExists) {
    return {
      status: "error" as const,
      error: {
        "": ["User not found"],
      },
    };
  }

  const clerk = await clerkClient();
  await prisma.user.delete({
    where: { clerkUserId: userId },
  });
  await clerk.users.deleteUser(userId);

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  redirect("/admin/users");
}
