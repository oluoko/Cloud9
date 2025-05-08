import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/utils/db";
import { Sucess } from "@/components/Messages";

interface BookingPageProps {
  params: {
    id: string;
  };
}

async function getBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        Flight: true,
        User: true,
      },
    });

    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export default async function BookingDetailsPage({ params }: BookingPageProps) {
  const booking = await getBooking(params.id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Sucess message="Your booking was successful!" />

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Flight Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Airline:</span>{" "}
                {booking.Flight?.airlineName}
              </p>
              <p>
                <span className="font-medium">Flight:</span>{" "}
                {booking.Flight?.flightName}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {booking.Flight?.flightDate}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {booking.Flight?.flightTime}
              </p>
              <p>
                <span className="font-medium">From:</span>{" "}
                {booking.Flight?.departureAirport}
              </p>
              <p>
                <span className="font-medium">To:</span>{" "}
                {booking.Flight?.arrivalAirport}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Booking Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Booking ID:</span> {booking.id}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {booking.bookingStatus}
              </p>
              <p>
                <span className="font-medium">Seat Type:</span>{" "}
                {booking.seatType}
              </p>
              <p>
                <span className="font-medium">Number of Seats:</span>{" "}
                {booking.seatCount}
              </p>
              <p>
                <span className="font-medium">Payment Reference:</span>{" "}
                {booking.paymentReference}
              </p>
              <p>
                <span className="font-medium">Amount Paid:</span> KES{" "}
                {booking.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {booking.passengerNames && booking.passengerNames.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Passenger Details</h2>
            <ul className="list-disc pl-5">
              {booking.passengerNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Thank you for booking with us. If you have any questions, please
            contact our support team.
          </p>

          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/flights">Find More Flights</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
