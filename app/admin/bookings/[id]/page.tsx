import ItemNotFound from "@/components/item-not-found";
import { Card } from "@/components/ui/card";
import prisma from "@/utils/db";

export default async function BookingPage({
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Details</h1>
      <p className="text-muted-foreground text-sm md:text-base">
        Here you can view and manage the details of the booking.
      </p>

      <Card className="mt-6">
        <div className="border-b px-4 py-3">
          <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">
            {booking.User
              ? `${booking.User.firstName} ${booking.User.lastName || ""}`
              : "Unknown User"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Booking ID: {booking.id}
          </p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Flight:</span>{" "}
              {booking.Flight?.flightName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Creation Date:</span>{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Creation Date:</span>{" "}
              {booking.Flight?.flightDate}
            </div>
            <div>
              <span className="font-medium">Creation Time:</span>{" "}
              {new Date(booking.createdAt).toLocaleTimeString()}
            </div>
            <div>
              <span className="font-medium">Creation Time:</span>{" "}
              {booking.Flight?.flightTime}
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
