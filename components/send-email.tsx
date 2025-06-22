"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LoadingDots from "@/components/loading-dots";

interface SendEmailProps {
  bookingId: string;
  initialEmail: string;
}

export default function SendEmail({ bookingId, initialEmail }: SendEmailProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.success("Email sent successfully!");
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = (newEmail: string) => {
    setIsLoading(true);
    setEmail(newEmail);
    setChangingEmail(false);
    toast.success("Email changed successfully!");
    setIsLoading(false);
  };

  const discardChanges = () => {
    toast.info("Changes discarded.");
    setEmail(initialEmail);
    setChangingEmail(false);
  };
  return (
    <div className="grid items-center gap-2">
      <p className="my-4">
        You&apos;re about to send an email with the booking details to this
        email address: <span className="font-semibold">{email}</span>.
      </p>
      {changingEmail ? (
        <>
          <Input
            type="email"
            placeholder="Enter another email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between gap-2 w-full my-2">
            <Button
              onClick={discardChanges}
              disabled={isLoading}
              variant="outline"
            >
              Discard Changes
            </Button>
            <Button
              onClick={() => handleChangeEmail(email)}
              disabled={!email || isLoading}
            >
              {isLoading ? (
                <LoadingDots text="Saving New Email" />
              ) : (
                "Save New Email"
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-between gap-2 w-full my-2">
          <Button
            onClick={() => setChangingEmail(true)}
            disabled={isLoading}
            variant="outline"
          >
            Change Email
          </Button>
          <Button onClick={handleSendEmail} disabled={!email || isLoading}>
            {isLoading ? <LoadingDots text="Sending Email" /> : "Send Email"}
          </Button>
        </div>
      )}
    </div>
  );
}
