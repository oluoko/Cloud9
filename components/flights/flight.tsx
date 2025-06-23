import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlightImage } from "./flight-image";
import { FlightDateTime } from "./flight-date-time";
import { FlightRoute } from "./flight-route";
import Link from "next/link";
import { Flight } from "@prisma/client";

export function FlightCard({ flight }: { flight: Flight }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <FlightImage
          images={flight.flightImages}
          airlineName={flight.airlineName}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{flight.flightName}</CardTitle>
        <p className="text-sm text-gray-600">{flight.airlineName}</p>
      </CardHeader>
      <CardContent>
        <FlightDateTime date={flight.flightDate} time={flight.flightTime} />
        <FlightRoute
          departure={flight.departureAirport}
          arrival={flight.arrivalAirport}
        />
        <div className="mt-3 text-sm">
          <p>
            From <span className="font-bold">Ksh {flight.economyPrice}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/flights/${flight.id}`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition w-full text-sm"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
