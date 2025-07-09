import { Card } from "@/components/ui/card";
import prisma from "@/utils/db";
import ItemNotFound from "@/components/item-not-found";

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
    <div className="">
      {bookings.length > 0 ? (
        bookings.map((booking) => <Card key={booking.id} className=""></Card>)
      ) : (
        <ItemNotFound item="bookings" />
      )}
    </div>
  );
}
