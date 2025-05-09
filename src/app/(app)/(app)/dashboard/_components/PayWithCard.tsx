"use client";

import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useEffect, useState } from "react";
import CheckOut from "./CheckOut";
import { Elements } from "@stripe/react-stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface PayWithCardProps {
  User: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    phoneNumber: string | null;
  };
}

export default function PayWithCard({
  amount,
  user,
  flightId,
  seatCount,
  seatType,
}: {
  amount: number;
  flightId: string;
  seatCount?: number;
  seatType?: string;
  user: PayWithCardProps["User"];
}) {
  return (
    <div className="p-4 h-[85vh] overflow-scroll">
      <h1 className="text-xl font-bold">
        <span className="text-2xl font-black">{user?.firstName}</span>,
        you&apos;re about to complete a booking.
      </h1>
      <p className=" my-3 text-lg text-gray-500">
        Fill in your details to complete payment of{" "}
        <span className="text-foreground font-bold">Ksh {amount}</span> for{" "}
        <span className="text-foreground font-bold">{seatType} class</span> to
        complete your booking.
      </p>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "kes",
        }}
      >
        <CheckOut amount={amount} />
      </Elements>
    </div>
  );
}
