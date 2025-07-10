"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage({
  params,
}: {
  params: { bookingId: string; flightId: string };
}) {
  const { bookingId, flightId } = params;

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Card className="w-[80vw] md:w-[50vw]">
        <div className="p-6 w-full">
          <div className="flex justify-center">
            <Check className="size-12 rounded-full bg-green-500/30 hover:bg-green-700/30 text-green-500 p-2" />
          </div>
          <div className="mt-3 text-center w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment Successful
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Your payment was successful. You will receive an email with the
              details shortly. If it is not in the main inbox, be sure to check
              the spam. We hope you enjoy your flight. Thank you for flying with
              us.
            </p>

            <div className="flex w-full gap-2 my-2 mt-4">
              <Link href={`/bookings/${bookingId}`} className="w-full">
                <Button className="w-full">View Booking</Button>
              </Link>
              <Link href={`/flights/${flightId}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Flight
                </Button>
              </Link>
            </div>

            <Link href="/">
              <Button className="w-full my-2" variant="primaryOutline">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
