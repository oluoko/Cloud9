import crypto from "crypto";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";

const PAYSTACK_SECRET_KEY = process.env.LIVE_PAYSTACK_SECRET_KEY;

interface PaymentData {
  reference: string;
  amount: number;
  metadata?: {
    // userId?: string;
    // flightId?: string;
    // seatType?: string;
    // seatCount?: number;
    phoneNumber?: string;
    userName?: string;
  };
  customer: {
    email: string;
    phone?: string;
  };
}

interface TransferData {
  reference: string;
  amount: number;
  recipient: {
    name: string;
    accountNumber: string;
    bank: string;
  };
}

interface FailedTransferData {
  reference: string;
  amount: number;
  reason: string;
}

export function verifyPaystackSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  if (!PAYSTACK_SECRET_KEY) {
    console.error("Paystack secret key is not set");
    return false;
  }

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY || "")
    .update(payload)
    .digest("hex");

  return hash === signature;
}

export async function handleSuccessfulCharge(data: PaymentData) {
  try {
    const { phoneNumber, userName } = data.metadata || {};

    // Check if this payment reference already has a booking
    // const existingBooking = await prisma.booking.findFirst({
    //   where: {
    //     paymentReference: data.reference,
    //   },
    // });

    // if (existingBooking) {
    //   console.log(
    //     `Booking already exists for payment reference: ${data.reference}`
    //   );
    //   return;
    // }

    // Create a new booking
    if (phoneNumber && userName) {
      const amount = data.amount / 100; // Convert from lowest currency unit

      // const newBooking = await prisma.booking.create({
      //   data: {
      //     paymentReference: data.reference,
      //     totalAmount: amount,
      //     paymentStatus: "success",
      //     seatType: seatType || "economy",
      //     seatCount: seatCount || 1,
      //     contactEmail: data.customer.email,
      //     contactPhone: data.customer.phone || null,
      //     passengerNames: passengerNames || [],
      //     userId,
      //     flightId,
      //   },
      // });

      console.log(`New booking created: ${data.reference}`);
    } else {
      console.error("Missing required fields for booking creation:");
    }
  } catch (error) {
    console.error("Error creating booking:", error);
  }
}
export async function handleSuccessfulTransfer(data: TransferData) {
  console.log("Transfer successful:", data.reference);
  // Implement your logic for successful transfers
}
export async function handleFailedTransfer(data: FailedTransferData) {
  console.log("Transfer failed:", data.reference);
  // Implement your logic for failed transfers
}
