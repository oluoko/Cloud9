"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Clock,
  Plane,
  CreditCard,
  Users,
} from "lucide-react";
import { FaPlane } from "react-icons/fa";

interface FlightProps {
  id: string;
  flightName: string;
  flightDate: string;
  flightTime: string;
  flightImages: string[];
  airlineName: string;
  economySeats: number;
  businessSeats: number;
  firstClassSeats: number;
  economyPrice: number;
  businessPrice: number;
  firstClassPrice: number;
  departureAirport: string;
  arrivalAirport: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProps {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  clerkUserId: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  phoneNumber: string | null;
}

export default function FlightPage({
  flight,
  user,
}: {
  flight: FlightProps;
  user: UserProps;
}) {
  const [selectedClass, setSelectedClass] = useState("economy");
  const [numPassengers, setNumPassengers] = useState("1");

  // Determine available seats based on class
  const availableSeats = {
    economy: flight?.economySeats || 0,
    business: flight?.businessSeats || 0,
    firstClass: flight?.firstClassSeats || 0,
  };

  // Determine price based on selected class
  const priceMap = {
    economy: flight?.economyPrice || 0,
    business: flight?.businessPrice || 0,
    firstClass: flight?.firstClassPrice || 0,
  };

  const totalPrice = priceMap[selectedClass] * parseInt(numPassengers);

  // Format date and time
  const formattedDate = new Date(flight?.flightDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Flight Details Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                {flight?.flightName}
              </CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <Plane className="h-4 w-4" />
                {flight?.airlineName}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
              <Clock className="h-4 w-4 ml-4" />
              {flight?.flightTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Flight Route Visualization */}
            <div className="flex items-center justify-between my-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">From</p>
                <div className="flex items-center gap-2 mt-1">
                  <PlaneTakeoff className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">
                    {flight?.departureAirport}
                  </h3>
                </div>
              </div>

              <div className="grow mx-4 relative">
                <div className="border-t-2 border-dashed border-primary w-full absolute top-1/2" />
                <FaPlane className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">To</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-xl font-bold">
                    {flight?.arrivalAirport}
                  </h3>
                  <PlaneLanding className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Flight Images */}
            {flight?.flightImages && flight.flightImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Flight & Destination Images
                </h3>
                <Carousel className="w-full">
                  <CarouselContent>
                    {flight.flightImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-64 w-full rounded-md overflow-hidden">
                          <img
                            src={image}
                            alt={`Flight image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Section */}
        <Card>
          <CardHeader>
            <CardTitle>Book This Flight</CardTitle>
            <CardDescription>Select class and passengers</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="economy" onValueChange={setSelectedClass}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="economy">Economy</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="firstClass">First Class</TabsTrigger>
              </TabsList>

              <TabsContent value="economy" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    Ksh {flight?.economyPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available seats:</span>
                  <span className="font-semibold">{flight?.economySeats}</span>
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    Ksh {flight?.businessPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available seats:</span>
                  <span className="font-semibold">{flight?.businessSeats}</span>
                </div>
              </TabsContent>

              <TabsContent value="firstClass" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    Ksh {flight?.firstClassPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available seats:</span>
                  <span className="font-semibold">
                    {flight?.firstClassSeats}
                  </span>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">
                Number of Passengers
              </label>
              <Select defaultValue="1" onValueChange={setNumPassengers}>
                <SelectTrigger>
                  <SelectValue placeholder="Select passengers" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, availableSeats[selectedClass]))].map(
                    (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Price:</span>
                <span className="text-xl">Ksh {totalPrice.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {numPassengers}{" "}
                {parseInt(numPassengers) === 1 ? "passenger" : "passengers"} ×
                Ksh
                {priceMap[selectedClass].toFixed(2)}
              </div>
            </div>{" "}
            <div className="mt-4 p-2 border border-muted rounded-md text-sm">
              This is a dummy site, and you are about to book and pay for a fake
              flight.
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Payment With Card
            </Button>
            <Button>Lipa na Mpesa</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Flight Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Flight:{" "}
                    <span className="font-medium">{flight?.flightName}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Date: <span className="font-medium">{formattedDate}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Time:{" "}
                    <span className="font-medium">{flight?.flightTime}</span>
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Airline</h3>
              <p className="flex items-center gap-2">{flight?.airlineName}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Capacity</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Economy:{" "}
                    <span className="font-medium">
                      {flight?.economySeats} seats
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Business:{" "}
                    <span className="font-medium">
                      {flight?.businessSeats} seats
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    First Class:{" "}
                    <span className="font-medium">
                      {flight?.firstClassSeats} seats
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
