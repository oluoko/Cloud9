import { z } from "zod";

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
  middleSeats: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Middle seats must be a number",
    })
    .refine((val) => val <= 50, {
      message: "An airplane can only have a maximum of 50 middle class seats.",
    }),
  executiveSeats: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Executive seats must be a number",
    })
    .refine((val) => val <= 30, {
      message:
        "An airplane can only have a maximum of 30 executive class seats.",
    }),
  lowSeats: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Low seats must be a number",
    })
    .refine((val) => val <= 250, {
      message: "An airplane can only have a maximum of 250 low class seats.",
    }),
  middlePrice: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Middle price must be a number",
    }),
  executivePrice: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Executive class price must be a number",
    }),
  lowPrice: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Low price must be a number",
    }),
  departureAirport: z.string().min(1, "Departure airport is required"),
  arrivalAirport: z.string().min(1, "Arrival airport is required"),
});

export const bookingSchema = z.object({
  flightId: z.string().min(1, "Flight selection is required"),
  seatType: z.enum(["low", "middle", "executive"], {
    errorMap: () => ({ message: "Please select a valid seat type" }),
  }),
  seatCount: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Seat count must be a number",
    })
    .refine((val) => val >= 1, {
      message: "Seat count must be at least 1",
    })
    .refine((val) => val <= 10, {
      message: "Maximum 10 seats can be booked at once",
    }),
  paymentMethod: z
    .enum(["card", "mpesa", "bank_transfer"], {
      errorMap: () => ({ message: "Please select a valid payment method" }),
    })
    .optional(),
  // Admin-only fields (optional for regular users)
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
  bookingStatus: z.enum(["confirmed", "cancelled", "completed"]).optional(),
});

export const bannerSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  destinationAirport: z.string(),
  largeImageUrl: z.string(),
  smallImageUrl: z.string(),
  isActive: z.boolean().optional().default(false),
});

export const payWithCardSchema = z.object({
  flightId: z.string(),
  amount: z.number(),
  seatCount: z.number().optional(),
  seatType: z.string().optional(),
});

export const testimonialSchema = z.object({
  rating: z
    .number()
    .int()
    .min(0)
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  descriptiveTitle: z.string().default("Cloud9 Patron").optional(),
  comment: z.string().min(10, "Comment is required"),
});

export const profileSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  profileImage: z.string().url().optional(),
  role: z.enum(["USER", "ADMIN", "MAIN_ADMIN"]).default("USER"),
});
