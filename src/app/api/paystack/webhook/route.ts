import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/utils/db";

// Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Disable body parsing for raw access to the request body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // Get the raw request body as text
    const body = await request.text();
    const jsonBody = JSON.parse(body);

    // Get the Paystack signature from the header
    const signature = request.headers.get("x-paystack-signature");

    // Verify signature
    if (!verifySignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process the webhook event
    const event = jsonBody.event;

    // Handle different event types
    switch (event) {
      case "charge.success":
        await handleSuccessfulCharge(jsonBody.data);
        break;
      case "transfer.success":
        await handleSuccessfulTransfer(jsonBody.data);
        break;
      case "transfer.failed":
        await handleFailedTransfer(jsonBody.data);
        break;
      // Add more event handlers as needed
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Still return 200 OK to prevent Paystack from retrying
    return NextResponse.json({ status: "success" }, { status: 200 });
  }
}

// Verify webhook signature
function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY || "")
    .update(payload)
    .digest("hex");

  return hash === signature;
}

// Handle successful payment
interface PaymentData {
  reference: string;
  amount: number;
  metadata?: {
    userId?: string;
    flightId?: string;
    seatType?: string;
    seatCount?: number;
    passengerNames?: string[];
  };
  customer: {
    email: string;
    phone?: string;
  };
}

async function handleSuccessfulCharge(data: PaymentData) {
  try {
    console.log("Payment successful:", data.reference);

    // Extract metadata from the payment
    const metadata = data.metadata || {};
    const { userId, flightId, seatType, seatCount, passengerNames } = metadata;

    // Check if this payment reference already has a booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        paymentReference: data.reference,
      },
    });

    if (existingBooking) {
      console.log(
        `Booking already exists for payment reference: ${data.reference}`
      );
      return;
    }

    // Create a new booking
    if (userId && flightId) {
      const amount = data.amount / 100; // Convert from lowest currency unit

      const newBooking = await prisma.booking.create({
        data: {
          paymentReference: data.reference,
          totalAmount: amount,
          paymentStatus: "success",
          seatType: seatType || "economy",
          seatCount: seatCount || 1,
          contactEmail: data.customer.email,
          contactPhone: data.customer.phone || null,
          passengerNames: passengerNames || [],
          userId,
          flightId,
        },
      });

      console.log(`New booking created: ${newBooking.id}`);
    } else {
      console.error("Missing required fields for booking creation:", metadata);
    }
  } catch (error) {
    console.error("Error creating booking:", error);
  }
}

// Handle successful transfer
interface TransferData {
  reference: string;
  amount: number;
  recipient: {
    name: string;
    accountNumber: string;
    bank: string;
  };
}

async function handleSuccessfulTransfer(data: TransferData) {
  console.log("Transfer successful:", data.reference);
  // Implement your logic for successful transfers
}

// Handle failed transfer
interface FailedTransferData {
  reference: string;
  amount: number;
  reason: string;
}

async function handleFailedTransfer(data: FailedTransferData) {
  console.log("Transfer failed:", data.reference);
  // Implement your logic for failed transfers
}
