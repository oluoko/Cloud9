"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import Image from "next/image";
import mpesaText from "@/public/assets/lipa na mpesa.png";
import { Flight, User } from "@prisma/client";
import PayWithStripe from "./pay-with-stripe";
import Link from "next/link";
import LipaNaMpesa from "./lipa-na-mpesa";

type SeatClass = "low" | "middle" | "executive";

export default function FlightPage({
  flight,
  user,
}: {
  flight: Flight;
  user: User;
}) {
  const [selectedClass, setSelectedClass] = useState<SeatClass>("low");
  const [numPassengers, setNumPassengers] = useState("1");

  const availableSeats = {
    low: flight?.lowSeats || 0,
    middle: flight?.middleSeats || 0,
    executive: flight?.executiveSeats || 0,
  };

  const priceMap = {
    low: flight?.lowPrice || 0,
    middle: flight?.middlePrice || 0,
    executive: flight?.executivePrice || 0,
  };

  const totalPrice = priceMap[selectedClass] * parseInt(numPassengers);

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
    <div className="px-4">
      <div className="grid md:grid-cols-3 gap-6">
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
                          <Image
                            src={image}
                            fill={true}
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

        <Card>
          <CardHeader>
            <CardTitle>Book This Flight</CardTitle>
            <CardDescription>Select class and passengers</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="low"
              onValueChange={(value) => setSelectedClass(value as SeatClass)}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="low">Low Class</TabsTrigger>
                <TabsTrigger value="middle">Middle Class</TabsTrigger>
                <TabsTrigger value="executive">Executive Class</TabsTrigger>
              </TabsList>

              <TabsContent value="low" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    Ksh {flight?.lowPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available seats:</span>
                  <span className="font-semibold">{flight?.lowSeats}</span>
                </div>
              </TabsContent>

              <TabsContent value="middle" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    Ksh {flight?.middlePrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available seats:</span>
                  <span className="font-semibold">{flight?.middleSeats}</span>
                </div>
              </TabsContent>

              <TabsContent value="executive" className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    Ksh {flight?.executivePrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available seats:</span>
                  <span className="font-semibold">
                    {flight?.executiveSeats}
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

          <CardFooter className="grid gap-2">
            {totalPrice < 66 ? (
              <div className="text-muted-foreground text-sm my-2 md:my-4">
                A total price this low can only be paid using M-pesa. Exceed Ksh
                66 to pay using stripe.
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay With Stripe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Pay Using Stripe</DialogTitle>
                  <PayWithStripe
                    flightId={flight.id}
                    seatType={selectedClass}
                    seatCount={parseInt(numPassengers)}
                    amount={totalPrice}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 p-2"
                >
                  {" "}
                  <Image src={mpesaText} alt="Lipa Na Mpesa" height={23} />{" "}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <LipaNaMpesa
                  flightId={flight.id}
                  seatType={selectedClass}
                  seatCount={parseInt(numPassengers)}
                  amount={totalPrice}
                  user={user}
                />
              </DialogContent>
            </Dialog>
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
                    Low Class:{" "}
                    <span className="font-medium">
                      {flight?.lowSeats} seats
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Middle Class:{" "}
                    <span className="font-medium">
                      {flight?.middleSeats} seats
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Executive Class:{" "}
                    <span className="font-medium">
                      {flight?.executiveSeats} seats
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Thank you for flying with us. If you have any questions,{" "}
          <Link href="/#contact-us" className="underline hover:text-primary">
            please contact our support team
          </Link>
        </p>
        <div className="flex gap-3 w-full md:w-auto">
          <Button asChild variant="outline" className="flex-1 md:flex-auto">
            <Link href="/flights">Find More Flights</Link>
          </Button>
          <Button asChild className="flex-1 md:flex-auto">
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
