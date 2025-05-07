import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Error, NeutralMessage, Sucess } from "@/components/Messages";
import { Input } from "@/components/ui/input";

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
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [isChangingNumber, setIsChangingNumber] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !user?.email || !phoneNumber) {
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
          phoneNumber: phoneNumber, // Use the current phoneNumber state
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

  // Function to toggle phone number change form
  const toggleChangeNumber = () => {
    setIsChangingNumber(!isChangingNumber);
    setNewPhoneNumber("");
  };

  // Function to save the new phone number
  const handleNumberChange = () => {
    if (!newPhoneNumber) {
      setMessage("Please enter a valid phone number");
      setMessageType("error");
      return;
    }

    // Basic validation for phone number format
    const phoneRegex = /^(?:\+\d{1,3})?\d{9,15}$/;
    if (!phoneRegex.test(newPhoneNumber)) {
      setMessage(
        "Please enter a valid phone number format (e.g., +254712345678)"
      );
      setMessageType("error");
      return;
    }

    setPhoneNumber(newPhoneNumber);
    setIsChangingNumber(false);
    setMessage(`Phone number updated to ${newPhoneNumber}`);
    setMessageType("success");
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
    <div className="mx-2 px-0 py-[2px] md:p-4">
      <h1 className="font-bold">
        <span className="font-black">{user?.firstName}</span>, you&apos;re about
        to complete a booking.
      </h1>
      <p className="my-3 text-gray-500">
        Confirm your payment of{" "}
        <span className="text-foreground font-bold">Ksh {amount}</span> Lipa Na
        Mpesa, using the phone number,{" "}
        <span className="text-foreground font-bold">{phoneNumber}</span> to
        complete booking.
      </p>

      {isChangingNumber ? (
        <div className="my-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2">Change Phone Number</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="text"
              placeholder="+254 000 000 000"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              className="flex-grow"
            />
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={toggleChangeNumber}>
                Cancel
              </Button>
              <Button onClick={handleNumberChange}>Use Number</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between my-2 gap-2">
          <Button onClick={toggleChangeNumber}>Change Number</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Complete Payment"}
          </Button>
        </div>
      )}

      {message && (
        <div className="mt-4">
          {messageType === "error" && <Error message={message} />}
          {messageType === "success" && <Sucess message={message} />}
          {messageType === "neutral" && <NeutralMessage message={message} />}

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
