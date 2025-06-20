"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/utils";
import StripeCheckOut from "./stripe-checkout";
import LoadingDots from "@/components/loading-dots";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PayWithStripe({
  amount,
  flightId,
  seatCount,
  seatType,
}: {
  amount: number;
  flightId: string;
  seatCount?: number;
  seatType?: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Error while fetching  user");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(`Failed to load user details:::: ${err}`);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <LoadingDots text="Loading your details" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="h-[70vh] md:h-[80vh] overflow-x-hidden overflow-y-scroll">
      <h1 className="text-xl font-bold">
        <span className="text-2xl font-black">{user?.firstName}</span>,
        you&apos;re about to complete a booking.
      </h1>
      <p className=" my-3 text-lg text-gray-500">
        Fill in your details to complete payment of{" "}
        <span className="text-foreground font-bold">Ksh {amount}</span> for{" "}
        <span className="text-foreground font-bold">{seatType} class</span> to
        complete your booking.{" "}
        <span className="text-sm text-muted">
          Use the account number{" "}
          <span className="font-bold">4242 4242 4242 4242</span>. You won&apos;t
          be charged
        </span>
      </p>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "kes",
        }}
      >
        <StripeCheckOut
          amount={amount}
          flightId={flightId}
          seatType={seatType}
          seatCount={seatCount}
        />
      </Elements>
    </div>
  );
}
