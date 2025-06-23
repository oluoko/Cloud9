import { NextResponse } from "next/server";
import https from "https";
import prisma from "@/utils/db";

// let PAYSTACK_SECRET_KEY;

// if (process.env.NODE_ENV !== "production") {
//   PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// } else {
//   PAYSTACK_SECRET_KEY = process.env.LIVE_PAYSTACK_SECRET_KEY;
// }

const PAYSTACK_SECRET_KEY = process.env.LIVE_PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      amount,
      // email,
      phoneNumber,
      userName,
      email,
      // userId,
      // flightId,
      // seatType = "economy",
      // seatCount = 1,
    } = body;

    if (!amount || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // const flight = await prisma.flight.findUnique({
    //   where: { id: flightId },
    // });

    // if (!flight) {
    //   return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    // }

    try {
      const response = await initiatePaystackCharge({
        amount: Math.round(amount * 100),
        email: email,
        currency: "KES",
        metadata: {
          // userId,
          // flightId,
          // seatType,
          // seatCount,
          phoneNumber,
          userName,
        },
        mobile_money: {
          phone: phoneNumber,
          provider: "mpesa",
        },
      });

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error initiating Paystack charge:", error);
      return NextResponse.json(
        { error: "Failed to initiate payment" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}

function initiatePaystackCharge(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify(data);

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/charge",
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": params.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
}
