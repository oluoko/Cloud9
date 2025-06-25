"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { bannerSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";

export async function createBanner(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/login");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      description: submission.value.description,
      destinationAirport: submission.value.destinationAirport,
      largeImageUrl: submission.value.largeImageUrl,
      smallImageUrl: submission.value.smallImageUrl,
      isActive: submission.value.isActive,
    },
  });
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function editBanner(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/login");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const bannerId = formData.get("bannerId") as string;
  const banner = await prisma.banner.update({
    where: {
      id: bannerId,
    },
    data: {
      title: submission.value.title,
      description: submission.value.description,
      destinationAirport: submission.value.destinationAirport,
      largeImageUrl: submission.value.largeImageUrl,
      smallImageUrl: submission.value.smallImageUrl,
      isActive: submission.value.isActive,
    },
  });

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBanner(bannerId: string) {
  const user = await getUserByClerkId();
  if (!user) {
    return redirect("/login");
  }

  await prisma.banner.delete({
    where: {
      id: bannerId,
    },
  });

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}
