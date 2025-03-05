import { z } from "zod";

export const flightSchema = z.object({
  flightName: z.string().min(1, "Flight name is required"),
  flightDate: z
    .string()
    .refine(
      (val) => {
        // Validate date string format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(val);
      },
      { message: "Invalid date format" }
    )
    .transform((val) => new Date(val)),
  flightTime: z.string().min(1, "Flight time is required"),
  flightImages: z.array(z.string()).min(1, "Please upload at least one image"),
  airlineName: z.string().min(1, "Airline name is required"),
  economySeats: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Economy seats must be a number",
    })
    .refine((val) => val <= 250, {
      message: "An airplane can only have a maximum of 250 economy seats.",
    }),
  firstClassSeats: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "First class seats must be a number",
    })
    .refine((val) => val <= 30, {
      message: "An airplane can only have a maximum of 30 first class seats.",
    }),
  businessSeats: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Business seats must be a number",
    })
    .refine((val) => val <= 50, {
      message: "An airplane can only have a maximum of 50 business seats.",
    }),
  economyPrice: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Economy price must be a number",
    }),
  firstClassPrice: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "First class price must be a number",
    }),
  businessPrice: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Business price must be a number",
    }),
  departureAirport: z.string().min(1, "Departure airport is required"),
  arrivalAirport: z.string().min(1, "Arrival airport is required"),
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
