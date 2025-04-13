// app/api/booking/check-reference/route.ts
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Check if a booking exists with this payment reference
    const booking = await prisma.booking.findFirst({
      where: { paymentReference: reference },
    });

    if (booking) {
      return NextResponse.json({
        bookingId: booking.id,
        status: "success",
      });
    } else {
      return NextResponse.json({
        message: "Booking not found for this reference",
        status: "pending",
      });
    }
  } catch (error) {
    console.error("Error checking booking reference:", error);
    return NextResponse.json(
      { error: "Failed to check booking reference" },
      { status: 500 }
    );
  }
}
