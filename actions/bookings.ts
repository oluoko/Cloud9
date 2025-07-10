"use server";

import { getUserByClerkId } from "@/lib/auth";
import { bookingSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBooking(preveState: unknown, formData: FormData) {
  const user = await getUserByClerkId();

  if (!user) {
    return redirect("/login");
  }

  const bookingId = formData.get("bookingId") as string;

  const flightId = formData.get("flightId") as string;

  const submission = parseWithZod(formData, {
    schema: bookingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Logic to update the booking

  if (user.role === "ADMIN" || user.role === "MAIN_ADMIN") {
    return redirect("/admin/bookings");
  }

  return redirect("/bookings");
}

export async function deleteBooking(bookingId: string) {
  const user = await getUserByClerkId();

  if (!user) {
    return redirect("/login");
  }

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });

  revalidatePath("/bookings");
  revalidatePath("/admin/bookings");

  if (user.role === "ADMIN" || user.role === "MAIN_ADMIN") {
    return redirect("/admin/bookings");
  }

  return redirect("/bookings");
}
