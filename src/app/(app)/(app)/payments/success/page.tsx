"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Extract parameters for booking if they exist
  const flightId = searchParams.get('flightId');
  const seatType = searchParams.get('seatType');
  const seatCount = searchParams.get('seatCount');
  const paymentIntentId = searchParams.get('paymentIntentId');

  useEffect(() => {
    // If we have query parameters for booking creation, create the booking
    if (flightId && paymentIntentId && !bookingId && !isLoading) {
      const createBooking = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/bookings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              totalAmount: Number(amount),
              bookingStatus: 'complete',
              paymentMethod: 'Stripe',
              flightId: flightId,
              seatType: seatType || '',
              seatCount: seatCount || 1,
              paymentIntentId: paymentIntentId
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to create booking');
          }
          
          const data = await response.json();
          setBookingId(data.booking.id);
        } catch (err) {
          console.error('Error creating booking:', err);
          setError('Payment was successful but we had trouble creating your booking. Please contact support.');
        } finally {
          setIsLoading(false);
        }
      };
      
      createBooking();
    }
  }, [amount, flightId, seatType, seatCount, paymentIntentId, bookingId, isLoading]);

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            {isLoading ? (
              <Loader2 className="size-12 rounded-full animate-spin text-primary p-2" />
            ) : (
              <Check className="size-12 rounded-full bg-green-500/30 hover:bg-green-700/30 text-green-500 p-2" />
            )}
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment Successful
            </h3>
            {error ? (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {isLoading ? "Processing your booking..." : 
                  `Congrats on your purchase${bookingId ? ` (Booking #${bookingId.substring(0, 8)})` : ''}. Your payment was successful. You will
                  receive an email with the details shortly. We hope you enjoy your
                  flight. Thank you for flying with us.`
                }
              </p>
            )}
            <Link href="/">
              <Button className="w-full mt-3 md:mt-5">Back to Homepage</Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}