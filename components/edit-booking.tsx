"use client";

import { updateBooking } from "@/actions/bookings";
import { bookingSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Booking } from "@prisma/client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/custom-button";
import { useFlights } from "@/contexts/use-flights";
import ItemNotFound from "@/components/item-not-found";
import LoadingDots from "@/components/loading-dots";

export default function EditBooking({ booking }: { booking: Booking }) {
  const { flights, isLoading, error } = useFlights();

  const [lastResult, action] = useFormState(updateBooking, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bookingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingDots text="Loading booking details" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!flights || flights.length === 0) {
    return <ItemNotFound item="flights" />;
  }

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="bookingId" value={booking.id} />

      <>
        {flights.map((flight) => (
          <div key={flight.id}></div>
        ))}
      </>
      <SubmitButton
        text="Update Booking"
        loadingText="Updating Booking"
        className="w-full"
      />
    </form>
  );
}
