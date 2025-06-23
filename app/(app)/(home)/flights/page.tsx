import Flights from "@/components/flights/flights";
import prisma from "@/utils/db";

export default async function FlightsPage() {
  const flights = await prisma.flight.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return <Flights flights={flights} showFlightCards />;
}
