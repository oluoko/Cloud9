import { z } from "zod";

export const flightSchema = z.object({
  flightName: z.string(),
  flightDate: z.date(),
  flightTime: z.date(),
  flightImages: z.array(z.string()).min(1, "Please upload at least one image"),
  airlineName: z.string(),
  economySeats: z
    .number()
    .max(250, "An airplane can only have a maximum of 250 economy seats."),
  firstClassSeats: z
    .number()
    .max(30, "An airplane can only have a maximum of 30 first class seats."),
  businessSeats: z
    .number()
    .max(50, "An airplane can only have a maximum of 50 business seats."),
  economyPrice: z.number(),
  firstClassPrice: z.number(),
  businessPrice: z.number(),
  departure: z.string(),
  departureAirport: z.string(),
  arrivalAirport: z.string(),
  arrival: z.string(),
  bannerId: z.string().optional(),
});

export const bannerSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  destinationCity: z.string(),
  largeImageUrl: z.string(),
  smallImageUrl: z.string(),
  isActive: z.boolean().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});
