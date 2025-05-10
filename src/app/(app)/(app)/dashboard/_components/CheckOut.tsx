"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

export default function CheckOut({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

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

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success?amount=${amount}`,
      },
    });
    if (error) {
      // This point is only reached if there's an immediate error when
      //confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your ` return_url `
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
      {errorMessage && <div>{errorMessage}</div>}
      {loading ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-4 size-4 md:size-6 animate-spin" /> Processing
          Paying Ksh {amount} ...
        </Button>
      ) : (
        <Button size="lg" className="w-full mt-5">
          Complete Payment of Ksh {amount}
        </Button>
      )}
    </form>
  );
}
