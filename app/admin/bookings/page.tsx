import { Card } from "@/components/ui/card";
import prisma from "@/utils/db";
import ItemNotFound from "@/components/item-not-found";
import Link from "next/link";

export default async function Bookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      User: true,
      Flight: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group bookings by user
  const groupedBookings = bookings.reduce(
    (acc, booking) => {
      const userId = booking.User?.id || "unknown";
      if (!acc[userId]) {
        acc[userId] = {
          user: booking.User,
          bookings: [],
        };
      }
      acc[userId].bookings.push(booking);
      return acc;
    },
    {} as Record<string, { user: any; bookings: any[] }>
  );

  const userGroups = Object.values(groupedBookings);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Bookings</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Here you can view and manage all bookings in the system, organized by
          user.
        </p>
      </div>

      {userGroups.length > 0 ? (
        <div className="space-y-6">
          {userGroups.map((group) => (
            <Card key={group.user?.id || "unknown"} className="overflow-hidden">
              <div className="border-b px-4 py-3">
                <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">
                  {group.user
                    ? `${group.user.firstName} ${group.user.lastName || ""}`
                    : "Unknown User"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {group.bookings.length} booking
                  {group.bookings.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="p-4">
                <div className="grid gap-3 sm:gap-4">
                  {group.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-3 sm:p-4 transition-colors relative"
                    >
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="absolute top-2 right-2 z-10 bg-background text-  foreground px-2 py-1 text-xs rounded border hover:bg-primary/70 hover:border-primary/70 transition-colors"
                      >
                        View
                      </Link>

                      <div className="pr-12">
                        <h3 className="font-medium text-muted-foreground mb-2 text-sm sm:text-base">
                          Booking ID: {booking.id}
                        </h3>

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
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <ItemNotFound item="bookings" />
      )}
    </div>
  );
}
