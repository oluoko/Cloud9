import { getUserByClerkId, getUserById } from "@/lib/auth";
import { sendBookingDetailsEmail } from "@/lib/mail";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const loggedInUser = await getUserByClerkId();

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const {
      totalAmount,
      bookingStatus,
      paymentMethod,
      userId,
      flightId,
      seatType,
      seatCount,
      paymentIntentId,
    } = await request.json();

    // Validate required fields
    if (!totalAmount || !flightId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        totalAmount: totalAmount,
        bookingStatus: bookingStatus || "complete",
        paymentMethod: paymentMethod || "Stripe",
        userId: userId,
        flightId: flightId,
        seatType: seatType || "",
        seatCount: parseInt(seatCount) || 1,
        paymentReference: paymentIntentId || "",
      },
    });

    const user = await getUserById(userId);

    await sendBookingDetailsEmail(booking, user);

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
