import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/utils/db";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Plane,
  Clock,
  CreditCard,
  Users,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaPlane } from "react-icons/fa6";
import {
  capitalize,
  formatDate,
  formatISODateToTime,
  formatTime,
  getStatusBadgeVariant3,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SendEmail from "@/components/send-email";
import Footer from "@/components/footer";

interface BookingPageProps {
  params: {
    id: string;
  };
}

async function getBookingDetails(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        Flight: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export default async function BookingDetailsPage({ params }: BookingPageProps) {
  const booking = await getBookingDetails(params.id);

  if (!booking) {
    notFound();
  }

  const flightDate = formatDate(booking.Flight?.flightDate);
  const flightTime = formatTime(booking.Flight?.flightTime);
  const bookingDate = formatDate(booking.createdAt);
  console.log(booking.createdAt);
  const bookingTime = formatISODateToTime(booking.createdAt);

  return (
    <div className="overflow-hidden">
      <div className="p-4 md:p-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link
              href="/bookings"
              className="rounded-full bg-secondary-foreground/10 p-2 hover:bg-secondary-foreground/20 transition-colors"
            >
              <ArrowLeft className="size-4 md:size-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Booking Details</h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex gap-2"
              >
                <Mail className="size-4" />
                Email Me The Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Send Booking Details to my Email</DialogTitle>
              <SendEmail
                bookingId={booking.id}
                initialEmail={booking.User?.email || "user@example.com"}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Banner */}
        <div className="rounded-lg bg-primary/5 p-4 mb-6 border border-primary/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Plane className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Booking Reference</p>
              <p className="text-lg font-bold">{booking.paymentReference}</p>
            </div>
          </div>
          <Badge
            className={`${getStatusBadgeVariant3(
              booking.bookingStatus
            )} px-3 py-1.5`}
          >
            {capitalize(booking.bookingStatus)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flight Details Card */}
          <Card className="md:col-span-2 shadow-sm">
            <CardContent className="p-0">
              {/* Flight Header */}
              <div className="border-b p-4 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  {booking.Flight?.flightImages &&
                  booking.Flight.flightImages.length > 0 ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                      <Image
                        src={booking.Flight.flightImages[0]}
                        className="object-cover"
                        fill
                        sizes="64px"
                        alt={`${booking.Flight.airlineName} flight`}
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                      <Plane className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">
                      {booking.Flight?.airlineName}
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground">
                      Flight {booking.Flight?.flightName}
                    </p>
                  </div>
                </div>

                {/* Route Info */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-center md:text-left">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-lg font-semibold">
                      {booking.Flight?.departureAirport}
                    </p>
                  </div>
                  <div className="grow mx-4 relative">
                    <div className="border-t-2 border-dashed border-primary w-full absolute top-1/2" />
                    <FaPlane className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="text-lg font-semibold">
                      {booking.Flight?.arrivalAirport}
                    </p>
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="p-4 md:p-6">
                <h3 className="font-semibold mb-4">Flight Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Calendar className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{flightDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Clock className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {flightTime || "N/A"} {booking.Flight?.flightTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <Users className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Passengers
                      </p>
                      <p className="font-medium">
                        {booking.seatCount}{" "}
                        {booking.seatCount > 1 ? "passengers" : "passenger"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <MapPin className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seat Type</p>
                      <p className="font-medium">
                        {capitalize(booking.seatType)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary Card */}
          <Card className="h-fit shadow-sm">
            <CardContent className="p-0">
              <div className="border-b p-4">
                <h3 className="font-semibold">Payment Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket Price</span>
                  <span>
                    KES {(booking.totalAmount / booking.seatCount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passengers</span>
                  <span>{booking.seatCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seat Type</span>
                  <span>{booking.seatType}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>KES {booking.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-primary/5 text-green-800 p-2 rounded-md">
                  <CreditCard className="size-3" />
                  <span>
                    Payment completed via {booking.paymentMethod || "Card"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Passenger Information Card */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold mb-4">Passenger Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {`${booking.User?.firstName} ${booking.User?.lastName}` ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.User?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">
                  {booking.User?.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <p className="font-medium">
                  {bookingDate} at {bookingTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Thank you for booking with us. If you have any questions,{" "}
            <Link
              href="/#contact-us-page"
              className="underline hover:text-primary"
            >
              please contact our support team
            </Link>
          </p>
          <div className="flex gap-3 w-full md:w-auto">
            <Button asChild variant="outline" className="flex-1 md:flex-auto">
              <Link href="/flights">Find More Flights</Link>
            </Button>
            <Button
              asChild
              variant="primaryOutline"
              className="flex-1 md:flex-auto"
            >
              <Link href={`/flights/${booking.Flight?.id}`}>View Flight</Link>
            </Button>
            <Button asChild className="flex-1 md:flex-auto">
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
