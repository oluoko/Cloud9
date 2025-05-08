"use client";

import { payUsingCard } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { payWithCardSchema } from "@/lib/zodSchemas";
import { Loader2 } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

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
  flightId: string;
  seatCount: number;
}

export default function PayWithCard({
  amount,
  user,
  flightId,
  seatCount,
}: {
  amount: number;
  flightId: string;
  seatCount?: number;
  user: PayWithCardProps["User"];
}) {
  const { pending } = useFormStatus();

  const [lastResult, action] = useFormState(payUsingCard, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: payWithCardSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        <span className="text-2xl font-black">{user?.firstName}</span>,
        you&apos;re about to complete a booking.
      </h1>
      <p className=" my-3 text-lg text-gray-500">
        Please confirm your payment of{" "}
        <span className="text-foreground font-bold">Ksh {amount}</span> via
        card, to complete your booking.
      </p>

      <form action={action}>
        <input type="hidden" name="flightId" value={flightId} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="seatCount" value={seatCount} />
        {pending ? (
          <Button disabled size="lg" className="w-full mt-5">
            <Loader2 className="mr-4 size-4 md:size-6 animate-spin" />{" "}
            Processing Completing Payment...
          </Button>
        ) : (
          <Button size="lg" className="w-full mt-5" type="submit">
            Complete Payment
          </Button>
        )}
      </form>
    </div>
  );
}
