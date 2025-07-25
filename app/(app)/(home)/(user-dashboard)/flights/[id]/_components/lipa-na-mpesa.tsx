"use client";

import { SubmitButton } from "@/components/custom-button";
import { Error, NeutralMessage, Sucess } from "@/components/messages";
import { PhoneInput } from "@/components/phone-input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMe } from "@/contexts/use-user";

type MessageType = "neutral" | "success" | "error";

export default function LipaNaMpesa({
  amount,
  flightId,
  seatCount,
  seatType,
}: {
  amount: number;
  flightId: string;
  seatCount?: number;
  seatType?: string;
}) {
  const { me, isLoading, error } = useMe();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("neutral");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(me?.phoneNumber || "");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const router = useRouter();

  const updateMessage = (msg: string, type: MessageType) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
    setMessage("");
  };

  const handleSavePhone = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      updateMessage("Please enter a valid phone number.", "error");
      return;
    }
    setIsEditingPhone(false);
    updateMessage("Phone number updated successfully.", "success");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleCancelEdit = () => {
    setPhoneNumber(me?.phoneNumber || "");
    setIsEditingPhone(false);
    setMessage("");
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
          phoneNumber: phoneNumber,
          userName: `${me?.firstName} ${me?.lastName}`,
          email: me?.email,
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
        Mpesa using the phone number below to complete booking.
      </p>

      {/* Phone Number Section */}
      <div className="mb-4 p-4 border rounded-lg bg-accent-background">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Payment Phone Number
          </h3>
          {!isEditingPhone && (
            <button
              type="button"
              onClick={handleEditPhone}
              className="text-sm text-primary  underline"
              disabled={loading}
            >
              Change
            </button>
          )}
        </div>

        {isEditingPhone ? (
          <div className="space-y-3">
            <PhoneInput
              value={phoneNumber}
              onChange={handlePhoneChange}
              defaultCountry="KE"
              placeholder="Enter phone number"
              className="w-full"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSavePhone}
                className="px-3 py-1 text-sm bg-green-600 text-foreground rounded hover:bg-green-700"
                disabled={loading}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm bg-gray-600 text-foreground rounded hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-foreground font-bold">
            {phoneNumber || "No phone number set"}
          </div>
        )}
      </div>

      <SubmitButton
        onClick={handleSubmit}
        disabled={loading || isEditingPhone || !phoneNumber}
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
