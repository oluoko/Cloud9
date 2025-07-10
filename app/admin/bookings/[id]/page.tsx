import ItemNotFound from "@/components/item-not-found";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
  Phone,
  User,
} from "lucide-react";
import { FaPlane } from "react-icons/fa6";
import {
  capitalize,
  formatDate,
  formatISODateToTime,
  formatTime,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import EditBooking from "@/components/edit-booking";

export default async function AdminBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      User: true,
      Flight: true,
    },
  });

  if (!booking) {
    return <ItemNotFound item="booking" />;
  }

  const flightDate = formatDate(booking.Flight?.flightDate);
  const flightTime = formatTime(booking.Flight?.flightTime);
  const bookingDate = formatDate(booking.createdAt);
  const bookingTime = formatISODateToTime(booking.createdAt);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <Link
          href="/admin/bookings"
          className="rounded-full bg-secondary-foreground/10 p-2 hover:bg-secondary-foreground/20 transition-colors"
        >
          <ArrowLeft className="size-4 md:size-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and review booking details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight and Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Details Card */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              {/* Flight Header */}
              <div className="border-b p-4 md:p-6 bg-blue-300/5">
                <div className="flex items-center gap-4 mb-4">
                  {booking.Flight?.flightImages &&
                  booking.Flight.flightImages.length > 0 ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 shadow-sm flex-shrink-0">
                      <Image
                        src={booking.Flight.flightImages[0]}
                        className="object-cover"
                        fill
                        sizes="64px"
                        alt={`${booking.Flight.airlineName} flight`}
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-transparent rounded-lg flex items-center justify-center flex-shrink-0 border-2 ">
                      <Plane className="size-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">
                      {booking.Flight?.airlineName}
                    </h2>
                    <p className="text-sm font-medium text-primary">
                      Flight {booking.Flight?.flightName}
                    </p>
                  </div>
                </div>

                {/* Route Info */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-center md:text-left">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="text-lg font-semibold">
                      {booking.Flight?.departureAirport}
                    </p>
                  </div>
                  <div className="grow mx-4 relative">
                    <div className="border-t-2 border-dashed border-primary w-full absolute top-1/2" />
                    <FaPlane className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="text-lg font-semibold">
                      {booking.Flight?.arrivalAirport}
                    </p>
                  </div>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="p-4 md:p-6">
                <h3 className="font-semibold mb-4">Flight Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-300/15 p-2 mt-0.5">
                      <Calendar className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Flight Date
                      </p>
                      <p className="font-medium">{flightDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-300/15 p-2 mt-0.5">
                      <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Flight Time
                      </p>
                      <p className="font-medium">{flightTime || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-300/15 p-2 mt-0.5">
                      <Users className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Passenger Count
                      </p>
                      <p className="font-medium">
                        {booking.seatCount}{" "}
                        {booking.seatCount > 1 ? "passengers" : "passenger"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-300/15 p-2 mt-0.5">
                      <MapPin className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cabin Class
                      </p>
                      <p className="font-medium">
                        {capitalize(booking.seatType)} Class
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="border-b p-4 ">
                <h3 className="font-semibold">Customer Information</h3>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-300/15 p-2 mt-0.5">
                      <User className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {booking.User
                          ? `${booking.User.firstName} ${booking.User.lastName || ""}`
                          : "Unknown User"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-300/15 p-2 mt-0.5">
                      <Mail className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Email Address
                      </p>
                      <p className="font-medium">
                        {booking.User?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-300/15 p-2 mt-0.5">
                      <Phone className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="font-medium">
                        {booking.User?.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Payment and Actions */}
        <div className="space-y-6">
          {/* Payment Summary Card */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="border-b p-4 ">
                <h3 className="font-semibold">Payment Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">
                    Ksh {(booking.totalAmount / booking.seatCount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passengers</span>
                  <span className="font-medium">{booking.seatCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span className="font-medium">
                    {capitalize(booking.seatType)} Class
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600 dark:text-green-400">
                    Ksh {booking.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-primary/10 rounded-lg p-2">
                  <CreditCard className="size-4" />
                  <span>Payment via {booking.paymentMethod || "Card"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="border-b p-4 ">
                <h3 className="font-semibold">Booking Info</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {bookingDate} at {bookingTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-xs text-muted-foreground">
                      {capitalize(booking.bookingStatus)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 my-2 md:my-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto sm:flex-1">
                    Update Booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Booking</DialogTitle>
                  <EditBooking booking={booking} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Delete Booking</DialogTitle>
                  <DeleteConfirmation
                    id={booking.id}
                    title={booking.Flight?.airlineName || "Booking"}
                    modelType="booking"
                  />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 ">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Admin view - Managing booking for{" "}
          {booking.User?.firstName || "customer"}
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/bookings">Back to Bookings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/admin/flights/${booking.Flight?.id}`}>
              View Flight
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/users/${booking.User?.id}`}>View Customer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
