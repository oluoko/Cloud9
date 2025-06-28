"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flight } from "@prisma/client";
import Link from "next/link";
import { FaPlane } from "react-icons/fa";

// Skeleton Component
export function FlightInterfaceSkeleton() {
  return (
    <div className="w-full p-4 rounded-xl border">
      {/* Date picker skeleton */}
      <div className="w-full mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-full">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 min-w-[100px] sm:min-w-[120px] p-2 border-r border-border/50 ${
                  index === 0 ? "rounded-l-lg" : ""
                } ${index === 6 ? "rounded-r-lg border-r-0" : ""}`}
              >
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-3 w-8 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seats left badge skeleton */}
      <div className="mb-4">
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Flight cards skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Flight Details Skeleton */}
                <div className="p-4 sm:p-6 flex-1">
                  <div className="flex items-center justify-between my-6">
                    <div className="text-center space-y-2">
                      <Skeleton className="h-8 w-16 mx-auto" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </div>

                    <div className="grow mx-4 relative">
                      <Skeleton className="h-0.5 w-full" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <Skeleton className="h-8 w-16 mx-auto" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>

                {/* Pricing Skeleton */}
                <div className="bg-accent rounded-lg p-2 lg:w-80 flex flex-col gap-4 m-2 lg:m-0 lg:mr-2 lg:my-2">
                  {Array.from({ length: 3 }).map((_, priceIndex) => (
                    <div key={priceIndex} className="bg-card rounded-lg p-2">
                      <Skeleton className="h-5 w-16 mb-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Skeleton className="h-4 w-10" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="flex gap-2 items-center">
                          <Skeleton className="h-4 w-10" />
                          <Skeleton className="h-6 w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Main Component with improved responsiveness
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

  // Generate a range of dates
  const generateDateRange = () => {
    const availableDates = Object.keys(flightsByDate).sort();
    if (availableDates.length === 0) return [];

    const startDate = new Date(availableDates[0]);
    const endDate = new Date(availableDates[availableDates.length - 1]);

    startDate.setDate(startDate.getDate() - 3);
    endDate.setDate(endDate.getDate() + 3);

    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const allDates = generateDateRange();

  // Set initial selected date if not set
  useEffect(() => {
    const availableDates = Object.keys(flightsByDate).sort();
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [flightsByDate, selectedDate]);

  // Get flights for selected date
  const selectedFlights = selectedDate ? flightsByDate[selectedDate] || [] : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    return { dayName, dayNumber, monthName };
  };

  const getSeatsLeft = (flight: Flight) => {
    return flight.economySeats + flight.businessSeats + flight.firstClassSeats;
  };

  const getMinPrice = (date: string) => {
    const flights = flightsByDate[date];
    if (!flights || flights.length === 0) return null;
    return Math.min(...flights.map((f) => f.economyPrice));
  };

  return (
    <div className="w-full p-2 sm:p-4 rounded-xl border">
      {/* Full-width date picker - improved mobile responsiveness */}
      <div className="w-full mb-4 sm:mb-6">
        <div className="flex overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-0 min-w-full">
            {allDates.map((date, index) => {
              const { dayName, dayNumber, monthName } = formatDate(date);
              const hasFlights = flightsByDate[date]?.length > 0;
              const isSelected = selectedDate === date;
              const minPrice = getMinPrice(date);

              return (
                <button
                  key={date}
                  onClick={() => hasFlights && setSelectedDate(date)}
                  className={`flex-1 min-w-[90px] sm:min-w-[120px] p-2 sm:p-3 border-r border-border/50 transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/60 text-foreground border-b-4 border-primary"
                      : hasFlights
                        ? "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        : "text-muted-foreground cursor-not-allowed opacity-50"
                  } ${index === 0 ? "rounded-l-lg" : ""} ${
                    index === allDates.length - 1
                      ? "rounded-r-lg border-r-0"
                      : ""
                  }`}
                  disabled={!hasFlights}
                >
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-medium mb-1">
                      {dayName} {dayNumber}
                    </div>
                    <div className="text-xs mb-1 sm:mb-2">{monthName}</div>
                    {hasFlights && minPrice ? (
                      <div className="text-xs sm:text-sm font-semibold">
                        KES {minPrice.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-xs">
                        {hasFlights ? "No fares" : "No flights"}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seats Left Badge */}
      {selectedFlights.length > 0 && (
        <div className="mb-4">
          <Badge
            variant="destructive"
            className="bg-green-500 text-white text-xs sm:text-sm"
          >
            {getSeatsLeft(selectedFlights[0])} seats left
          </Badge>
        </div>
      )}

      {/* Flight Cards - improved mobile layout */}
      <div className="space-y-3 sm:space-y-4">
        {selectedFlights.map((flight) => (
          <Link href={`/flights/${flight.id}`} key={flight.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Flight Details */}
                  <div className="p-3 sm:p-4 lg:p-6 flex-1">
                    <div className="flex items-center justify-between my-4 sm:my-6">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                          {flight.flightTime}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {flight.departureAirport}
                        </div>
                      </div>

                      <div className="grow mx-2 sm:mx-4 relative">
                        <div className="border-t-2 border-dashed border-primary w-full absolute top-1/2" />
                        <FaPlane className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-background px-1" />
                      </div>

                      <div className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                          {(() => {
                            const [hours, minutes] = flight.flightTime
                              .split(":")
                              .map(Number);
                            const endTime = new Date();
                            endTime.setHours(hours + 25, minutes + 50);
                            return endTime.toTimeString().slice(0, 5);
                          })()}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {flight.arrivalAirport}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4">
                      <span className="text-sm sm:text-lg lg:text-xl text-muted-foreground">
                        Operated by:
                      </span>
                      <span className="text-base sm:text-xl lg:text-2xl font-bold">
                        {flight.airlineName}
                      </span>
                    </div>
                  </div>

                  {/* Pricing - improved mobile layout */}
                  <div className="bg-accent rounded-lg p-2 mx-2 mb-2 lg:mx-0 lg:mb-0 lg:mr-2 lg:my-2 lg:w-80 flex flex-col gap-2 sm:gap-4">
                    {/* Economy Class */}
                    <div className="bg-card rounded-lg p-2">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Economy
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <div className="text-xs sm:text-sm">From</div>
                          <div className="text-sm sm:text-lg lg:text-xl font-bold">
                            Ksh {flight.economyPrice?.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <div className="text-xs sm:text-sm">Seats</div>
                          <div className="text-sm sm:text-lg lg:text-xl font-bold">
                            {flight.economySeats}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Class */}
                    <div className="bg-primary/25 rounded-lg p-2 border border-primary/30">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Business
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <div className="text-xs sm:text-sm">From</div>
                          <div className="text-sm sm:text-lg lg:text-xl font-bold">
                            Ksh {flight.businessPrice?.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <div className="text-xs sm:text-sm">Seats</div>
                          <div className="text-sm sm:text-lg lg:text-xl font-bold">
                            {flight.businessSeats}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* First Class */}
                    <div className="bg-primary/45 rounded-lg p-2 border border-primary/50">
                      <h3 className="font-semibold text-sm sm:text-base">
                        First
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <div className="text-xs sm:text-sm">From</div>
                          <div className="text-sm sm:text-lg lg:text-xl font-bold">
                            Ksh {flight.firstClassPrice?.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 items-center">
                          <div className="text-xs sm:text-sm">Seats</div>
                          <div className="text-sm sm:text-lg lg:text-xl font-bold">
                            {flight.firstClassSeats}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {selectedFlights.length === 0 && selectedDate && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-muted-foreground text-sm sm:text-base">
            No flights available for the selected date.
          </div>
        </div>
      )}
    </div>
  );
}
