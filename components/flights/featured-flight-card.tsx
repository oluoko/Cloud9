// components/FeaturedFlightCard.jsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlightImage } from "./flight-image";
import { FlightDateTime } from "./flight-date-time";
import { FlightRoute } from "./flight-route";
import { FlightClassInfo } from "./flight-class-info";
import Link from "next/link";
import { Flight } from "@prisma/client";

export function FeaturedFlightCard({ flight }: { flight: Flight }) {
  return (
    <Card className="mb-8 overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative">
          <FlightImage
            images={flight.flightImages}
            airlineName={flight.airlineName}
            size="large"
          />
        </div>
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
              economy={{
                price: flight.economyPrice,
                seats: flight.economySeats,
              }}
              business={{
                price: flight.businessPrice,
                seats: flight.businessSeats,
              }}
              firstClass={{
                price: flight.firstClassPrice,
                seats: flight.firstClassSeats,
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
    </Card>
  );
}
