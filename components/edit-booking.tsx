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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe } from "@/contexts/use-user";
import { ErrorImage } from "@/components/error-image";
import {
  Plane,
  Users,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Settings,
} from "lucide-react";
import Separator from "@/components/custom-separator";

export default function EditBooking({ booking }: { booking: Booking }) {
  const { flights, isLoading, error } = useFlights();
  const { me, isLoading: isUserLoading, error: isUserError } = useMe();
  const [lastResult, action] = useFormState(updateBooking, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bookingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  if (isLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingDots text="Loading booking details" />
      </div>
    );
  }

  if (error || isUserError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-sm text-destructive">{error || isUserError}</p>
        </div>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return <ItemNotFound item="flights" />;
  }

  if (!me) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ErrorImage />
        <p className="mt-4 text-sm text-destructive">User not found</p>
      </div>
    );
  }

  const getSeatTypeIcon = (seatType: string) => {
    switch (seatType.toLowerCase()) {
      case "executive":
        return <MapPin className="h-4 w-4" />;
      case "middle":
        return <Users className="h-4 w-4" />;
      default:
        return <Plane className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Current Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-lg text-green-600">
                  Ksh {booking.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Edit Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
            className="space-y-6"
          >
            <input type="hidden" name="bookingId" value={booking.id} />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
                <Label
                  htmlFor={fields.flightId.name}
                  className="text-sm font-medium"
                >
                  Select Flight
                </Label>
              </div>
              <Select
                name={fields.flightId.name}
                defaultValue={booking.flightId}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a flight" />
                </SelectTrigger>
                <SelectContent>
                  {flights.map((flight) => (
                    <SelectItem key={flight.id} value={flight.id}>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {flight.flightName} - {flight.airlineName}
                        </span>
                        <span className="text-muted-foreground">
                          ({flight.departureAirport} → {flight.arrivalAirport})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fields.flightId.errors && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {fields.flightId.errors}
                </p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getSeatTypeIcon(booking.seatType)}
                  <Label
                    htmlFor={fields.seatType.name}
                    className="text-sm font-medium"
                  >
                    Seat Type
                  </Label>
                </div>
                <Select
                  name={fields.seatType.name}
                  defaultValue={booking.seatType}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select seat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        Low Class
                      </div>
                    </SelectItem>
                    <SelectItem value="middle">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Middle Class
                      </div>
                    </SelectItem>
                    <SelectItem value="executive">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Executive Class
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fields.seatType.errors && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fields.seatType.errors}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label
                    htmlFor={fields.seatCount.name}
                    className="text-sm font-medium"
                  >
                    Number of Seats
                  </Label>
                </div>
                <Input
                  type="number"
                  name={fields.seatCount.name}
                  key={fields.seatCount.key}
                  defaultValue={booking.seatCount}
                  min="1"
                  max="10"
                  placeholder="Enter number of seats"
                  className="h-11"
                />
                {fields.seatCount.errors && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fields.seatCount.errors}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="pt-4">
              <SubmitButton
                text="Update Booking"
                loadingText="Updating Booking..."
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
