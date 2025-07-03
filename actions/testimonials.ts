"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { testimonialSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";

export async function createTestimonial(
  prevState: unknown,
  formData: FormData
) {
  const user = await getUserByClerkId();

  if (!user) return redirect("/login");

  const submission = parseWithZod(formData, {
    schema: testimonialSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.testimonial.create({
    data: {
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.profileImage || "",
      rating: submission.value.rating,
      comment: submission.value.comment,
      descriptiveTitle: submission.value.descriptiveTitle,
      user: {
        connect: { id: user.id },
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/profile");
}

export async function editTestimonial(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();

  if (!user) return redirect("/login");

  const submission = parseWithZod(formData, {
    schema: testimonialSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const testimonialId = formData.get("testimonialId") as string;

  await prisma.testimonial.update({
    where: {
      id: testimonialId,
    },
    data: {
      rating: submission.value.rating,
      comment: submission.value.comment,
      descriptiveTitle: submission.value.descriptiveTitle,
    },
  });

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/profile");
}

export async function deleteTestimonial(testimonialId: string) {
  const user = await getUserByClerkId();

  if (!user) return redirect("/login");

  await prisma.testimonial.delete({
    where: {
      id: testimonialId,
    },
  });

  revalidatePath("/");
  revalidatePath("/testimonials");
  redirect("/profile");
}
