"use client";

import { SubmitButton } from "@/components/custom-button";
import { Error, NeutralMessage, Sucess } from "@/components/messages";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LipaNaMpesaProps {
  amount?: number;
  phoneNumber: string;
  userName?: string;
}

type MessageType = "neutral" | "success" | "error";

export default function LipaNaMpesa({
  amount = 2,
  phoneNumber,
  userName = "Unknown User",
}: LipaNaMpesaProps) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("neutral");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateMessage = (msg: string, type: MessageType) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !phoneNumber) {
      updateMessage("Please provide a valid amount and phone number.", "error");
      return;
    }

    setLoading(true);
    updateMessage("Processing payment...", "neutral");

    try {
      const initiateRes = await fetch("/api/paystack/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phoneNumber,
          userName,
          email: "johndoe@gmail.com",
        }),
      });

      const initiateData = await initiateRes.json();

      if (!initiateRes.ok || !initiateData.status) {
        updateMessage(
          initiateData.message || "Failed to initiate payment.",
          "error"
        );
        return;
      }

      if (initiateData.data.status === "pay_offline") {
        updateMessage(`${initiateData.data.display_text}.`, "neutral");
      }

      const verifyRes = await fetch(
        `/api/paystack/payment/verify?reference=${initiateData.data.reference}`
      );
      const verifyData = await verifyRes.json();

      if (
        verifyRes.ok &&
        verifyData.status &&
        verifyData.data.status === "success"
      ) {
        updateMessage("Payment completed successfully!", "success");
        router.push("/payment/success");
      } else {
        updateMessage(
          verifyData.data?.status
            ? `Payment status: ${verifyData.data.status}. Please wait for confirmation.`
            : verifyData.message || "Failed to verify payment status.",
          verifyData.data?.status ? "neutral" : "error"
        );
      }
    } catch {
      updateMessage(
        "An error occurred while initiating your payment.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const MessageComponent = {
    error: Error,
    success: Sucess,
    neutral: NeutralMessage,
  }[messageType];

  return (
    <div>
      <p className="my-3 text-gray-500">
        Confirm your payment of{" "}
        <span className="text-foreground font-bold">Ksh {amount}.</span> Lipa Na
        Mpesa using the phone number{" "}
        <span className="text-foreground font-bold">{phoneNumber}</span> to
        complete booking.
      </p>

      <SubmitButton
        onClick={handleSubmit}
        disabled={loading}
        text="Complete Payment"
        loadingText="Processing Payment"
      />

      {message && (
        <div className="mt-4">
          <MessageComponent message={message} />
        </div>
      )}
    </div>
  );
}
