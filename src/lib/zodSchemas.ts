// model Flight {
//   id                 String   @id @unique
//   flightId           String   @unique
//   flightName         String
//   flightDate         DateTime
//   flightTime         DateTime
//   airlineName        String
//   numberOfPassengers Int
//   departure          String
//   departureAirport   String
//   arrivalAirport     String
//   arrival            String
//   flightPrice        Float
//   createdAt          DateTime @default(now())
//   updatedAt          DateTime @updatedAt
//   banner             Banner?  @relation(fields: [bannerId], references: [id])
//   bannerId           String?
// }

// model Banner {
//   id              String    @id @default(uuid())
//   title           String
//   description     String?
//   destinationCity String // This matches with Flight.arrival
//   largeImageUrl   String
//   smallImageUrl   String
//   isActive        Boolean   @default(true)
//   startDate       DateTime  @default(now())
//   endDate         DateTime?
//   createdAt       DateTime  @default(now())
//   updatedAt       DateTime  @updatedAt
//   flights         Flight[]
// }

import { z } from "zod";

export const flightSchema = z.object({
  flightId: z.string(),
  flightName: z.string(),
  flightDate: z.date(),
  flightTime: z.date(),
  airlineName: z.string(),
  numberOfPassengers: z.number(),
  departure: z.string(),
  departureAirport: z.string(),
  arrivalAirport: z.string(),
  arrival: z.string(),
  flightPrice: z.number(),
  bannerId: z.string().optional(),
});

export const bannerSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  destinationCity: z.string(),
  largeImageUrl: z.string(),
  smallImageUrl: z.string(),
  isActive: z.boolean(),
  startDate: z.date(),
  endDate: z.date().optional(),
  flights: z.array(flightSchema),
});
