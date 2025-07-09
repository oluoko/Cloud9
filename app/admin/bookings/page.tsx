import { Card } from "@/components/ui/card";
import prisma from "@/utils/db";
import ItemNotFound from "@/components/item-not-found";
import Link from "next/link";

export default async function Bookings() {
  const bookings = await await prisma.booking.findMany({
    include: {
      User: true,
      Flight: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <p className="mb-4">
        Here you can view and manage all bookings in the system.
      </p>
      <div className="grid md:grid-cols-2 gap-2 md:gap-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id} className="relative">
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="absolute z-10 right-2 top-2 bg-background text-foreground px-2 rounded-lg border hover:bg-primary transition-colors"
              >
                View {booking.User?.firstName}&apos;s booking
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Booking ID: {booking.id}
                </h2>
                <p className="text-sm text-gray-600">
                  User: {booking.User?.firstName}
                </p>
                <p className="text-sm text-gray-600">
                  Flight: {booking.Flight?.flightName}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <ItemNotFound item="bookings" />
        )}
      </div>
    </div>
  );
}
