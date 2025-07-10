"use server";

import { getUserByClerkId } from "@/lib/auth";
import { bookingSchema } from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBooking(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();

  if (!user) {
    return redirect("/login");
  }

  const bookingId = formData.get("bookingId") as string;

  // Validate that the booking exists and belongs to the user (unless admin)
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { Flight: true },
  });

  if (!existingBooking) {
    return {
      status: "error" as const,
      error: { bookingId: ["Booking not found"] },
    };
  }

  // Check if user owns this booking (unless admin)
  if (user.role === "USER" && existingBooking.userId !== user.id) {
    return {
      status: "error" as const,
      error: { bookingId: ["You don't have permission to edit this booking"] },
    };
  }

  const submission = parseWithZod(formData, {
    schema: bookingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const {
    flightId,
    seatType,
    seatCount,
    paymentMethod,
    paymentStatus,
    bookingStatus,
  } = submission.value;

  // Get the selected flight to calculate new total amount
  const selectedFlight = await prisma.flight.findUnique({
    where: { id: flightId },
  });

  if (!selectedFlight) {
    return {
      status: "error" as const,
      error: { flightId: ["Selected flight not found"] },
    };
  }

  // Calculate total amount based on seat type and count
  let pricePerSeat: number;
  let availableSeats: number;

  switch (seatType) {
    case "low":
      pricePerSeat = selectedFlight.lowPrice;
      availableSeats = selectedFlight.lowSeats;
      break;
    case "middle":
      pricePerSeat = selectedFlight.middlePrice;
      availableSeats = selectedFlight.middleSeats;
      break;
    case "executive":
      pricePerSeat = selectedFlight.executivePrice;
      availableSeats = selectedFlight.executiveSeats;
      break;
    default:
      return {
        status: "error" as const,
        error: { seatType: ["Invalid seat type"] },
      };
  }

  // Check seat availability (you might want to implement more sophisticated seat management)
  if (seatCount > availableSeats) {
    return {
      status: "error" as const,
      error: {
        seatCount: [`Only ${availableSeats} ${seatType} class seats available`],
      },
    };
  }

  const totalAmount = pricePerSeat * seatCount;

  // Prepare update data - only include admin fields if user is admin
  const updateData: any = {
    flightId,
    seatType,
    seatCount,
    paymentMethod,
    totalAmount,
  };

  // Only admins can update payment and booking status
  if (user.role === "ADMIN" || user.role === "MAIN_ADMIN") {
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (bookingStatus) updateData.bookingStatus = bookingStatus;
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    revalidatePath("/bookings");
    revalidatePath("/admin/bookings");

    // Redirect based on user role
    if (user.role === "ADMIN" || user.role === "MAIN_ADMIN") {
      return redirect("/admin/bookings");
    }

    return redirect("/bookings");
  } catch (error) {
    console.error("Error updating booking:", error);
    return {
      status: "error" as const,
      error: { bookingId: ["Failed to update booking. Please try again."] },
    };
  }
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
