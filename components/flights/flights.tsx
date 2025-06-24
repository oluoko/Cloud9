import prisma from "@/utils/db";
import { FeaturedFlightCard } from "@/components/flights/featured-flight-card";
import { FlightCard } from "@/components/flights/flight";
import { Flight } from "@prisma/client";
import MainFlightsInterface from "@/components/flights/main-flights-interface";

interface FlightsProps {
  flights: Flight[];
  showFlightCards?: boolean;
}
export default function Flights({
  flights,
  showFlightCards = false,
}: FlightsProps) {
  if (!flights || flights.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">No Flights Available</h1>
        <p className="text-lg text-gray-600">
          Currently, there are no flights available. Please check back later.
        </p>
      </div>
    );
  }
  const firstFlight = flights[0];
  const remainingFlights = flights.slice(1);
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Featured Flights</h1>

      {/* Featured Flight - Wide Card */}
      {firstFlight && <FeaturedFlightCard flight={firstFlight} />}

      <MainFlightsInterface flights={remainingFlights} />

      {/* Remaining Flights - Grid Layout */}
      {showFlightCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {remainingFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}
