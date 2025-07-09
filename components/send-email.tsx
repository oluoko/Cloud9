"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SubmitButton } from "./custom-button";

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
            <SubmitButton
              text="Save Email"
              loadingText="Saving Email"
              isPending={isLoading}
              disabled={!email || isLoading}
              onClick={() => handleChangeEmail(email)}
            />
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
          <SubmitButton
            text="Send Email"
            loadingText="Sending Email"
            isPending={isLoading}
            disabled={!email || isLoading}
            onClick={handleSendEmail}
          />
        </div>
      )}
    </div>
  );
}
