"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import {
  payWithCardSchema,
} from "@/lib/zodSchemas";
import prisma from "@/utils/db";
import { getUserByClerkId } from "@/lib/auth";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function payUsingCard(prevState: unknown, formData: FormData) {
  const user = await getUserByClerkId();

  if (!user) {
    return redirect("/sign-in");
  }

  const submission = parseWithZod(formData, {
    schema: payWithCardSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flight = await prisma.flight.findUnique({
    where: {
      id: submission.value.flightId,
    },
  });

  console.log("Payment Details:: ", {
    "Flight Id": submission.value.flightId,
    "Total Amount": submission.value.amount,
    "Seat Type": submission.value.seatType,
    "Seat Count": submission.value.seatCount,
  });

  if (flight) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "kes",
              unit_amount: submission.value.amount * 100,
              product_data: {
                name: flight.flightName,
                images: flight.flightImages,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          flightId: flight.id,
          seatType: submission.value.seatType,
          seatCount: submission.value.seatCount,
        },
      });

      if (session.url) {
        return redirect(session.url);
      } else {
        // Handle the case where session.url is null
        return { error: "Failed to create checkout session" };
      }
    } catch (error) {
      console.error("Stripe session creation failed:", error);
      return { error: "Payment processing failed. Please try again." };
    }
  }
}
