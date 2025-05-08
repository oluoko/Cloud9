// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import https from "https";

// Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: Request) {
  try {
    // Get reference from URL
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }

    // Verify the transaction
    const response = await verifyPaystackTransaction(reference);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Transaction verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify transaction" },
      { status: 500 }
    );
  }
}

// Helper function to verify transaction with Paystack
interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: string;
    [key: string]: unknown; // Adjust this based on the actual API response structure
  };
}

function verifyPaystackTransaction(
  reference: string
): Promise<PaystackTransactionResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${encodeURIComponent(reference)}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}
