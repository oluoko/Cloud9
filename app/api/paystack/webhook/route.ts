import { NextResponse } from "next/server";
import {
  handleFailedTransfer,
  handleSuccessfulCharge,
  handleSuccessfulTransfer,
  verifyPaystackSignature,
} from "@/utils/paystack";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const jsonBody = JSON.parse(body);

    const signature = request.headers.get("x-paystack-signature");

    if (!verifyPaystackSignature(body, signature)) {
      console.error(`Invalid Paystack signature`);

      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = jsonBody.event;

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
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    console.log("Receipt received");
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ status: "success" }, { status: 200 });
  }
}
