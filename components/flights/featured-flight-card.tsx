import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlightDateTime } from "./flight-date-time";
import { FlightRoute } from "./flight-route";
import { FlightClassInfo } from "./flight-class-info";
import Link from "next/link";
import { Flight } from "@prisma/client";
import Image from "next/image";

export function FeaturedFlightCard({ flight }: { flight: Flight }) {
  return (
    <div className="bg-accent rounded-lg shadow-lg mb-8 grid md:grid-cols-2 overflow-hidden">
      <Image
        src={flight.flightImages[0]}
        alt={flight.flightName}
        layout="responsive"
        width={500}
        height={300}
        className="object-cover h-full"
      />
      <div className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{flight.flightName}</CardTitle>
            <Badge variant="outline" className="bg-primary">
              Featured
            </Badge>
          </div>
          <p className="text-xl font-semibold text-gray-700">
            {flight.airlineName}
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <FlightDateTime
            date={flight.flightDate}
            time={flight.flightTime}
            size="large"
          />
          <div className="mb-4">
            <FlightRoute
              departure={flight.departureAirport}
              arrival={flight.arrivalAirport}
              size="large"
            />
          </div>
          <FlightClassInfo
            low={{
              price: flight.lowPrice,
              seats: flight.lowSeats,
            }}
            middle={{
              price: flight.middlePrice,
              seats: flight.middleSeats,
            }}
            executive={{
              price: flight.executivePrice,
              seats: flight.executiveSeats,
            }}
          />
        </CardContent>
        <CardFooter className="px-0 pt-4">
          <Link
            href={`/flights/${flight.id}`}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition w-full"
          >
            Book Now
          </Link>
        </CardFooter>
      </div>
    </div>
  );
}
