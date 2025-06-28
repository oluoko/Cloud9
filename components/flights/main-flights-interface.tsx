"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Flight } from "@prisma/client";
import Link from "next/link";
import { FaPlane, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Optimized Skeleton Component - Only the essentials
export function FlightInterfaceSkeleton() {
  return (
    <div className="w-full p-4 rounded-xl border">
      {/* Date picker skeleton - simplified with navigation */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <FaChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2 overflow-x-auto flex-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-w-[100px] p-3 rounded-lg border">
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-12 mx-auto" />
                  <Skeleton className="h-3 w-8 mx-auto" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" disabled>
            <FaChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Flight cards skeleton - reduced to 2 cards */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row">
                {/* Flight route skeleton */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <Skeleton className="h-6 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-8 mx-auto" />
                    </div>
                    <Skeleton className="h-0.5 w-32" />
                    <div className="text-center">
                      <Skeleton className="h-6 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-8 mx-auto" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-32" />
                </div>

                {/* Pricing skeleton - simplified */}
                <div className="lg:w-80 mt-4 lg:mt-0">
                  <div className="bg-accent rounded-lg p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, priceIndex) => (
                      <div key={priceIndex} className="bg-card rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    ))}
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

// Main Component remains the same
export default function MainFlightsInterface({
  flights,
}: {
  flights: Flight[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Generate dates from today forward
  const generateDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const availableDates = Object.keys(flightsByDate)
      .filter(date => new Date(date) >= today)
      .sort();
    
    if (availableDates.length === 0) {
      // If no flight dates, show next 14 days from today
      const dates = [];
      const currentDate = new Date(today);
      for (let i = 0; i < 14; i++) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    }

    // Show dates from today to 30 days ahead or last flight date, whichever is later
    const endDate = new Date(Math.max(
      today.getTime() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      new Date(availableDates[availableDates.length - 1]).getTime()
    ));

    const dates = [];
    const currentDate = new Date(today);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const allDates = generateDateRange();

  // Set initial selected date to today or first available date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const availableDates = Object.keys(flightsByDate)
      .filter(date => new Date(date) >= new Date(today))
      .sort();
    
    if (!selectedDate) {
      if (availableDates.length > 0) {
        setSelectedDate(availableDates[0]);
      } else {
        setSelectedDate(today);
      }
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

  // Get visible dates (7 days at a time)
  const getVisibleDates = () => {
    const startIndex = allDates.findIndex(date => 
      new Date(date) >= currentWeekStart
    );
    if (startIndex === -1) return allDates.slice(0, 7);
    return allDates.slice(startIndex, startIndex + 7);
  };

  const visibleDates = getVisibleDates();

  // Navigation functions
  const navigatePrevious = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    
    // Don't go before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newStart >= today) {
      setCurrentWeekStart(newStart);
    }
  };

  const navigateNext = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  // Check if navigation buttons should be enabled
  const canNavigatePrevious = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekBefore = new Date(currentWeekStart);
    weekBefore.setDate(weekBefore.getDate() - 7);
    return weekBefore >= today;
  };

  const canNavigateNext = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    return allDates.some(date => new Date(date) >= nextWeekStart);
  };

  return (
    <div className="w-full p-2 sm:p-4 rounded-xl border">
      {/* Date picker with navigation */}
      <div className="w-full mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={navigatePrevious}
            disabled={!canNavigatePrevious()}
            className="flex-shrink-0"
          >
            <FaChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex overflow-x-auto scrollbar-hide pb-2 flex-1" ref={scrollContainerRef}>
            <div className="flex gap-0 min-w-full">
              {visibleDates.map((date, index) => {
                const { dayName, dayNumber, monthName } = formatDate(date);
                const hasFlights = flightsByDate[date]?.length > 0;
                const isSelected = selectedDate === date;
                const minPrice = getMinPrice(date);
                const isToday = date === new Date().toISOString().split("T")[0];

                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-1 min-w-[90px] sm:min-w-[120px] p-2 sm:p-3 border-r border-border/50 transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/60 text-foreground border-b-4 border-primary"
                        : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    } ${index === 0 ? "rounded-l-lg" : ""} ${
                      index === visibleDates.length - 1
                        ? "rounded-r-lg border-r-0"
                        : ""
                    } ${isToday ? "ring-2 ring-primary/50" : ""}`}
                  >
                    <div className="text-center">
                      <div className="text-xs sm:text-sm font-medium mb-1">
                        {isToday ? "Today" : `${dayName} ${dayNumber}`}
                      </div>
                      <div className="text-xs mb-1 sm:mb-2">{monthName}</div>
                      {hasFlights && minPrice ? (
                        <div className="text-xs sm:text-sm font-semibold">
                          KES {minPrice.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          {hasFlights ? "No fares" : "No flights"}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={navigateNext}
            disabled={!canNavigateNext()}
            className="flex-shrink-0"
          >
            <FaChevronRight className="h-4 w-4" />
          </Button>
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