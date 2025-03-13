import prisma from "@/utils/db";
import { FeaturedFlightCard } from "../_components/flights/FlightFeaturedCard";
import { FlightCard } from "../_components/flights/FlightCard";

export default async function Flights() {
  // Get only 5 flights from the database
  const flights = await prisma.flight.findMany({
    take: 5,
  });

  const firstFlight = flights[0];
  const remainingFlights = flights.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Featured Flights</h1>

      {/* Featured Flight - Wide Card */}
      {firstFlight && <FeaturedFlightCard flight={firstFlight} />}

      {/* Remaining Flights - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {remainingFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
}
