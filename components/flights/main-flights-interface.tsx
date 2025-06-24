"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Filter,
  ArrowLeft,
  Plane,
  Clock,
  PlaneIcon,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import { Flight } from "@prisma/client";
import Link from "next/link";
import { FaPlane } from "react-icons/fa";
import { formatISODateToTime } from "@/lib/utils";

export default function MainFlightsInterface({
  flights,
}: {
  flights: Flight[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Group flights by date
  const flightsByDate = flights.reduce(
    (acc, flight) => {
      const date = flight.flightDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(flight);
      return acc;
    },
    {} as Record<string, Flight[]>
  );

  // Get unique dates and sort them
  const availableDates = Object.keys(flightsByDate).sort();

  // Set initial selected date if not set
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Get flights for selected date
  const selectedFlights = selectedDate ? flightsByDate[selectedDate] || [] : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return { dayName, dayNumber };
  };

  const getSeatsLeft = (flight: Flight) => {
    return flight.economySeats + flight.businessSeats + flight.firstClassSeats;
  };

  return (
    <div className="w-full p-4 rounded-xl border">
      <div className="w-full flex gap-1 mb-6 overflow-x-auto">
        {availableDates.map((date) => {
          const { dayName, dayNumber } = formatDate(date);
          const hasFlights = flightsByDate[date]?.length > 0;
          const isSelected = selectedDate === date;

          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center p-3 min-w-[80px] rounded-lg border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-background border-primary "
                  : hasFlights
                    ? "text-muted-foreground border-transparent bg-foreground/30 hover:bg-primary/30"
                    : "text-muted-foreground border-transparent cursor-not-allowed"
              }`}
              disabled={!hasFlights}
            >
              <span className="text-sm font-medium">
                {dayName} {dayNumber}
              </span>
              {hasFlights ? (
                <span className="text-xs mt-1">
                  Ksh{" "}
                  {Math.min(...flightsByDate[date].map((f) => f.economyPrice))}
                </span>
              ) : (
                <span className="text-xs mt-1">No flights</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Seats Left Badge */}
      {selectedFlights.length > 0 && (
        <div className="mb-4">
          <Badge variant="destructive" className="bg-primary text-background">
            {getSeatsLeft(selectedFlights[0])} seats left
          </Badge>
        </div>
      )}

      {/* Flight Cards */}
      <div className="space-y-4">
        {selectedFlights.map((flight) => (
          <Card key={flight.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row px-6">
                {/* Flight Details */}
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between my-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {flight.flightTime}
                      </div>
                      <div className="text-sm ">{flight.departureAirport}</div>
                    </div>

                    <div className="grow mx-4 relative">
                      <div className="border-t-2 border-dashed border-primary w-full absolute top-1/2" />
                      <FaPlane className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {(() => {
                          const [hours, minutes] = flight.flightTime
                            .split(":")
                            .map(Number);
                          const endTime = new Date();
                          endTime.setHours(hours + 25, minutes + 50); // Adding mock duration
                          return endTime.toTimeString().slice(0, 5);
                        })()}
                      </div>
                      <div className="text-sm ">{flight.arrivalAirport}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl text-muted-foreground">
                      Operated by:{" "}
                    </span>
                    <span className="text-2xl font-bold">
                      {flight.airlineName}
                    </span>
                  </div>
                  <Link href={`/flights/${flight.id}`}>
                    <Button
                      variant="primaryOutline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      View Flight Details
                    </Button>
                  </Link>
                </div>

                {/* Pricing */}
                <div className="bg-accent rounded-lg p-2 lg:w-80 flex flex-col gap-4">
                  {/* Economy Class */}
                  <div className="bg-card rounded-lg p-2">
                    <h3 className="font-semibold">Economy</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="text-sm">From</div>
                        <div className="text-xl font-bold">
                          Ksh {flight.economyPrice}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="text-sm">Seats</div>
                        <div className="text-xl font-bold">
                          {flight.economySeats}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Class */}
                  <div className="bg-primary/25 rounded-lg p-2 border border-primary/30">
                    <h3 className="font-semibold">Business</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="text-sm">From</div>
                        <div className="text-xl font-bold">
                          Ksh {flight.businessPrice}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="text-sm">Seats</div>
                        <div className="text-xl font-bold">
                          {flight.businessSeats}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* First Class */}
                  <div className="bg-primary/45 rounded-lg p-2 border border-primary/50">
                    <h3 className="font-semibold">First</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="text-sm">From</div>
                        <div className="text-xl font-bold">
                          Ksh {flight.firstClassPrice}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="text-sm">Seats</div>
                        <div className="text-xl font-bold">
                          {flight.firstClassSeats}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
