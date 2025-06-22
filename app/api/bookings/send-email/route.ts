import { sendBookingReminderEmail } from "@/lib/mail";
import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, email } = await request.json();

    if (!bookingId || !email) {
      return new Response(
        JSON.stringify({ error: "A crucial field is not provided." }),
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found." }), {
        status: 404,
      });
    }

    await sendBookingReminderEmail(booking, email);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Failed to send message." }), {
      status: 500,
    });
  }
}
