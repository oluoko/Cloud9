import { stripe } from "@/lib/stripe";
import prisma from "@/utils/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    return new Response(`Stripe Webhook Error:: ${error}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // const order = await prisma.booking.create({
      //   data: {
      //     totalAmount: session.amount_total as number,
      //     bookingStatus: session.status as string,
      //     paymentMethod: "Stripe",
      //     userId: session.metadata?.userId,
      //     flightId: session.metadata?.flightId,
      //     seatType: session.metadata?.seatType || "",
      //     seatCount: session.metadata?.seatCount,
      //   },
      // });

      break;
    }
    default: {
      console.log("Unhandled event type: ", event.type);
    }
  }

  return new Response(null, { status: 200 });
}
