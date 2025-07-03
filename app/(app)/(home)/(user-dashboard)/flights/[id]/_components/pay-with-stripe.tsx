"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/utils";
import StripeCheckOut from "./stripe-checkout";
import LoadingDots from "@/components/loading-dots";
import { useMe } from "@/contexts/use-user";

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
  const { me, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingDots text="Loading your details" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load user details: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {me?.firstName}, you&apos;re about to complete a booking.
        </h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Fill in your details to complete payment of{" "}
          <span className="font-semibold">Ksh {amount}</span> for{" "}
          <span className="font-semibold">{seatType}</span> class to complete
          your booking.{" "}
          <span className="text-sm text-blue-600">
            Use the account number{" "}
            <span className="font-mono">4242 4242 4242 4242</span>. You
            won&apos;t be charged
          </span>
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <StripeCheckOut
          amount={convertToSubcurrency(amount)}
          flightId={flightId}
          seatCount={seatCount}
          seatType={seatType}
        />
      </Elements>
    </div>
  );
}
