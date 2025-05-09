import { NextRequest, NextResponse } from "next/server";

if (process.env.STRIPE_API_KEY === undefined) {
  throw new Error("STRIPE_API_KEY is not defined");
}

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "kes",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Intent Error:::: ", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
