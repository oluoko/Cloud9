"use client";

import { Loader2 } from "lucide-react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import convertToSubcurrency from "@/lib/utils";
import { User } from "@prisma/client";
import { SubmitButton } from "@/components/custom-button";

export default function StripeCheckOut({
  amount,
  flightId,
  seatType,
  seatCount,
}: {
  amount: number;
  flightId: string;
  seatType?: string;
  seatCount?: number;
}) {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user ID for booking
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setUser(data);
        }
      })
      .catch((err) => console.error("Error fetching user ID:", err));

    // Create payment intent
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, clientSecret]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success/${user?.id}/${flightId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment successful, create booking
      try {
        const bookingResponse = await fetch("/api/bookings/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount: amount,
            bookingStatus: "complete",
            paymentMethod: "Stripe",
            userId: user?.id,
            flightId: flightId,
            seatType: seatType || "",
            seatCount: seatCount || 1,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (bookingResponse.ok) {
          const bookingData = await bookingResponse.json();

          // Redirect to success page
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success/${bookingData.booking.id}/${flightId}`;
        } else {
          setErrorMessage("Payment succeeded but booking creation failed");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error creating booking:", err);
        setErrorMessage("Payment succeeded but booking creation failed");
        setLoading(false);
      }
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="mr-4 size-4 md:size-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <SubmitButton
        disabled={loading}
        text={`Complete Payment of Ksh ${amount}`}
        loadingText={`Processing Ksh ${amount}`}
        className="mt-4 w-full"
      />
    </form>
  );
}
