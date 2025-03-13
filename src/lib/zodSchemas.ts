import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  profileImage: z.string().optional(),
});

export const flightSchema = z.object({
  flightName: z.string().min(1, "Flight name is required"),
  flightDate: z
    .string()
    .min(1, "Flight date is required")
    .refine(
      (val) => {
        try {
          // Validate that it's a valid date in yyyy-MM-dd format
          const date = new Date(val);
          return !isNaN(date.getTime());
        } catch {
          return false;
        }
      },
      {
        message: "Invalid date format",
      }
    ),

  flightTime: z
    .string()
    .min(1, "Flight time is required")
    .refine(
      (val) => {
        // Validate time is in HH:MM format
        return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(val);
      },
      {
        message: "Invalid time format (HH:MM)",
      }
    ),
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
});

export const bannerSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  destinationAirport: z.string(),
  largeImageUrl: z.string(),
  smallImageUrl: z.string(),
  isActive: z.boolean().optional().default(false),
});
