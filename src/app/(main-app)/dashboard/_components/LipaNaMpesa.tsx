import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Error, NeutralMessage, Sucess } from "@/components/Messages";

interface LipaNaMpesaProps {
  User: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    phoneNumber: string | null;
  };
  flightId: string;
  seatType: string;
  seatCount: number;
  passengerNames: string[];
}

export default function LipaNaMpesa({
  amount,
  user,
  flightId,
  seatType = "economy",
  seatCount = 1,
  passengerNames = [],
}: {
  amount: number;
  user: LipaNaMpesaProps["User"];
  flightId: string;
  seatType?: string;
  seatCount?: number;
  passengerNames?: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "neutral" | "success" | "error"
  >("neutral");
  const [reference, setReference] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !user?.email || !user?.phoneNumber) {
      setMessage("Please provide all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Initiating payment...");
    setMessageType("neutral");

    try {
      const response = await fetch("/api/paystack/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          userId: user.id,
          flightId,
          seatType,
          seatCount,
          passengerNames,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setReference(data.data.reference);

        if (data.data.status === "pay_offline") {
          setMessage(
            `${data.data.display_text}. Your payment is being processed. Please wait...`
          );
          setMessageType("neutral");
        } else {
          setMessage(
            "Payment initiated successfully. Standby to input your MPESA pin."
          );
          setMessageType("success");
        }
      } else {
        setMessage(
          `Payment initiation failed: ${data.message || "Unknown error"}`
        );
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred while processing your payment");
      setMessageType("error");
      console.error("Payment error::", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!reference) {
      setMessage("No payment reference available");
      setMessageType("error");
      return;
    }

    setIsVerifying(true);
    setMessage("Checking payment status...");
    setMessageType("neutral");

    try {
      const response = await fetch(
        `/api/paystack/payment/verify?reference=${reference}`
      );
      const data = await response.json();

      if (response.ok && data.status) {
        if (data.data.status === "success") {
          setMessage("Payment was successful! Creating your booking...");
          setMessageType("success");

          // Check if booking exists
          const bookingResponse = await fetch(
            `/api/booking/check-reference?reference=${reference}`
          );
          const bookingData = await bookingResponse.json();

          if (bookingResponse.ok && bookingData.bookingId) {
            setBookingId(bookingData.bookingId);
            setIsProcessingComplete(true);

            // Redirect to booking after a short delay
            setTimeout(() => {
              router.push(`/dashboard/bookings/${bookingData.bookingId}`);
            }, 3000);
          } else {
            // Booking not yet created, wait and check again after a short delay
            setTimeout(checkPaymentStatus, 5000);
          }
        } else {
          setMessage(`Payment status: ${data.data.status}`);
          setMessageType("neutral");
        }
      } else {
        setMessage(
          `Failed to verify payment: ${data.message || "Unknown error"}`
        );
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred while checking payment status");
      setMessageType("error");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isProcessingComplete) {
    return (
      <Loader
        mainText="Payment Successful!"
        subText="Preparing your booking details"
      />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        <span className="text-2xl font-black">{user?.firstName}</span>,
        you&apos;re about to complete a booking.
      </h1>
      <p className="my-3 text-lg text-gray-500">
        Please confirm your payment of{" "}
        <span className="text-foreground font-bold">Ksh {amount}</span> via Lipa
        Na Mpesa, using the phone number,{" "}
        <span className="text-foreground font-bold">{user?.phoneNumber}</span>{" "}
        to complete your booking.
      </p>
      <div className="flex justify-between my-2">
        <Button>Use a different number</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Complete Payment"}
        </Button>
      </div>

      {message && (
        <div className="mt-4">
          {messageType === "error" && <Error message={message} />}
          {messageType === "success" && <Sucess message={message} />}
          {messageType === "neutral" && <NeutralMessage message={message} />}

          {reference && (
            <p className="text-sm text-gray-600 mt-1">Reference: {reference}</p>
          )}

          {reference && !isVerifying && (
            <Button
              onClick={checkPaymentStatus}
              disabled={loading || isVerifying}
              className="mt-3"
            >
              {isVerifying ? "Checking..." : "Check Payment Status"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
